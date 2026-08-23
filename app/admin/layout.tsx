import { ReactNode } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminTopbar from './components/AdminTopbar'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Area kanan */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <AdminTopbar />

        {/* Main Content */}
        <main className="min-h-[calc(100vh-73px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}