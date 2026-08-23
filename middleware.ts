import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)

            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })

            response.cookies.set(name, value)
          })
        },
      },
    }
  )

  /*
   * PENTING:
   * Gunakan getUser(), bukan getSession()
   *
   * getUser() melakukan validasi user ke Supabase Auth.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  /*
   * =========================
   * ROUTE LOGIN
   * =========================
   */

  if (pathname === '/login') {
    // Kalau sudah login, jangan boleh kembali ke login
    if (user) {
      return NextResponse.redirect(
        new URL('/admin/dashboard', request.url)
      )
    }

    return response
  }

  /*
   * =========================
   * ROUTE ADMIN
   * =========================
   */

  if (pathname.startsWith('/admin')) {
    // Belum login
    if (!user) {
      const loginUrl = new URL('/login', request.url)

      // Simpan halaman tujuan
      loginUrl.searchParams.set(
        'redirect',
        pathname
      )

      return NextResponse.redirect(loginUrl)
    }

    /*
     * =========================
     * ROLE ADMIN
     * =========================
     *
     * Gunakan app_metadata.role.
     *
     * JANGAN gunakan user_metadata.role
     * untuk authorization karena user_metadata
     * dapat diubah oleh user.
     */

    const role = user.app_metadata?.role

    if (role !== 'admin') {
      return NextResponse.redirect(
        new URL('/login?error=unauthorized', request.url)
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua route
     * kecuali file static dan internal Next.js.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
}