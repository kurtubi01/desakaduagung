'use client'

import { useState } from 'react'
import AdminTopbar from './components/AdminTopbar'
import AdminSidebar from './components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Passing state & function ke Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Passing handler ke Topbar */}
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}