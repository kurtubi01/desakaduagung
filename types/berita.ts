export interface Berita {
    id: string
    judul: string
    slug: string
    ringkasan: string | null
    isi: string
    gambar_utama: string | null
    kategori: string | null
    tag: string[]
    status: 'draft' | 'diterbitkan' | 'diarsipkan'
    tanggal_terbit: string | null
    dibuat_pada: string
}