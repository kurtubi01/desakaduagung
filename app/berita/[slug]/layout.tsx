
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

interface BeritaLayoutProps {
    children: React.ReactNode
    params: Promise<{
        slug: string
    }>
}

interface BeritaSEO {
    judul: string
    slug: string
    ringkasan: string | null
    isi: string | null
    gambar_utama: string | null
    kategori: string | null
    tag: string[] | null
    status: string
    tanggal_terbit: string | null
    judul_seo: string | null
    deskripsi_seo: string | null
    dibuat_pada: string | null
    diperbarui_pada: string | null
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params

    const supabase = await createClient()

    const { data: berita, error } = await supabase
        .from('berita')
        .select(`
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
        .eq('slug', slug)
        .eq('status', 'diterbitkan')
        .single()

    if (error || !berita) {
        return {
            title: 'Berita Tidak Ditemukan',
            description:
                'Berita yang Anda cari tidak ditemukan atau sudah tidak tersedia.',
            robots: {
                index: false,
                follow: false,
            },
        }
    }

    const data = berita as BeritaSEO

    const title =
        data.judul_seo?.trim() ||
        `${data.judul} | Pemerintah Desa`

    const description =
        data.deskripsi_seo?.trim() ||
        data.ringkasan?.trim() ||
        `Baca berita terbaru mengenai ${data.judul} di website resmi Pemerintah Desa.`

    const image = data.gambar_utama || '/og-berita.jpg'

    const tags = Array.isArray(data.tag)
        ? data.tag
        : data.tag
            ? [data.tag]
            : []

    return {
        title,

        description,

        keywords: [
            'berita desa',
            'informasi desa',
            data.judul,
            data.kategori || '',
            ...tags,
        ].filter(Boolean),

        authors: [
            {
                name: 'Pemerintah Desa',
            },
        ],

        creator: 'Pemerintah Desa',
        publisher: 'Pemerintah Desa',

        alternates: {
            canonical: `/berita/${data.slug}`,
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
            type: 'article',

            title,

            description,

            url: `/berita/${data.slug}`,

            siteName: 'Pemerintah Desa',

            locale: 'id_ID',

            publishedTime:
                data.tanggal_terbit ||
                data.dibuat_pada ||
                undefined,

            modifiedTime:
                data.diperbarui_pada ||
                undefined,

            authors: ['Pemerintah Desa'],

            section: data.kategori || 'Berita Desa',

            tags,

            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: data.judul,
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',

            title,

            description,

            images: [image],
        },
    }
}

export default function BeritaDetailLayout({
    children,
}: BeritaLayoutProps) {
    return children
}