import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Berita } from '@/types/berita'

import CardBerita from './CardBerita'

interface BeritaTerkiniProps {
    berita: Berita[]
}

export default function BeritaTerkini({
    berita,
}: BeritaTerkiniProps) {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-6">

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Informasi terbaru
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Berita Terkini
                        </h2>

                        <p className="mt-2 max-w-2xl text-gray-600">
                            Informasi dan berita terbaru dari sekolah.
                        </p>
                    </div>

                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Lihat semua berita
                        <ArrowRight size={17} />
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {berita.slice(0, 3).map((item) => (
                        <CardBerita
                            key={item.id}
                            berita={item}
                        />
                    ))}
                </div>

            </div>
        </section>
    )
}