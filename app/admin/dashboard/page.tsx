import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.app_metadata?.role

  if (role !== 'admin') {
    redirect('/login?error=unauthorized')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">
        Dashboard Admin
      </h1>

      <p className="mt-2">
        Selamat datang, {user.email}
      </p>
      <LogoutButton />
    </main>
  )
}