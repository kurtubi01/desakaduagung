import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Mail,
  ChevronRight,
} from 'lucide-react'

type Notifikasi = {
  id: string
  pesan_id: string | null
  judul: string
  pesan: string
  tipe: string
  dibaca: boolean
  created_at: string
}

/* =========================================================
   UTILITIES
========================================================= */

function formatTanggal(tanggal: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(tanggal))
}

/* =========================================================
   ICON NOTIFIKASI
========================================================= */

function NotificationIcon({
  dibaca,
  tipe,
}: {
  dibaca: boolean
  tipe: string
}) {
  const iconClass = `
    flex h-10 w-10 shrink-0 items-center justify-center
    border
    ${
      dibaca
        ? 'border-slate-200 bg-slate-50 text-slate-500'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }
  `

  if (tipe === 'pesan') {
    return (
      <div className={iconClass}>
        <MessageCircle size={18} />
      </div>
    )
  }

  return (
    <div className={iconClass}>
      <Bell size={18} />
    </div>
  )
}

/* =========================================================
   ITEM NOTIFIKASI
========================================================= */

function NotifikasiItem({
  item,
  tandaiDibaca,
  hapusNotifikasi,
}: {
  item: Notifikasi
  tandaiDibaca: (formData: FormData) => void
  hapusNotifikasi: (formData: FormData) => void
}) {
  return (
    <article
      className={`
        group border bg-white transition-colors
        ${
          item.dibaca
            ? 'border-slate-200 hover:border-slate-300'
            : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
        }
      `}
    >
      <div className="flex gap-4 p-4 sm:p-5">
        {/* Icon */}
        <NotificationIcon
          dibaca={item.dibaca}
          tipe={item.tipe}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {item.judul}
              </h3>

              {!item.dibaca && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 bg-emerald-600" />
                  Baru
                </span>
              )}
            </div>

            <time
              dateTime={item.created_at}
              className="shrink-0 text-xs text-slate-400"
            >
              {formatTanggal(item.created_at)}
            </time>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {item.pesan}
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.pesan_id && (
              <Link
                href="/admin/pesan"
                className="
                  inline-flex items-center gap-1.5
                  border border-slate-200
                  bg-white px-3 py-1.5
                  text-xs font-semibold text-slate-700
                  transition-colors
                  hover:border-slate-300
                  hover:bg-slate-50
                "
              >
                <Mail size={14} />
                Lihat Pesan
                <ExternalLink size={13} />
              </Link>
            )}

            {!item.dibaca && (
              <form action={tandaiDibaca}>
                <input
                  type="hidden"
                  name="id"
                  value={item.id}
                />

                <button
                  type="submit"
                  className="
                    inline-flex items-center gap-1.5
                    border border-slate-200
                    bg-white px-3 py-1.5
                    text-xs font-semibold text-slate-600
                    transition-colors
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                  "
                >
                  <CheckCheck size={14} />
                  Tandai Dibaca
                </button>
              </form>
            )}

            <form action={hapusNotifikasi}>
              <input
                type="hidden"
                name="id"
                value={item.id}
              />

              <button
                type="submit"
                className="
                  inline-flex items-center gap-1.5
                  border border-transparent
                  px-3 py-1.5
                  text-xs font-semibold text-slate-400
                  transition-colors
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </form>
          </div>
        </div>

        {/* Arrow */}
        {item.pesan_id && (
          <div className="hidden shrink-0 pt-1 text-slate-300 sm:block">
            <ChevronRight size={18} />
          </div>
        )}
      </div>
    </article>
  )
}

/* =========================================================
   EMPTY STATE
========================================================= */

function NotifikasiEmpty() {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
        <Bell size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        Belum ada notifikasi
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
        Notifikasi baru akan muncul otomatis ketika pengunjung mengirimkan
        pesan melalui halaman kontak.
      </p>
    </div>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminNotifikasiPage() {
  const supabase = await createClient()

  const { data: notifikasiList, error } = await supabase
    .from('notifikasi')
    .select('*')
    .order('created_at', {
      ascending: false,
    })

  /* =======================================================
     SERVER ACTIONS
  ======================================================= */

  async function tandaiSemuaDibaca() {
    'use server'

    const supabase = await createClient()

    await supabase
      .from('notifikasi')
      .update({
        dibaca: true,
      })
      .eq('dibaca', false)

    revalidatePath('/admin/notifikasi')
  }

  async function tandaiDibaca(formData: FormData) {
    'use server'

    const id = formData.get('id') as string

    if (!id) return

    const supabase = await createClient()

    await supabase
      .from('notifikasi')
      .update({
        dibaca: true,
      })
      .eq('id', id)

    revalidatePath('/admin/notifikasi')
  }

  async function hapusNotifikasi(formData: FormData) {
    'use server'

    const id = formData.get('id') as string

    if (!id) return

    const supabase = await createClient()

    await supabase
      .from('notifikasi')
      .delete()
      .eq('id', id)

    revalidatePath('/admin/notifikasi')
  }

  /* =======================================================
     STATISTIK
  ======================================================= */

  const totalNotifikasi = notifikasiList?.length ?? 0

  const belumDibaca =
    notifikasiList?.filter((item) => !item.dibaca).length ?? 0

  const sudahDibaca =
    notifikasiList?.filter((item) => item.dibaca).length ?? 0

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                <Bell size={14} />
                Pusat Notifikasi
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Notifikasi
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Pantau pemberitahuan dan aktivitas pesan yang masuk
                dari pengunjung website Desa Kadu Agung.
              </p>
            </div>

            {belumDibaca > 0 && (
              <form action={tandaiSemuaDibaca}>
                <button
                  type="submit"
                  className="
                    inline-flex w-full items-center justify-center gap-2
                    border border-slate-200
                    bg-white px-4 py-2.5
                    text-xs font-bold text-slate-700
                    shadow-sm
                    transition-colors
                    hover:border-emerald-200
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    sm:w-auto
                  "
                >
                  <CheckCheck size={16} />
                  Tandai Semua Dibaca
                </button>
              </form>
            )}
          </div>
        </header>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid grid-cols-2 border-b border-slate-200 bg-white sm:grid-cols-3">
          <div className="border-r border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalNotifikasi}
            </p>
          </div>

          <div className="border-r border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">
              Belum Dibaca
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {belumDibaca}
            </p>
          </div>

          <div className="col-span-2 p-4 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">
              Sudah Dibaca
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-700">
              {sudahDibaca}
            </p>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Gagal mengambil data notifikasi
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            LIST
        ================================================= */}

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Aktivitas Terbaru
              </h2>

              <p className="text-xs text-slate-500">
                Notifikasi terbaru ditampilkan terlebih dahulu.
              </p>
            </div>
          </div>

          {notifikasiList && notifikasiList.length > 0 ? (
            <div className="space-y-3">
              {notifikasiList.map((item: Notifikasi) => (
                <NotifikasiItem
                  key={item.id}
                  item={item}
                  tandaiDibaca={tandaiDibaca}
                  hapusNotifikasi={hapusNotifikasi}
                />
              ))}
            </div>
          ) : (
            <NotifikasiEmpty />
          )}
        </section>
      </div>
    </main>
  )
}