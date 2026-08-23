import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import StatusSelect from './StatusSelect'
import {
  Trash2,
  MessageSquare,
  AlertCircle,
  Phone
} from 'lucide-react'

type PesanKontak = {
  id: string
  nama: string
  alamat: string | null
  pertanyaan: string
  whatsapp: string
  status: 'baru' | 'dibaca' | 'diproses' | 'selesai'
  dibaca: boolean
  created_at: string
}

// Komponen Skeleton Loading
function PesanSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse border border-slate-300 bg-white p-5">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200"></div>
              <div className="h-3 w-20 bg-slate-100"></div>
            </div>
            <div className="h-5 w-16 bg-slate-200"></div>
          </div>
          <div className="space-y-3">
            <div className="h-20 w-full bg-slate-100"></div>
            <div className="h-3 w-2/3 bg-slate-100"></div>
          </div>
          <div className="mt-5 space-y-3 pt-3 border-t border-slate-100">
            <div className="h-8 w-full bg-slate-200"></div>
            <div className="flex gap-2">
              <div className="h-8 flex-1 bg-slate-100"></div>
              <div className="h-8 w-8 bg-slate-100"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Server Action: Update Status Pesan
async function updateStatusPesan(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const supabase = await createClient()
  await supabase
    .from('pesan_kontak')
    .update({ status, dibaca: true })
    .eq('id', id)

  revalidatePath('/admin/pesan')
}

// Server Action: Hapus Pesan
async function hapusPesan(formData: FormData) {
  'use server'
  const id = formData.get('id') as string

  const supabase = await createClient()
  await supabase.from('pesan_kontak').delete().eq('id', id)

  revalidatePath('/admin/pesan')
}

// Async Data Fetcher Component
async function PesanListContent({ status }: { status?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('pesan_kontak')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'semua') {
    query = query.eq('status', status)
  }

  const { data: pesanList, error } = await query

  if (error) {
    return (
      <div className="mb-6 flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>Gagal mengambil data pesan: {error.message}</span>
      </div>
    )
  }

  if (!pesanList || pesanList.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-slate-300 bg-white p-12 text-center">
        <MessageSquare className="mb-3 h-10 w-10 text-slate-400" />
        <p className="text-base font-bold text-slate-700">Tidak ada pesan</p>
        <p className="text-sm text-slate-500">Belum ada pesan masuk untuk kategori ini.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pesanList.map((item: PesanKontak) => (
        <div
          key={item.id}
          className={`flex flex-col justify-between border bg-white p-5 shadow-none transition-colors ${
            !item.dibaca ? 'border-l-4 border-l-emerald-600 border-slate-300' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900">{item.nama}</h3>
                <p className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span
                className={`border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  item.status === 'baru'
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : item.status === 'diproses'
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : item.status === 'selesai'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-100 text-slate-600'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p className="line-clamp-4 border border-slate-200 bg-slate-50 p-3 text-slate-800">
                "{item.pertanyaan}"
              </p>
              {item.alamat && (
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Alamat:</span> {item.alamat}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-3">
            <a
              href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Phone size={14} />
              Balas via WhatsApp ({item.whatsapp})
            </a>

            <div className="flex items-center justify-between gap-2">
              <StatusSelect
                id={item.id}
                currentStatus={item.status}
                onUpdateStatus={updateStatusPesan}
              />

              <form action={hapusPesan}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="border border-slate-300 p-1.5 text-slate-500 hover:border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function AdminPesanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pesan Masuk</h1>
          <p className="text-sm text-slate-600">Kelola dan tanggapi pertanyaan dari warga Desa Kadu Agung.</p>
        </div>

        {/* Filter Status (Flat UI) */}
        <div className="flex flex-wrap gap-2">
          {['semua', 'baru', 'dibaca', 'diproses', 'selesai'].map((item) => (
            <a
              key={item}
              href={`/admin/pesan${item === 'semua' ? '' : `?status=${item}`}`}
              className={`border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                (status === item || (!status && item === 'semua'))
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <Suspense fallback={<PesanSkeleton />}>
        <PesanListContent status={status} />
      </Suspense>
    </div>
  )
}