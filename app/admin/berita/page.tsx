'use client'

import { FormEvent, useEffect, useState } from 'react'
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Save,
    FileText,
    Eye,
    Archive,
} from 'lucide-react'

interface Berita {
    id: string
    pengguna_id: string
    judul: string
    slug: string
    ringkasan: string | null
    isi: string
    gambar_utama: string | null
    kategori: string | null
    tag: string[]
    status: 'draft' | 'diterbitkan' | 'diarsipkan'
    tanggal_terbit: string | null
    judul_seo: string | null
    deskripsi_seo: string | null
    dibuat_pada: string
    diperbarui_pada: string
}

interface FormBerita {
    judul: string
    slug: string
    ringkasan: string
    isi: string
    gambar_utama: string
    kategori: string
    tag: string
    status: 'draft' | 'diterbitkan' | 'diarsipkan'
    judul_seo: string
    deskripsi_seo: string
}

const formAwal: FormBerita = {
    judul: '',
    slug: '',
    ringkasan: '',
    isi: '',
    gambar_utama: '',
    kategori: '',
    tag: '',
    status: 'draft',
    judul_seo: '',
    deskripsi_seo: '',
}

function buatSlug(judul: string) {
    return judul
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
}

export default function BeritaPage() {
    const [berita, setBerita] = useState<Berita[]>([])
    const [loading, setLoading] = useState(true)
    const [menyimpan, setMenyimpan] = useState(false)

    const [modalTerbuka, setModalTerbuka] = useState(false)
    const [modeEdit, setModeEdit] = useState(false)
    const [formFile, setFormFile] = useState<File | null>(null)
const [previewGambar, setPreviewGambar] = useState<string | null>(null)
    const [beritaDipilih, setBeritaDipilih] =
        useState<Berita | null>(null)

    const [form, setForm] = useState<FormBerita>(formAwal)

    const [pencarian, setPencarian] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    async function ambilBerita() {
        try {
            setLoading(true)

            const params = new URLSearchParams()

            if (pencarian) {
                params.set('cari', pencarian)
            }

            if (filterStatus) {
                params.set('status', filterStatus)
            }

            const response = await fetch(
                `/api/berita?${params.toString()}`
            )

            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan)
            }

            setBerita(hasil.data || [])
        } catch (error) {
            console.error(error)
            alert(
                error instanceof Error
                    ? error.message
                    : 'Gagal mengambil berita.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        ambilBerita()
    }, [filterStatus])

    function bukaTambah() {
        setModeEdit(false)
        setBeritaDipilih(null)
        setForm(formAwal)
        setModalTerbuka(true)
    }

    function bukaEdit(item: Berita) {
        setModeEdit(true)
        setBeritaDipilih(item)

        setForm({
            judul: item.judul,
            slug: item.slug,
            ringkasan: item.ringkasan || '',
            isi: item.isi,
            gambar_utama: item.gambar_utama || '',
            kategori: item.kategori || '',
            tag: item.tag?.join(', ') || '',
            status: item.status,
            judul_seo: item.judul_seo || '',
            deskripsi_seo: item.deskripsi_seo || '',
        })

        setModalTerbuka(true)
    }

    function tutupModal() {
        setModalTerbuka(false)
        setBeritaDipilih(null)
        setForm(formAwal)
    }

    function ubahJudul(judul: string) {
        setForm((sebelumnya) => ({
            ...sebelumnya,
            judul,
            slug:
                modeEdit && sebelumnya.slug
                    ? sebelumnya.slug
                    : buatSlug(judul),
            judul_seo:
                sebelumnya.judul_seo
                    ? sebelumnya.judul_seo
                    : judul,
        }))
    }

    async function simpanBerita(event: FormEvent) {
        event.preventDefault()

        if (!form.judul || !form.slug || !form.isi) {
            alert('Judul, slug, dan isi berita wajib diisi.')
            return
        }

        try {
            setMenyimpan(true)

            const data = {
                judul: form.judul,
                slug: form.slug,
                ringkasan: form.ringkasan,
                isi: form.isi,
                gambar_utama: form.gambar_utama,
                kategori: form.kategori,
                tag: form.tag
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                status: form.status,
                judul_seo: form.judul_seo,
                deskripsi_seo: form.deskripsi_seo,
            }

            const url = modeEdit
                ? `/api/berita/${beritaDipilih?.id}`
                : '/api/berita'

            const response = await fetch(url, {
                method: modeEdit ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan)
            }

            alert(hasil.pesan)

            tutupModal()
            ambilBerita()
        } catch (error) {
            console.error(error)

            alert(
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan berita.'
            )
        } finally {
            setMenyimpan(false)
        }
    }

    async function hapusBerita(id: string) {
        const yakin = confirm(
            'Apakah Anda yakin ingin menghapus berita ini?'
        )

        if (!yakin) return

        try {
            const response = await fetch(`/api/berita/${id}`, {
                method: 'DELETE',
            })

            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan)
            }

            alert(hasil.pesan)

            ambilBerita()
        } catch (error) {
            console.error(error)

            alert(
                error instanceof Error
                    ? error.message
                    : 'Gagal menghapus berita.'
            )
        }
    }

    function formatTanggal(tanggal: string) {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(tanggal))
    }

    function badgeStatus(status: Berita['status']) {
        if (status === 'diterbitkan') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <Eye size={13} />
                    Diterbitkan
                </span>
            )
        }

        if (status === 'diarsipkan') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    <Archive size={13} />
                    Diarsipkan
                </span>
            )
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                <FileText size={13} />
                Draft
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Berita
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Kelola berita dan informasi website.
                        </p>
                    </div>

                    <button
                        onClick={bukaTambah}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Tambah Berita
                    </button>
                </div>


                {/* FILTER */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={pencarian}
                                onChange={(event) =>
                                    setPencarian(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        ambilBerita()
                                    }
                                }}
                                placeholder="Cari berita..."
                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(event) =>
                                setFilterStatus(event.target.value)
                            }
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Semua Status
                            </option>

                            <option value="draft">
                                Draft
                            </option>

                            <option value="diterbitkan">
                                Diterbitkan
                            </option>

                            <option value="diarsipkan">
                                Diarsipkan
                            </option>
                        </select>

                        <button
                            onClick={ambilBerita}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cari
                        </button>
                    </div>
                </div>


                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="flex h-60 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                        </div>
                    ) : berita.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                            <FileText
                                size={42}
                                className="mb-3 text-gray-300"
                            />

                            <h3 className="font-semibold text-gray-800">
                                Belum ada berita
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Tambahkan berita pertama Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold text-gray-700">
                                            Berita
                                        </th>

                                        <th className="px-5 py-4 font-semibold text-gray-700">
                                            Kategori
                                        </th>

                                        <th className="px-5 py-4 font-semibold text-gray-700">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 font-semibold text-gray-700">
                                            Tanggal
                                        </th>

                                        <th className="px-5 py-4 text-right font-semibold text-gray-700">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {berita.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="max-w-md px-5 py-4">
                                                <div className="flex gap-3">
                                                    {item.gambar_utama ? (
                                                        <img
                                                            src={item.gambar_utama}
                                                            alt={item.judul}
                                                            className="h-14 w-20 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                                            <FileText
                                                                size={20}
                                                                className="text-gray-400"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <h3 className="line-clamp-2 font-semibold text-gray-900">
                                                            {item.judul}
                                                        </h3>

                                                        <p className="mt-1 truncate text-xs text-gray-400">
                                                            /berita/{item.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {item.kategori || '-'}
                                            </td>

                                            <td className="px-5 py-4">
                                                {badgeStatus(item.status)}
                                            </td>

                                            <td className="px-5 py-4 text-gray-500">
                                                {formatTanggal(
                                                    item.dibuat_pada
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            bukaEdit(item)
                                                        }
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            hapusBerita(item.id)
                                                        }
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>


            {/* MODAL */}
            {modalTerbuka && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {modeEdit
                                        ? 'Edit Berita'
                                        : 'Tambah Berita'}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Kelola informasi dan SEO berita.
                                </p>
                            </div>

                            <button
                                onClick={tutupModal}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>


                        {/* FORM */}
                        <form
                            onSubmit={simpanBerita}
                            className="overflow-y-auto p-5"
                        >
                            <div className="grid gap-5 md:grid-cols-2">

                                {/* JUDUL */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Judul Berita *
                                    </label>

                                    <input
                                        type="text"
                                        value={form.judul}
                                        onChange={(event) =>
                                            ubahJudul(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Masukkan judul berita"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>


                                {/* SLUG */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Slug *
                                    </label>

                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                slug: event.target.value,
                                            })
                                        }
                                        placeholder="judul-berita"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        URL: /berita/{form.slug || 'slug-berita'}
                                    </p>
                                </div>


                                {/* KATEGORI */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Kategori
                                    </label>

                                    <input
                                        type="text"
                                        value={form.kategori}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                kategori:
                                                    event.target.value,
                                            })
                                        }
                                        placeholder="Contoh: SPMB"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>


                                {/* RINGKASAN */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Ringkasan
                                    </label>

                                    <textarea
                                        value={form.ringkasan}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                ringkasan:
                                                    event.target.value,
                                            })
                                        }
                                        rows={3}
                                        placeholder="Ringkasan singkat berita..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>


                                {/* ISI */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Isi Berita *
                                    </label>

                                    <textarea
                                        value={form.isi}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                isi: event.target.value,
                                            })
                                        }
                                        rows={12}
                                        placeholder="Tulis isi berita..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>


                                {/* GAMBAR */}
                               <div className="md:col-span-2">
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Gambar Utama
    </label>

    <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
            const file = event.target.files?.[0]

            if (!file) return

            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran gambar maksimal 5 MB.')
                event.target.value = ''
                return
            }

            const url = URL.createObjectURL(file)

            setFormFile(file)
            setPreviewGambar(url)
        }}
        className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium hover:file:bg-gray-200"
    />

    <p className="mt-1 text-xs text-gray-400">
        JPG, PNG atau WebP. Maksimal 5 MB.
    </p>

    {previewGambar && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            <img
                src={previewGambar}
                alt="Preview gambar utama"
                className="h-48 w-full object-cover"
            />
        </div>
    )}
</div>


                                {/* TAG */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Tag
                                    </label>

                                    <input
                                        type="text"
                                        value={form.tag}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                tag: event.target.value,
                                            })
                                        }
                                        placeholder="SPMB, Sekolah, Pendaftaran"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        Pisahkan dengan koma.
                                    </p>
                                </div>


                                {/* STATUS */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Status
                                    </label>

                                    <select
                                        value={form.status}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                status: event.target.value as FormBerita['status'],
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="diterbitkan">
                                            Diterbitkan
                                        </option>

                                        <option value="diarsipkan">
                                            Diarsipkan
                                        </option>
                                    </select>
                                </div>


                                {/* SEO */}
                                <div className="md:col-span-2">
                                    <div className="mb-4 border-t border-gray-200 pt-5">
                                        <h3 className="font-semibold text-gray-900">
                                            Optimasi SEO
                                        </h3>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Informasi ini digunakan oleh mesin pencari seperti Google.
                                        </p>
                                    </div>
                                </div>


                                {/* JUDUL SEO */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Judul SEO
                                    </label>

                                    <input
                                        type="text"
                                        maxLength={60}
                                        value={form.judul_seo}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                judul_seo:
                                                    event.target.value,
                                            })
                                        }
                                        placeholder="Judul SEO..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        {form.judul_seo.length}/60 karakter
                                    </p>
                                </div>


                                {/* DESKRIPSI SEO */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Deskripsi SEO
                                    </label>

                                    <textarea
                                        maxLength={160}
                                        rows={3}
                                        value={form.deskripsi_seo}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                deskripsi_seo:
                                                    event.target.value,
                                            })
                                        }
                                        placeholder="Deskripsi yang akan ditampilkan di mesin pencari..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-1 text-xs text-gray-400">
                                        {form.deskripsi_seo.length}/160 karakter
                                    </p>
                                </div>
                            </div>


                            {/* FOOTER */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                                <button
                                    type="button"
                                    onClick={tutupModal}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={menyimpan}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save size={17} />

                                    {menyimpan
                                        ? 'Menyimpan...'
                                        : modeEdit
                                          ? 'Simpan Perubahan'
                                          : 'Simpan Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}