'use client'

import { FormEvent, useState, useRef } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { createClient } from '@/lib/supabase/client'

export default function KontakSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [showPopup, setShowPopup] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 1. Validasi keberadaan token Turnstile
    if (!turnstileToken) {
      setStatusMessage({
        type: 'error',
        text: 'Silakan selesaikan verifikasi keamaan (Turnstile) terlebih dahulu.',
      })
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)
    setShowPopup(false)

    const form = e.currentTarget
    const formData = new FormData(form)

    const nama = formData.get('nama') as string
    const alamat = formData.get('alamat') as string
    const pertanyaan = formData.get('pertanyaan') as string
    const whatsapp = formData.get('whatsapp') as string

    try {
      // 2. Verifikasi Token Turnstile ke API Route Server
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Verifikasi keamanan gagal.')
      }

      // 3. Jika verifikasi lolos, simpan ke Supabase
      const supabase = createClient()

      const { error } = await supabase.from('pesan_kontak').insert([
        {
          nama,
          alamat,
          pertanyaan,
          whatsapp,
          status: 'baru',
          dibaca: false,
        },
      ])

      if (error) throw error

      // Reset form & captcha
      form.reset()
      turnstileRef.current?.reset()
      setTurnstileToken('')

      // Popup sukses
      setShowPopup(true)

      // Hilangkan popup otomatis setelah 5 detik
      setTimeout(() => {
        setShowPopup(false)
      }, 5000)

      // Status sukses di dalam form
      setStatusMessage({
        type: 'success',
        text: 'Pesan Anda berhasil dikirim! Tim kami akan segera merespons.',
      })
    } catch (err: unknown) {
      console.error('Error sending message:', err)

      // Reset captcha jika gagal
      turnstileRef.current?.reset()
      setTurnstileToken('')

      setStatusMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Gagal mengirim pesan. Silakan coba lagi nanti.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* =========================================================
          POPUP NOTIFIKASI SUKSES
      ========================================================== */}
      {showPopup && (
        <div className="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="relative overflow-hidden border border-emerald-200 bg-white shadow-2xl">
            {/* Progress bar */}
            <div className="absolute left-0 top-0 h-1 w-full bg-emerald-500" />

            <div className="flex items-start gap-4 p-5">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={25} />
              </div>

              {/* Content */}
              <div className="flex-1 pr-6">
                <h4 className="font-bold text-slate-900">
                  Pesan Berhasil Dikirim
                </h4>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Terima kasih. Pesan Anda telah diterima oleh Pemerintah Desa
                  Kadu Agung.
                </p>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="absolute right-3 top-4 text-slate-400 transition hover:text-slate-700"
                aria-label="Tutup notifikasi"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <section
        id="kontak"
        className="relative overflow-hidden bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 inline-flex bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Informasi & Kontak
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Informasi & Kontak Desa Kadu Agung
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Hubungi atau tanyakan kepada kami melalui form di bawah ini.
            </p>
          </div>

          {/* CONTENT */}
          <div className="grid gap-8 lg:grid-cols-5">

            {/* FORM */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
              <div className="mb-7">
                <h3 className="text-xl font-bold text-slate-900">
                  Kirim Pertanyaan
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Silakan isi data dan pertanyaan Anda.
                </p>
              </div>

              {/* ALERT DALAM FORM */}
              {statusMessage && (
                <div
                  className={`mb-6 flex items-center gap-3 p-4 text-sm font-medium ${
                    statusMessage.type === 'success'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                  )}

                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* NAMA */}
                <div>
                  <label
                    htmlFor="nama"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nama
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* ALAMAT */}
                <div>
                  <label
                    htmlFor="alamat"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Alamat
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />

                    <textarea
                      id="alamat"
                      name="alamat"
                      required
                      rows={3}
                      placeholder="Masukkan alamat Anda"
                      className="w-full resize-none border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* PERTANYAAN */}
                <div>
                  <label
                    htmlFor="pertanyaan"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Pertanyaan
                  </label>

                  <textarea
                    id="pertanyaan"
                    name="pertanyaan"
                    required
                    rows={5}
                    placeholder="Tuliskan pertanyaan atau pesan Anda..."
                    className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* WHATSAPP */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nomor WhatsApp
                  </label>

                  <div className="relative">
                    <MessageCircle
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      className="w-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* CLOUDFLARE TURNSTILE WIDGET */}
                <div className="py-2">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={
                      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
                      ''
                    }
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                    onError={() => setTurnstileToken('')}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className="group inline-flex w-full items-center justify-center gap-2 bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Submit
                      <Send
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* KONTAK */}
            <div className="space-y-6 lg:col-span-2">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Atau Hubungi Kami di
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Informasi kontak resmi Pemerintah Desa Kadu Agung.
                </p>
              </div>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/628xxxxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
                  <MessageCircle size={23} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    WhatsApp
                  </p>

                  <p className="mt-0.5 font-semibold text-slate-900">
                    08xxxxxxxxxx
                  </p>
                </div>
              </a>

              {/* TELEPON */}
              <a
                href="tel:+6221xxxxxxxx"
                className="group flex items-center gap-4 border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
                  <Phone size={23} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Telepon Kantor
                  </p>

                  <p className="mt-0.5 font-semibold text-slate-900">
                    (021) xxxxxxxx
                  </p>
                </div>
              </a>

              {/* MAPS */}
              <div className="border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-emerald-50 text-emerald-600">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Alamat
                    </p>

                    <p className="font-semibold text-slate-900">
                      Desa Kadu Agung
                    </p>
                  </div>
                </div>

                <div className="aspect-[16/10] w-full">
                  <iframe
                    title="Lokasi Desa Kadu Agung"
                    src="https://www.google.com/maps?q=Desa%20Kadu%20Agung&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}