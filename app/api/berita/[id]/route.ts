import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
]

const STORAGE_BUCKET = 'berita'

function getExtension(file: File) {
    const extensionMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    }

    return extensionMap[file.type] || 'jpg'
}

function bersihkanTeks(
    value: FormDataEntryValue | null
) {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

function parseTag(
    value: FormDataEntryValue | null
): string[] {
    if (
        typeof value !== 'string' ||
        !value
    ) {
        return []
    }

    try {
        const parsed = JSON.parse(value)

        if (Array.isArray(parsed)) {
            return parsed
                .filter(
                    (item) =>
                        typeof item === 'string' &&
                        item.trim()
                )
                .map((item) =>
                    item.trim()
                )
        }
    } catch {
        // fallback ke format koma
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

function potongDeskripsi(
    text: string,
    maxLength = 160
) {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength)
}

function buatNamaFile(
    file: File,
    userId: string
) {
    const extension =
        getExtension(file)

    return `${userId}/${crypto.randomUUID()}.${extension}`
}

async function uploadGambar(
    supabase: Awaited<
        ReturnType<typeof createClient>
    >,
    file: File,
    userId: string
) {
    if (
        !ALLOWED_TYPES.includes(
            file.type
        )
    ) {
        throw new Error(
            'Format gambar harus JPG, PNG, atau WebP.'
        )
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            'Ukuran gambar maksimal 5 MB.'
        )
    }

    const filePath =
        buatNamaFile(
            file,
            userId
        )

    const { error: uploadError } =
        await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(
                filePath,
                file,
                {
                    contentType:
                        file.type,
                    cacheControl:
                        '3600',
                    upsert: false,
                }
            )

    if (uploadError) {
        console.error(
            'Storage upload error:',
            uploadError
        )

        throw new Error(
            `Gagal upload gambar: ${uploadError.message}`
        )
    }

    const { data } =
        supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(
                filePath
            )

    return {
        url: data.publicUrl,
        path: filePath,
    }
}

async function hapusGambar(
    supabase: Awaited<
        ReturnType<typeof createClient>
    >,
    path: string | null
) {
    if (!path) {
        return
    }

    const { error } =
        await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([path])

    if (error) {
        console.error(
            'Gagal menghapus gambar:',
            error
        )
    }
}

function ambilPathStorage(
    url: string | null
) {
    if (!url) {
        return null
    }

    const marker =
        `/storage/v1/object/public/${STORAGE_BUCKET}/`

    const index =
        url.indexOf(marker)

    if (index === -1) {
        return null
    }

    return decodeURIComponent(
        url.substring(
            index + marker.length
        )
    )
}


/*
|--------------------------------------------------------------------------
| GET /api/berita/[id]
|--------------------------------------------------------------------------
*/

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } =
            await context.params

        const supabase =
            await createClient()

        const { data, error } =
            await supabase
                .from('berita')
                .select('*')
                .eq('id', id)
                .single()

        if (error || !data) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Berita tidak ditemukan.',
                },
                {
                    status: 404,
                }
            )
        }

        return NextResponse.json({
            berhasil: true,
            data,
        })
    } catch (error) {
        console.error(
            'GET berita detail:',
            error
        )

        return NextResponse.json(
            {
                berhasil: false,
                pesan:
                    'Terjadi kesalahan pada server.',
            },
            {
                status: 500,
            }
        )
    }
}


/*
|--------------------------------------------------------------------------
| PUT /api/berita/[id]
|--------------------------------------------------------------------------
*/

export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    let uploadedNewImagePath:
        | string
        | null = null

    try {
        const { id } =
            await context.params

        const supabase =
            await createClient()

        /*
        |--------------------------------------------------------------------------
        | CEK LOGIN
        |--------------------------------------------------------------------------
        */

        const {
            data: { user },
            error: userError,
        } =
            await supabase.auth.getUser()

        if (
            userError ||
            !user
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Anda harus login terlebih dahulu.',
                },
                {
                    status: 401,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | AMBIL BERITA LAMA
        |--------------------------------------------------------------------------
        */

        const {
            data: beritaLama,
            error: beritaError,
        } =
            await supabase
                .from('berita')
                .select('*')
                .eq('id', id)
                .eq(
                    'pengguna_id',
                    user.id
                )
                .single()

        if (
            beritaError ||
            !beritaLama
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Berita tidak ditemukan atau bukan milik Anda.',
                },
                {
                    status: 404,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | FORMDATA
        |--------------------------------------------------------------------------
        */

        const formData =
            await request.formData()

        const judul =
            bersihkanTeks(
                formData.get('judul')
            )

        const slug =
            bersihkanTeks(
                formData.get('slug')
            )

        const ringkasan =
            bersihkanTeks(
                formData.get(
                    'ringkasan'
                )
            )

        const isi =
            bersihkanTeks(
                formData.get('isi')
            )

        const kategori =
            bersihkanTeks(
                formData.get(
                    'kategori'
                )
            )

        const status =
            bersihkanTeks(
                formData.get('status')
            ) || 'draft'

        const judulSeo =
            bersihkanTeks(
                formData.get(
                    'judul_seo'
                )
            )

        const deskripsiSeo =
            bersihkanTeks(
                formData.get(
                    'deskripsi_seo'
                )
            )

        const tag =
            parseTag(
                formData.get('tag')
            )

        const fileEntry =
            formData.get(
                'gambar_utama'
            )

        const file =
            fileEntry instanceof File &&
            fileEntry.size > 0
                ? fileEntry
                : null

        /*
        |--------------------------------------------------------------------------
        | VALIDASI
        |--------------------------------------------------------------------------
        */

        if (
            !judul ||
            !slug ||
            !isi
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Judul, slug, dan isi berita wajib diisi.',
                },
                {
                    status: 400,
                }
            )
        }

        if (
            ![
                'draft',
                'diterbitkan',
                'diarsipkan',
            ].includes(status)
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Status berita tidak valid.',
                },
                {
                    status: 400,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | GAMBAR
        |--------------------------------------------------------------------------
        */

        let gambarUtama =
            beritaLama.gambar_utama ||
            null

        let newImagePath:
            | string
            | null = null

        if (file) {
            const uploaded =
                await uploadGambar(
                    supabase,
                    file,
                    user.id
                )

            gambarUtama =
                uploaded.url

            newImagePath =
                uploaded.path

            uploadedNewImagePath =
                uploaded.path
        }

        /*
        |--------------------------------------------------------------------------
        | SEO
        |--------------------------------------------------------------------------
        */

        const finalJudulSeo =
            judulSeo ||
            judul

        const finalDeskripsiSeo =
            deskripsiSeo ||
            potongDeskripsi(
                ringkasan || isi
            )

        /*
        |--------------------------------------------------------------------------
        | UPDATE DATABASE
        |--------------------------------------------------------------------------
        */

        const {
            data,
            error,
        } = await supabase
            .from('berita')
            .update({
                judul,

                slug,

                ringkasan:
                    ringkasan || null,

                isi,

                gambar_utama:
                    gambarUtama,

                kategori:
                    kategori || null,

                tag,

                status,

                tanggal_terbit:
                    status ===
                    'diterbitkan'
                        ? beritaLama.tanggal_terbit ||
                          new Date().toISOString()
                        : null,

                judul_seo:
                    finalJudulSeo,

                deskripsi_seo:
                    finalDeskripsiSeo ||
                    null,
            })
            .eq('id', id)
            .eq(
                'pengguna_id',
                user.id
            )
            .select()
            .single()

        /*
        |--------------------------------------------------------------------------
        | JIKA UPDATE GAGAL
        |--------------------------------------------------------------------------
        */

        if (error) {
            if (
                uploadedNewImagePath
            ) {
                await hapusGambar(
                    supabase,
                    uploadedNewImagePath
                )
            }

            console.error(
                'PUT berita error:',
                error
            )

            if (
                error.code ===
                '23505'
            ) {
                return NextResponse.json(
                    {
                        berhasil: false,
                        pesan:
                            'Slug berita sudah digunakan.',
                    },
                    {
                        status: 409,
                    }
                )
            }

            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: error.message,
                },
                {
                    status: 500,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | HAPUS GAMBAR LAMA
        |--------------------------------------------------------------------------
        */

        if (
            file &&
            beritaLama.gambar_utama
        ) {
            const oldImagePath =
                ambilPathStorage(
                    beritaLama.gambar_utama
                )

            if (
                oldImagePath &&
                oldImagePath !==
                    newImagePath
            ) {
                await hapusGambar(
                    supabase,
                    oldImagePath
                )
            }
        }

        return NextResponse.json({
            berhasil: true,
            pesan:
                'Berita berhasil diperbarui.',
            data,
        })
    } catch (error) {
        console.error(
            'PUT /api/berita/[id] error:',
            error
        )

        /*
        |--------------------------------------------------------------------------
        | CLEANUP JIKA UPLOAD BERHASIL
        | TAPI PROSES SELANJUTNYA ERROR
        |--------------------------------------------------------------------------
        */

        if (
            uploadedNewImagePath
        ) {
            try {
                const supabase =
                    await createClient()

                await hapusGambar(
                    supabase,
                    uploadedNewImagePath
                )
            } catch (cleanupError) {
                console.error(
                    'Cleanup image error:',
                    cleanupError
                )
            }
        }

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


/*
|--------------------------------------------------------------------------
| DELETE /api/berita/[id]
|--------------------------------------------------------------------------
*/

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { id } =
            await context.params

        const supabase =
            await createClient()

        /*
        |--------------------------------------------------------------------------
        | CEK LOGIN
        |--------------------------------------------------------------------------
        */

        const {
            data: { user },
            error: userError,
        } =
            await supabase.auth.getUser()

        if (
            userError ||
            !user
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Anda harus login terlebih dahulu.',
                },
                {
                    status: 401,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | AMBIL DATA BERITA
        |--------------------------------------------------------------------------
        */

        const {
            data: berita,
            error: beritaError,
        } =
            await supabase
                .from('berita')
                .select(
                    'id, gambar_utama'
                )
                .eq('id', id)
                .eq(
                    'pengguna_id',
                    user.id
                )
                .single()

        if (
            beritaError ||
            !berita
        ) {
            return NextResponse.json(
                {
                    berhasil: false,
                    pesan:
                        'Berita tidak ditemukan atau bukan milik Anda.',
                },
                {
                    status: 404,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | HAPUS DATABASE
        |--------------------------------------------------------------------------
        */

        const { error } =
            await supabase
                .from('berita')
                .delete()
                .eq('id', id)
                .eq(
                    'pengguna_id',
                    user.id
                )

        if (error) {
            console.error(
                'DELETE berita error:',
                error
            )

            return NextResponse.json(
                {
                    berhasil: false,
                    pesan: error.message,
                },
                {
                    status: 500,
                }
            )
        }

        /*
        |--------------------------------------------------------------------------
        | HAPUS GAMBAR STORAGE
        |--------------------------------------------------------------------------
        */

        if (
            berita.gambar_utama
        ) {
            const imagePath =
                ambilPathStorage(
                    berita.gambar_utama
                )

            if (imagePath) {
                await hapusGambar(
                    supabase,
                    imagePath
                )
            }
        }

        return NextResponse.json({
            berhasil: true,
            pesan:
                'Berita berhasil dihapus.',
        })
    } catch (error) {
        console.error(
            'DELETE /api/berita/[id] error:',
            error
        )

        return NextResponse.json(
            {
                berhasil: false,
                pesan:
                    'Terjadi kesalahan pada server.',
            },
            {
                status: 500,
            }
        )
    }
}