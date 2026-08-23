import KartuBerita from './CardBerita'
import type { Berita } from '@/types/berita'

interface DaftarBeritaProps {
    berita: Berita[]
}

export default function DaftarBerita({
    berita,
}: DaftarBeritaProps) {
    if (berita.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Belum ada berita
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Belum ada berita yang diterbitkan.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {berita.map((item) => (
                <KartuBerita
                    key={item.id}
                    berita={item}
                />
            ))}
        </div>
    )
}