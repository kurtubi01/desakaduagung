import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Link from 'next/link'
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarDays,
    ChevronRight,
    FileText,
    Globe2,
    Mail,
    MapPin,
    Newspaper,
    Phone,
    Sparkles,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import DaftarBerita, {
    DataBerita,
} from '@/components/berita/DaftarBerita'

export const metadata: Metadata = {
    title: 'Berita & Informasi Desa',
    description:
        'Berita, informasi, kegiatan, pengumuman, pembangunan, dan perkembangan terbaru desa.',
}

export const revalidate = 60

export default async function BeritaPage() {
    const supabase = await createClient()

    const {
        data,
        error,
    } = await supabase
        .from('berita')
        .select(`
            id,
            judul,
            slug,
            ringkasan,
            isi,
            gambar_utama,
            kategori,
            tag,
            status,
            tanggal_terbit,
            judul_seo,
            deskripsi_seo,
            dibuat_pada,
            diperbarui_pada
        `)
        .eq('status', 'diterbitkan')
        .order('tanggal_terbit', {
            ascending: false,
            nullsFirst: false,
        })

    if (error) {
        console.error('Gagal mengambil berita:', error)
    }

    const berita = (data as DataBerita[]) || []

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =====================================================
                HERO
            ====================================================== */}
            <section className="relative overflow-hidden bg-emerald-950">

                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 h-96 w-96 bg-emerald-500/20 blur-3xl" />

                    <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] bg-green-400/10 blur-3xl" />

                    <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 bg-teal-400/10 blur-3xl" />
                </div>

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16 md:px-6 md:py-24">

                    {/* Back */}
                    <Link
                        href="/"
                        className="group mb-10 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:border-emerald-300/30 hover:bg-white/10"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-1"
                        />

                        Kembali ke Beranda
                    </Link>

                    <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">

                        {/* Hero Content */}
                        <div className="max-w-3xl">

                            <div className="mb-5 inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                                

                                Informasi Desa
                            </div>

                            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                                Berita &{' '}
                                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                                    Informasi Desa
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-50/70 md:text-lg">
                                Ikuti kabar terbaru seputar kegiatan masyarakat,
                                pembangunan, pelayanan publik, pengumuman,
                                dan berbagai perkembangan desa.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">

                                <Link
                                    href="#berita"
                                    className="group inline-flex items-center gap-2 bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400"
                                >
                                    Lihat Berita

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                                >
                                    Profil Desa
                                </Link>

                            </div>

                        </div>

                        {/* Statistic Desktop */}
                        <div className="hidden lg:block">

                            <div className="relative overflow-hidden border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl">

                                <div className="absolute -right-8 -top-8 h-24 w-24 bg-emerald-400/10 blur-xl" />

                                <div className="relative">

                                    <div className="flex h-14 w-14 items-center justify-center bg-emerald-400/10 text-emerald-300">
                                        <Newspaper size={28} />
                                    </div>

                                    <p className="mt-6 text-4xl font-black text-white">
                                        {berita.length}
                                    </p>

                                    <p className="mt-1 text-sm text-emerald-100/50">
                                        Berita telah diterbitkan
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* =====================================================
                MOBILE STATISTIC
            ====================================================== */}
            <section className="relative z-10 -mt-8 px-4 lg:hidden">

                <div className="mx-auto flex max-w-7xl items-center gap-4 border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
                        <Newspaper size={24} />
                    </div>

                    <div>
                        <p className="text-2xl font-black text-slate-900">
                            {berita.length}
                        </p>

                        <p className="text-sm text-slate-500">
                            Berita Desa
                        </p>
                    </div>

                    <div className="ml-auto">
                        <ChevronRight
                            size={20}
                            className="text-slate-300"
                        />
                    </div>

                </div>

            </section>


            {/* =====================================================
                BERITA
            ====================================================== */}
            <section
                id="berita"
                className="py-16 md:py-24"
            >

                <div className="mx-auto max-w-7xl px-4 md:px-6">

                    {/* Header */}
                    <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-emerald-600">
                                <span className="h-2 w-2 bg-emerald-500" />

                                Kabar Desa
                            </div>

                            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                                Berita Terkini
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                                Informasi terbaru mengenai kegiatan,
                                pembangunan, pelayanan, dan berbagai
                                aktivitas masyarakat desa.
                            </p>

                        </div>

                        <div className="hidden items-center gap-2 border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:flex">
                            <FileText size={16} />

                            {berita.length} Publikasi
                        </div>

                    </div>


                    {/* Content */}
                    {berita.length === 0 ? (

                        <div className="border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center bg-emerald-50 text-emerald-500">
                                <Newspaper size={34} />
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-slate-900">
                                Belum ada berita
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                                Belum ada berita desa yang diterbitkan.
                                Silakan kembali lagi nanti untuk mendapatkan
                                informasi terbaru.
                            </p>

                            <Link
                                href="/"
                                className="mt-7 inline-flex rounded-2xl items-center gap-2 bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                            >
                                <ArrowLeft size={16} />

                                Kembali ke Beranda
                            </Link>

                        </div>

                    ) : (

                        <DaftarBerita berita={berita} />

                    )}

                </div>

            </section>


            {/* =====================================================
                CTA
            ====================================================== */}
            <section className="border-t border-slate-200 bg-white py-14 md:py-20">

                <div className="mx-auto max-w-7xl px-4 md:px-6">

                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 px-6 py-10 shadow-2xl shadow-emerald-900/10 md:px-10 md:py-14">

                        {/* Decoration */}
                        <div className="absolute -right-20 -top-20 h-72 w-72 bg-white/10 blur-3xl" />

                        <div className="absolute -bottom-24 left-1/3 h-72 w-72 bg-teal-400/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                            <div className="max-w-2xl">

                                <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
                                    <Globe2 size={16} />

                                    Tetap Terhubung
                                </div>

                                <h2 className="mt-3 text-2xl font-black text-white md:text-4xl">
                                    Selalu ikuti perkembangan desa.
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-emerald-50/80 md:text-base">
                                    Dapatkan informasi mengenai kegiatan,
                                    pembangunan, pelayanan masyarakat,
                                    pengumuman, dan berbagai kabar terbaru
                                    dari desa.
                                </p>

                            </div>

                            <Link
                                href="/"
                                className="group inline-flex w-fit shrink-0 items-center gap-2 bg-white px-5 py-3.5 text-sm font-bold text-emerald-700 shadow-xl transition hover:bg-emerald-50"
                            >
                                Kembali ke Beranda

                                <ArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


         
           {/* FOOTER */}
           <Footer />

        </main>
    )
}