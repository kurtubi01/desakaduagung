import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { searchParams } = new URL(request.url)

        const status = searchParams.get('status')
        const kategori = searchParams.get('kategori')
        const cari = searchParams.get('cari')

        let query = supabase
            .from('berita')
            .select('*')
            .order('dibuat_pada', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        if (kategori) {
            query = query.eq('kategori', kategori)
        }

        if (cari) {
            query = query.or(
                `judul.ilike.%${cari}%,ringkasan.ilike.%${cari}%`
            )
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: error.message,
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            berhasil: true,
            data,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                berhasil: false,
                pesan: 'Terjadi kesalahan pada server.',
            },
            { status: 500 }
        )
    }
}


export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Pastikan pengguna sudah login
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: 'Anda harus login terlebih dahulu.',
                },
                { status: 401 }
            )
        }

        const body = await request.json()

        const {
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
        } = body

        if (!judul || !slug || !isi) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: 'Judul, slug, dan isi berita wajib diisi.',
                },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('berita')
            .insert({
                pengguna_id: user.id,
                judul,
                slug,
                ringkasan: ringkasan || null,
                isi,
                gambar_utama: gambar_utama || null,
                kategori: kategori || null,
                tag: Array.isArray(tag) ? tag : [],
                status: status || 'draft',
                tanggal_terbit:
                    status === 'diterbitkan'
                        ? tanggal_terbit || new Date().toISOString()
                        : null,
                judul_seo: judul_seo || judul,
                deskripsi_seo:
                    deskripsi_seo || ringkasan || null,
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    {
                        berhasil: false,
                        pesan: 'Slug berita sudah digunakan.',
                    },
                    { status: 409 }
                )
            }

            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: error.message,
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                berhasil: true,
                pesan: 'Berita berhasil dibuat.',
                data,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            {
                berhasil: false,
                pesan: 'Terjadi kesalahan pada server.',
            },
            { status: 500 }
        )
    }
}