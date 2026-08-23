import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Berita } from '@/types/berita'

interface KartuBeritaProps {
    berita: Berita
}

function formatTanggal(tanggal: string | null | undefined) {
    if (!tanggal) {
        return 'Tanggal tidak tersedia'
    }

    const date = new Date(tanggal)

    if (Number.isNaN(date.getTime())) {
        return 'Tanggal tidak valid'
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)
}

export default function CardBerita({
    berita,
}: KartuBeritaProps) {
    const tanggal = berita.tanggal_terbit || berita.dibuat_pada

    return (
        <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <Link
                href={`/berita/${berita.slug}`}
                aria-label={`Baca berita: ${berita.judul}`}
            >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">

                    {berita.gambar_utama ? (
                        <Image
                            src={berita.gambar_utama}
                            alt={berita.judul}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Tidak ada gambar
                        </div>
                    )}

                    {berita.kategori && (
                        <div className="absolute left-4 top-4">
                            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
                                {berita.kategori}
                            </span>
                        </div>
                    )}

                </div>
            </Link>

            <div className="p-5">

                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />

                    <time dateTime={tanggal || undefined}>
                        {formatTanggal(tanggal)}
                    </time>
                </div>

                <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition group-hover:text-blue-600">
                    <Link href={`/berita/${berita.slug}`}>
                        {berita.judul}
                    </Link>
                </h2>

                {berita.ringkasan && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {berita.ringkasan}
                    </p>
                )}

                <Link
                    href={`/berita/${berita.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3"
                >
                    Baca selengkapnya

                    <ArrowRight
                        size={16}
                        aria-hidden="true"
                    />
                </Link>

            </div>
        </article>
    )
}