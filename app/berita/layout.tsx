
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: 'Berita & Informasi Desa KaduAgung',
        template: '%s | Pemerintah Desa',
    },

    description:
        'Berita dan informasi terbaru seputar kegiatan masyarakat, pembangunan, pelayanan publik, pengumuman, dan perkembangan Desa.',

    keywords: [
        'berita desa',
        'informasi desa',
        'berita terbaru desa',
        'kegiatan desa',
        'pembangunan desa',
        'pengumuman desa',
        'pemerintah desa',
    ],

    alternates: {
        canonical: '/berita',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },

    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: '/berita',
        siteName: 'Pemerintah Desa',
        title: 'Berita & Informasi Desa',
        description:
            'Berita, informasi, kegiatan, pembangunan, pelayanan publik, dan perkembangan terbaru desa.',
        images: [
            {
                url: '/og-berita.jpg',
                width: 1200,
                height: 630,
                alt: 'Berita dan Informasi Desa',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Berita & Informasi Desa Kadu Agung',
        description:
            'Berita dan informasi terbaru seputar kegiatan dan perkembangan desa.',
        images: ['/og-berita.jpg'],
    },
}

export default function BeritaLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}