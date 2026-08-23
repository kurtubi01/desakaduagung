'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  X,
  GraduationCap,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Berita',
    href: '/admin/berita',
    icon: FileText,
  },
  {
    title: 'Siswa',
    href: '/admin/siswa',
    icon: Users,
  },
  {
    title: 'Pengaturan',
    href: '/admin/pengaturan',
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()

    window.location.href = '/login'
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Overlay Mobile */}
      {open && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-200
          bg-white
          shadow-xl shadow-slate-900/5
          transition-transform duration-300
          lg:translate-x-0 lg:shadow-none
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-[73px] items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/admin/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
              <GraduationCap size={22} />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                DesaKudaung
              </h1>

              <p className="text-[11px] font-medium text-slate-400">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Close Mobile */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Menu Utama
            </p>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3.5 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      active
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.4 : 2}
                    className={
                      active
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }
                  />

                  <span className="flex-1">
                    {item.title}
                  </span>

                  {active && (
                    <ChevronRight
                      size={16}
                      className="text-slate-300"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={19}
              className="text-slate-400 transition group-hover:text-red-500"
            />

            <span>Keluar</span>
          </button>

          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-medium text-slate-400">
              Admin Panel
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              Desa Kudaung
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile menu trigger */}
      <MobileMenuButton onClick={() => setOpen(true)} />
    </>
  )
}

function MobileMenuButton({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buka menu"
      className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 lg:hidden"
    >
      <LayoutDashboard size={21} />
    </button>
  )
}