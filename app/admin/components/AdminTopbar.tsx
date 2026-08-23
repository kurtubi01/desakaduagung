'use client'

import { Bell, ChevronDown, Menu, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/pesan': 'Pesan Masuk',
  '/admin/pendaftaran': 'Pendaftaran',
  '/admin/siswa': 'Siswa',
  '/admin/pengaturan': 'Pengaturan',
  '/admin/notifikasi': 'Notifikasi',
}

interface AdminTopbarProps {
  onToggleSidebar?: () => void
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const pathname = usePathname()
  const [email, setEmail] = useState('Admin')
  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const supabase = createClient()

    async function getUnreadNotificationCount() {
      const { count, error } = await supabase
        .from('notifikasi')
        .select('*', { count: 'exact', head: true })
        .eq('dibaca', false)

      if (error) {
        setUnreadCount(0)
        return
      }

      setUnreadCount(count ?? 0)
    }

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setEmail(user.email)
    }

    getUser()
    getUnreadNotificationCount()

    const channel = supabase
      .channel('notifikasi_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifikasi' },
        () => getUnreadNotificationCount()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const title =
    pageTitles[pathname] ||
    pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ') ||
    'Dashboard'

  return (
    <header className="sticky top-0 z-30 h-[73px] border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="relative z-10 border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="hidden text-xs text-slate-400 sm:block">
              Kelola sistem Desa Kadu Agung
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/admin/notifikasi"
            className="relative flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Lihat notifikasi"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center border border-white bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:gap-3 sm:pl-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-xs font-semibold text-slate-800">
                {email}
              </p>
              <p className="text-[11px] text-slate-400">Administrator</p>
            </div>

            <button type="button" className="flex items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
                <UserCircle size={22} />
              </div>
              <ChevronDown
                size={15}
                className="hidden text-slate-400 sm:block"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}