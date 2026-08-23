'use client'

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  UserCircle,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/pendaftaran': 'Pendaftaran',
  '/admin/siswa': 'Siswa',
  '/admin/pengaturan': 'Pengaturan',
}

export default function AdminTopbar() {
  const pathname = usePathname()

  const [email, setEmail] = useState('Admin')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email) {
        setEmail(user.email)
      }
    }

    getUser()
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
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile */}
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-lg font-bold capitalize tracking-tight text-slate-900">
              {title}
            </h2>

            <p className="hidden text-xs text-slate-400 sm:block">
              Kelola sistem Desa Kudaung
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 md:flex"
          >
            <Search size={17} />

            <span>Cari sesuatu...</span>

            <kbd className="ml-5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">
              /
            </kbd>
          </button>

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={19} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:gap-3 sm:pl-4">
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-xs font-semibold text-slate-800">
                {email}
              </p>

              <p className="text-[11px] text-slate-400">
                Administrator
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
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