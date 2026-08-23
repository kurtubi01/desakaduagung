import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token tidak ditemukan' }, { status: 400 })
    }

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

    // Verifikasi token ke endpoint Cloudflare
    const formData = new FormData()
    formData.append('secret', secretKey || '')
    formData.append('response', token)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const outcome = await res.json()

    if (outcome.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: 'Verifikasi bot gagal' }, { status: 400 })
    }
  } catch (err) {
    console.error('Turnstile verification error:', err)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}