import Link from 'next/link'
import {
    ArrowRight,
    Newspaper,
} from 'lucide-react'
import type { Berita } from '@/types/berita'
import CardBerita from './CardBerita'


interface SectionBeritaProps {
    berita?: Berita[] | null
    title?: string
    description?: string
}

export default function SectionBerita({
    berita,
    title = 'Berita Terbaru',
    description = 'Informasi dan kabar terbaru dari desa.',
}: SectionBeritaProps) {

    // Pastikan selalu berupa array
    const daftarBerita = Array.isArray(berita)
        ? berita
        : []

    return (
        <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div className="max-w-2xl">

                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                            <Newspaper size={18} />

                            <span>
                                Berita Desa
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                            {title}
                        </h2>

                        <p className="mt-3 text-base leading-7 text-gray-600">
                            {description}
                        </p>
                    </div>

                    {/* LIHAT SEMUA */}
                    <Link
                        href="/berita"
                        className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                        Lihat Semua Berita

                        <ArrowRight
                            size={17}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* CARD */}
                {daftarBerita.length > 0 ? (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {daftarBerita
                            .slice(0, 6)
                            .map((item) => (
                                <CardBerita
                                    key={item.id}
                                    berita={item}
                                />
                            ))}
                    </div>

                ) : (

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <Newspaper
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800">
                            Belum ada berita
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Berita terbaru akan ditampilkan di sini.
                        </p>

                    </div>
                )}

                {/* BUTTON MOBILE */}
                {daftarBerita.length > 0 && (
                    <div className="mt-8 flex justify-center md:hidden">
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Lihat Semua Berita

                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}

            </div>
        </section>
    )
}