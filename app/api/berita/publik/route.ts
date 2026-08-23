import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // Ambil parameter limit dari URL
        const { searchParams } = new URL(request.url)
        const limitParam = searchParams.get('limit')

        // Jika limit tidak diberikan, ambil semua.
        // Jika diberikan, batasi maksimal 10.
        const limit = limitParam
            ? Math.min(Math.max(Number(limitParam) || 3, 1), 10)
            : null

        let query = supabase
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
                dibuat_pada
            `)
            .eq('status', 'diterbitkan')
            .order('tanggal_terbit', {
                ascending: false,
            })

        // Hanya gunakan limit jika parameter diberikan
        if (limit !== null) {
            query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
            console.error(
                'SUPABASE BERITA ERROR:',
                error
            )

            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: error.message,
                    detail: error.details,
                    hint: error.hint,
                    code: error.code,
                },
                {
                    status: 500,
                }
            )
        }

        return NextResponse.json(
            {
                berhasil: true,
                data: Array.isArray(data)
                    ? data
                    : [],
            },
            {
                status: 200,
            }
        )
    } catch (error) {
        console.error(
            'API BERITA ERROR:',
            error
        )

        return NextResponse.json(
            {
                berhasil: false,
                pesan:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan pada server.',
            },
            {
                status: 500,
            }
        )
    }
}