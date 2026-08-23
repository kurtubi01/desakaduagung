import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    CalendarDays,
} from 'lucide-react'
import type { Berita } from '@/types/berita'

interface DetailBeritaProps {
    berita: Berita
}

function formatTanggal(tanggal: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(tanggal))
}

export default function DetailBerita({
    berita,
}: DetailBeritaProps) {
    const tanggal =
        berita.tanggal_terbit ||
        berita.dibuat_pada

    return (
        <main className="min-h-screen bg-white">

            {/* HEADER */}

            <article>

                <header className="border-b border-gray-200 bg-gray-50">

                    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">

                        <Link
                            href="/berita"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                        >
                            <ArrowLeft size={17} />

                            Kembali ke berita
                        </Link>


                        {berita.kategori && (
                            <div className="mb-4">

                                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                    {berita.kategori}
                                </span>

                            </div>
                        )}


                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
                            {berita.judul}
                        </h1>


                        {tanggal && (
                            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

                                <CalendarDays size={16} />

                                <time dateTime={tanggal}>
                                    {formatTanggal(tanggal)}
                                </time>

                            </div>
                        )}

                    </div>

                </header>


                {/* GAMBAR */}

                {berita.gambar_utama && (

                    <div className="mx-auto max-w-5xl px-4 pt-8 md:px-6 md:pt-10">

                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">

                            <Image
                                src={
                                    berita.gambar_utama
                                }
                                alt={berita.judul}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 1024px"
                            />

                        </div>

                    </div>

                )}


                {/* ISI */}

                <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">

                    {berita.ringkasan && (

                        <p className="mb-8 text-lg font-medium leading-8 text-gray-700">
                            {berita.ringkasan}
                        </p>

                    )}


                    <div className="whitespace-pre-line text-base leading-8 text-gray-700 md:text-lg">
                        {berita.isi}
                    </div>


                    {/* TAG */}

                    {berita.tag &&
                        berita.tag.length > 0 && (

                            <div className="mt-12 border-t border-gray-200 pt-6">

                                <p className="mb-3 text-sm font-semibold text-gray-900">
                                    Tag
                                </p>

                                <div className="flex flex-wrap gap-2">

                                    {berita.tag.map(
                                        (tag: string) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600"
                                            >
                                                #{tag}
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                </div>

            </article>

        </main>
    )
}