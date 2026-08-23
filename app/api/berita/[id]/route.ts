import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
    params: Promise<{
        id: string
    }>
}


export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('berita')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: 'Berita tidak ditemukan.',
                },
                { status: 404 }
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


export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params

        const supabase = await createClient()

        // Pastikan login
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
            .update({
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
            .eq('id', id)
            .eq('pengguna_id', user.id)
            .select()
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    {
                        berhasil: false,
                        pesan:
                            'Berita tidak ditemukan atau bukan milik Anda.',
                    },
                    { status: 404 }
                )
            }

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

        return NextResponse.json({
            berhasil: true,
            pesan: 'Berita berhasil diperbarui.',
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


export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params

        const supabase = await createClient()

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

        const { error } = await supabase
            .from('berita')
            .delete()
            .eq('id', id)
            .eq('pengguna_id', user.id)

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
            pesan: 'Berita berhasil dihapus.',
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