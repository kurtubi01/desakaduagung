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
    Image as ImageIcon,
    Upload,
    Loader2,
    Calendar,
    Tag,
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

function potongDeskripsi(text: string, max = 160) {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max)
}

export default function BeritaPage() {
    const [berita, setBerita] = useState<Berita[]>([])
    const [loading, setLoading] = useState(true)
    const [menyimpan, setMenyimpan] = useState(false)

    const [modalTerbuka, setModalTerbuka] = useState(false)
    const [modeEdit, setModeEdit] = useState(false)

    const [formFile, setFormFile] = useState<File | null>(null)
    const [previewGambar, setPreviewGambar] = useState<string | null>(null)

    const [beritaDipilih, setBeritaDipilih] = useState<Berita | null>(null)

    const [form, setForm] = useState<FormBerita>(formAwal)

    const [pencarian, setPencarian] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    const [seoJudulManual, setSeoJudulManual] = useState(false)
    const [seoDeskripsiManual, setSeoDeskripsiManual] = useState(false)

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

            const response = await fetch(`/api/berita?${params.toString()}`)
            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan || 'Gagal mengambil berita.')
            }

            setBerita(hasil.data || [])
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Gagal mengambil berita.')
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
        setFormFile(null)
        setPreviewGambar(null)
        setSeoJudulManual(false)
        setSeoDeskripsiManual(false)
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
            kategori: item.kategori || '',
            tag: item.tag?.join(', ') || '',
            status: item.status,
            judul_seo: item.judul_seo || item.judul,
            deskripsi_seo:
                item.deskripsi_seo ||
                potongDeskripsi(item.ringkasan || item.isi || ''),
        })

        setFormFile(null)
        setPreviewGambar(item.gambar_utama || null)
        setSeoJudulManual(Boolean(item.judul_seo && item.judul_seo !== item.judul))
        setSeoDeskripsiManual(Boolean(item.deskripsi_seo))
        setModalTerbuka(true)
    }

    function tutupModal() {
        if (previewGambar?.startsWith('blob:')) {
            URL.revokeObjectURL(previewGambar)
        }

        setModalTerbuka(false)
        setBeritaDipilih(null)
        setForm(formAwal)
        setFormFile(null)
        setPreviewGambar(null)
        setSeoJudulManual(false)
        setSeoDeskripsiManual(false)
    }

    function ubahJudul(judul: string) {
        const slugBaru = buatSlug(judul)

        setForm((sebelumnya) => ({
            ...sebelumnya,
            judul,
            slug: modeEdit && sebelumnya.slug ? sebelumnya.slug : slugBaru,
            judul_seo: seoJudulManual ? sebelumnya.judul_seo : judul,
        }))
    }

    function ubahRingkasan(ringkasan: string) {
        setForm((sebelumnya) => ({
            ...sebelumnya,
            ringkasan,
            deskripsi_seo: seoDeskripsiManual
                ? sebelumnya.deskripsi_seo
                : potongDeskripsi(ringkasan || sebelumnya.isi),
        }))
    }

    function ubahIsi(isi: string) {
        setForm((sebelumnya) => ({
            ...sebelumnya,
            isi,
            deskripsi_seo: seoDeskripsiManual
                ? sebelumnya.deskripsi_seo
                : potongDeskripsi(sebelumnya.ringkasan || isi),
        }))
    }

    function pilihGambar(file: File | undefined) {
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 5 MB.')
            return
        }

        if (previewGambar?.startsWith('blob:')) {
            URL.revokeObjectURL(previewGambar)
        }

        const url = URL.createObjectURL(file)
        setFormFile(file)
        setPreviewGambar(url)
    }

    function hapusGambar() {
        if (previewGambar?.startsWith('blob:')) {
            URL.revokeObjectURL(previewGambar)
        }

        setFormFile(null)
        setPreviewGambar(null)
    }

    async function simpanBerita(event: FormEvent) {
        event.preventDefault()

        if (!form.judul.trim()) {
            alert('Judul berita wajib diisi.')
            return
        }

        if (!form.slug.trim()) {
            alert('Slug berita wajib diisi.')
            return
        }

        if (!form.isi.trim()) {
            alert('Isi berita wajib diisi.')
            return
        }

        try {
            setMenyimpan(true)

            const data = new FormData()
            data.append('judul', form.judul)
            data.append('slug', form.slug)
            data.append('ringkasan', form.ringkasan)
            data.append('isi', form.isi)
            data.append('kategori', form.kategori)
            data.append(
                'tag',
                JSON.stringify(
                    form.tag
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)
                )
            )
            data.append('status', form.status)
            data.append('judul_seo', form.judul_seo)
            data.append('deskripsi_seo', form.deskripsi_seo)

            if (formFile) {
                data.append('gambar_utama', formFile)
            }

            const url = modeEdit ? `/api/berita/${beritaDipilih?.id}` : '/api/berita'

            const response = await fetch(url, {
                method: modeEdit ? 'PUT' : 'POST',
                body: data,
            })

            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan || 'Gagal menyimpan berita.')
            }

            alert(hasil.pesan || 'Berita berhasil disimpan.')
            tutupModal()
            await ambilBerita()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Gagal menyimpan berita.')
        } finally {
            setMenyimpan(false)
        }
    }

    async function hapusBerita(id: string) {
        const yakin = confirm('Apakah Anda yakin ingin menghapus berita ini?')
        if (!yakin) return

        try {
            const response = await fetch(`/api/berita/${id}`, {
                method: 'DELETE',
            })

            const hasil = await response.json()

            if (!response.ok) {
                throw new Error(hasil.pesan || 'Gagal menghapus berita.')
            }

            alert(hasil.pesan)
            await ambilBerita()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Gagal menghapus berita.')
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
                <span className="inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <Eye size={12} />
                    Diterbitkan
                </span>
            )
        }

        if (status === 'diarsipkan') {
            return (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                    <Archive size={12} />
                    Diarsipkan
                </span>
            )
        }

        return (
            <span className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                <FileText size={12} />
                Draft
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase sm:text-2xl">
                            BERITA & ARTIKEL DESA KADUAGUNG
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Kelola berita dan artikel desa kaduagun dan publikasikan ke halaman utama website desa
                        </p>
                    </div>

                    <button
                        onClick={bukaTambah}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 active:bg-slate-950"
                    >
                        <Plus size={16} />
                        Tambah Berita
                    </button>
                </div>

                {/* FILTER & PENCARIAN */}
                <div className="mb-8 border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row">
                        {/* Kolom Pencarian */}
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={pencarian}
                                onChange={(event) => setPencarian(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        ambilBerita()
                                    }
                                }}
                                placeholder="Cari berita berdasarkan judul..."
                                className="w-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>

                        {/* Filter berdasarkan status */}
                        <select
                            value={filterStatus}
                            onChange={(event) => setFilterStatus(event.target.value)}
                            className="border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="diterbitkan">Diterbitkan</option>
                            <option value="diarsipkan">Diarsipkan</option>
                        </select>

                        <button
                            onClick={ambilBerita}
                            className="border border-slate-900 bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                {/* CONTAINER CARD BERITA / SKELETON */}
                {loading ? (
                    /* SKELETON LOADING */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse border border-slate-200 bg-white p-4"
                            >
                                <div className="h-48 w-full bg-slate-200" />
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="h-4 w-20 bg-slate-200" />
                                    <div className="h-4 w-16 bg-slate-200" />
                                </div>
                                <div className="mt-3 h-5 w-3/4 bg-slate-200" />
                                <div className="mt-2 h-4 w-full bg-slate-200" />
                                <div className="mt-1 h-4 w-2/3 bg-slate-200" />
                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div className="h-4 w-24 bg-slate-200" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 bg-slate-200" />
                                        <div className="h-8 w-8 bg-slate-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : berita.length === 0 ? (
                    /* KONDISI KOSONG */
                    <div className="border border-slate-200 bg-white px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-slate-100 text-slate-400">
                            <FileText size={28} />
                        </div>
                        <h3 className="font-bold uppercase tracking-wide text-slate-800">
                            Belum Ada Berita
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Tidak ditemukan berita yang sesuai atau belum ada berita baru.
                        </p>
                        <button
                            onClick={bukaTambah}
                            className="mt-6 inline-flex items-center gap-2 bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800"
                        >
                            <Plus size={16} />
                            Tambah Berita Baru
                        </button>
                    </div>
                ) : (
                    /* CARD BERITA GRID */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {berita.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between border border-slate-200 bg-white transition hover:border-slate-400 hover:shadow-md"
                            >
                                <div>
                                    {/* Gambar Card */}
                                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                        {item.gambar_utama ? (
                                            <img
                                                src={item.gambar_utama}
                                                alt={item.judul}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                                                <ImageIcon size={32} />
                                                <span className="mt-1 text-xs font-medium">Tanpa Gambar</span>
                                            </div>
                                        )}

                                        <div className="absolute left-3 top-3">
                                            {badgeStatus(item.status)}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="p-5">
                                        <div className="mb-2 flex items-center gap-3 text-xs text-slate-400">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatTanggal(item.dibuat_pada)}
                                            </span>
                                            {item.kategori && (
                                                <span className="inline-flex items-center gap-1 border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                    <Tag size={10} />
                                                    {item.kategori}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-600">
                                            {item.judul}
                                        </h3>

                                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
                                            {item.ringkasan || potongDeskripsi(item.isi, 120)}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/50">
                                    <span className="truncate text-[11px] font-mono text-slate-400">
                                        /{item.slug}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => bukaEdit(item)}
                                            className="border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-900 hover:text-white"
                                            title="Edit Berita"
                                        >
                                            <Pencil size={15} />
                                        </button>

                                        <button
                                            onClick={() => hapusBerita(item.id)}
                                            className="border border-slate-200 bg-white p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                            title="Hapus Berita"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL EDIT / TAMBAH */}
            {modalTerbuka && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
                    <div className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden border border-slate-300 bg-white shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
                                    {modeEdit ? 'Edit Berita' : 'Tambah Berita Baru'}
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Lengkapi berita dan publikasikan ke website desa.
                                </p>
                            </div>

                            <button
                                onClick={tutupModal}
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form onSubmit={simpanBerita} className="overflow-y-auto">
                            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">

                                <div className="md:col-span-2">
                                    <div className="border-b border-slate-200 pb-2">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                            Informasi Utama
                                        </h3>
                                    </div>
                                </div>

                                {/* JUDUL */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Judul Berita *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.judul}
                                        onChange={(event) => ubahJudul(event.target.value)}
                                        placeholder="Contoh: Musyawarah Pembangunan Desa Kaduagung Tahun 2026"
                                        className="w-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* SLUG */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.slug}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                slug: buatSlug(event.target.value),
                                            })
                                        }
                                        placeholder="musyawarah-pembangunan-desa"
                                        className="w-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        URL: /berita/{form.slug || 'slug-berita'}
                                    </p>
                                </div>

                                {/* KATEGORI */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Kategori
                                    </label>
                                    <input
                                        type="text"
                                        value={form.kategori}
                                        onChange={(event) =>
                                            setForm({ ...form, kategori: event.target.value })
                                        }
                                        placeholder="Pengumuman, Pembangunan, Kegiatan"
                                        className="w-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* RINGKASAN */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Ringkasan
                                    </label>
                                    <textarea
                                        value={form.ringkasan}
                                        onChange={(event) => ubahRingkasan(event.target.value)}
                                        rows={3}
                                        placeholder="Ringkasan singkat berita untuk preview..."
                                        className="w-full resize-none border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* ISI */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Isi Berita *
                                    </label>
                                    <textarea
                                        value={form.isi}
                                        onChange={(event) => ubahIsi(event.target.value)}
                                        rows={12}
                                        placeholder="Tuliskan berita lengkap..."
                                        className="w-full resize-y border border-slate-200 px-4 py-2.5 text-sm leading-relaxed text-slate-800 outline-none focus:border-slate-900"
                                    />
                                </div>

                                {/* GAMBAR UTAMA */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Gambar Utama
                                    </label>

                                    <div className="border border-dashed border-slate-300 bg-slate-50 p-4">
                                        {previewGambar ? (
                                            <div className="relative border border-slate-200 bg-black">
                                                <img
                                                    src={previewGambar}
                                                    alt="Preview"
                                                    className="h-56 w-full object-cover sm:h-64"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/80 p-3">
                                                    <span className="truncate text-xs text-white">
                                                        {formFile ? formFile.name : 'Gambar Berita'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={hapusGambar}
                                                        className="inline-flex items-center gap-1 bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                                                    >
                                                        <Trash2 size={13} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex cursor-pointer flex-col items-center justify-center p-8 text-center transition hover:bg-slate-100">
                                                <Upload size={24} className="text-slate-400" />
                                                <span className="mt-2 text-xs font-bold uppercase text-slate-700">
                                                    Upload Gambar Utama
                                                </span>
                                                <span className="mt-1 text-[11px] text-slate-400">
                                                    Format: JPG, PNG, WebP (Maks. 5MB)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                    onChange={(event) => pilihGambar(event.target.files?.[0])}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* TAG */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={form.tag}
                                        onChange={(event) => setForm({ ...form, tag: event.target.value })}
                                        placeholder="Kaduagung, Berita, Desa"
                                        className="w-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-900"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Pisahkan tag dengan tanda koma.
                                    </p>
                                </div>

                                {/* STATUS */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-700">
                                        Status Publikasi
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                status: event.target.value as FormBerita['status'],
                                            })
                                        }
                                        className="w-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-slate-900"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="diterbitkan">Diterbitkan</option>
                                        <option value="diarsipkan">Diarsipkan</option>
                                    </select>
                                </div>

                                {/* SEO SECTION */}
                                <div className="md:col-span-2">
                                    <div className="border border-slate-200 bg-slate-50 p-5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                            Pengaturan SEO
                                        </h3>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                                    Judul SEO
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={60}
                                                    value={form.judul_seo}
                                                    onChange={(event) => {
                                                        setSeoJudulManual(true)
                                                        setForm({ ...form, judul_seo: event.target.value })
                                                    }}
                                                    className="w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                                    Deskripsi SEO
                                                </label>
                                                <textarea
                                                    maxLength={160}
                                                    rows={3}
                                                    value={form.deskripsi_seo}
                                                    onChange={(event) => {
                                                        setSeoDeskripsiManual(true)
                                                        setForm({ ...form, deskripsi_seo: event.target.value })
                                                    }}
                                                    className="w-full resize-none border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                                <button
                                    type="button"
                                    onClick={tutupModal}
                                    disabled={menyimpan}
                                    className="border border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={menyimpan}
                                    className="inline-flex items-center gap-2 bg-slate-900 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {menyimpan ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={15} />
                                            {modeEdit ? 'Simpan Perubahan' : 'Simpan Berita'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}