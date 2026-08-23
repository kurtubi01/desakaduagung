'use client'

import { FormEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const redirect = searchParams.get('redirect') || '/admin/dashboard'

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!turnstileToken) {
      setError('Silakan selesaikan verifikasi keamanan terlebih dahulu.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: turnstileToken,
        }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(
          verifyData.message || 'Verifikasi keamanan gagal.'
        )
      }

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (authError) {
        throw new Error('Email atau password salah.')
      }

      if (!data.user) {
        throw new Error('Login gagal.')
      }

      const role = data.user.app_metadata?.role

      if (role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Akun ini tidak memiliki akses admin.')
      }

      router.replace(redirect)
      router.refresh()
    } catch (err: unknown) {
      turnstileRef.current?.reset()
      setTurnstileToken('')

      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat login.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-5 py-10">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 bg-emerald-500/10" />
        <div className="absolute bottom-0 right-0 h-80 w-80 bg-emerald-500/10" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 border border-slate-200 bg-white/30" />
      </div>

      <div className="relative z-10 w-full max-w-[430px]">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">

          <div className="mb-5 flex h-24 w-24 items-center justify-center border border-slate-200 bg-white shadow-sm">
            <Image
              src="/images/Logo_kabupaten_serang.png"
              alt="Logo Desa"
              width={72}
              height={72}
              priority
              className="h-auto w-auto object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            SILAHKAN LOGIN
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistem Informasi Desa Kadu Agung
          </p>
        </div>

        {/* Login Card */}
        <div className="border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

          {/* Header */}
          <div className="border-b border-slate-200 px-7 py-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center bg-emerald-600 text-white">
                <LockKeyhole size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Masuk ke Dashboard
                </h2>

                <p className="text-xs text-slate-500">
                  Gunakan akun administrator Anda
                </p>
              </div>

            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5 px-7 py-7"
          >

            {/* Error */}
            {error && (
              <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="
                  w-full
                  border border-slate-300
                  bg-slate-50
                  px-4 py-3
                  text-sm text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-600
                  focus:bg-white
                  focus:ring-1
                  focus:ring-emerald-600
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="
                  w-full
                  border border-slate-300
                  bg-slate-50
                  px-4 py-3
                  text-sm text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-600
                  focus:bg-white
                  focus:ring-1
                  focus:ring-emerald-600
                "
              />
            </div>

            {/* Turnstile */}
            <div className="border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-emerald-600"
                />

                <span className="text-xs font-medium text-slate-600">
                  Verifikasi keamanan
                </span>
              </div>

              <Turnstile
                ref={turnstileRef}
                siteKey={
                  process.env
                    .NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
                }
                onSuccess={(token) => {
                  setTurnstileToken(token)
                  setError('')
                }}
                onExpire={() => {
                  setTurnstileToken('')
                }}
                onError={() => {
                  setTurnstileToken('')
                  setError(
                    'Gagal memuat verifikasi keamanan. Coba refresh halaman.'
                  )
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                bg-slate-900
                px-4
                py-3.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-7 py-4">
            <p className="text-center text-xs text-slate-500">
              Akses khusus administrator
            </p>
          </div>

        </div>

        {/* Bottom */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Sistem Informasi Desa Kadu Agung
        </p>

      </div>
    </main>
  )
}