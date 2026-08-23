import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Newspaper,
  MessageSquare,
  Image as ImageIcon,
  ArrowUpRight,
  User,
  Activity,
} from 'lucide-react'

const statistik = [
  {
    key: 'berita',
    label: 'Total Berita',
    icon: Newspaper,
    href: '/admin/berita',
    action: 'Kelola Berita',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    numberColor: 'text-emerald-600',
  },
  {
    key: 'pesan',
    label: 'Pesan Pengunjung',
    icon: MessageSquare,
    href: '/admin/pesan',
    action: 'Lihat Pesan',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    numberColor: 'text-blue-600',
  },
  {
    key: 'gallery',
    label: 'Galeri Foto',
    icon: ImageIcon,
    href: '/admin/gallery',
    action: 'Kelola Galeri',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    numberColor: 'text-violet-600',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Cek login
  if (!user) {
    redirect('/login')
  }

  // Cek role admin
  const role = user.app_metadata?.role

  if (role !== 'admin') {
    redirect('/login?error=unauthorized')
  }

  // Ambil statistik secara paralel
  const [
    { count: totalBerita },
    { count: totalPesan },
    { count: totalGallery },
  ] = await Promise.all([
    supabase
      .from('berita')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('pesan_kontak')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('gallery')
      .select('*', {
        count: 'exact',
        head: true,
      }),
  ])

  const totals = {
    berita: totalBerita ?? 0,
    pesan: totalPesan ?? 0,
    gallery: totalGallery ?? 0,
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <section
          className="
            relative mb-8 overflow-hidden
            bg-gradient-to-br
            from-emerald-500
            via-emerald-500
            to-teal-600
            p-6
            shadow-xl
            shadow-emerald-500/10
            animate-in
            fade-in
            slide-in-from-bottom-4
            duration-500
            sm:p-8
            lg:p-10
          "
        >
          {/* Decorative Shape */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              bg-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-20
              h-72
              w-72
              bg-white/5
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* Informasi Dashboard */}
            <div className="max-w-3xl">

              {/* Badge */}
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  bg-white/15
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  backdrop-blur-sm
                "
              >
                <Activity size={14} />

                Admin Panel
              </div>

              {/* Title */}
              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                Dashboard Admin
              </h1>

              {/* Description */}
              <p
                className="
                  mt-2
                  text-sm
                  font-medium
                  leading-relaxed
                  text-emerald-50
                  sm:text-base
                "
              >
                Kelola informasi, berita, galeri, dan pesan pengunjung
                Desa Kadu Agung dengan mudah.
              </p>
            </div>

            {/* =================================================
                USER LOGIN
            ================================================= */}
            <div
              className="
                flex
                items-center
                gap-3
                bg-white/15
                px-4
                py-3
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-white/20
              "
            >
              {/* User Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  bg-white
                  text-emerald-600
                  shadow-sm
                "
              >
                <User
                  size={19}
                  strokeWidth={2.5}
                />
              </div>

              {/* User Information */}
              <div className="min-w-0">

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-100
                  "
                >
                  Login Sebagai
                </p>

                <p
                  className="
                    max-w-[200px]
                    truncate
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {user.email}
                </p>

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            SECTION HEADING
        ===================================================== */}
        <div className="mb-5 flex items-end justify-between">

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-emerald-600
              "
            >
              Ringkasan
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-black
                tracking-tight
                text-slate-900
                sm:text-2xl
              "
            >
              Statistik Website
            </h2>

          </div>

          <div
            className="
              hidden
              text-xs
              font-medium
              text-slate-400
              sm:block
            "
          >
            Data terbaru
          </div>

        </div>

        {/* =====================================================
            STATISTIK
        ===================================================== */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {statistik.map((item, index) => {
            const Icon = item.icon

            const total =
              totals[item.key as keyof typeof totals]

            return (
              <div
                key={item.key}
                className={`
                  group
                  relative
                  overflow-hidden
                  ${item.bg}
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  animate-in
                  fade-in
                  slide-in-from-bottom-5
                  fill-mode-both
                `}
                style={{
                  animationDelay: `${150 + index * 100}ms`,
                }}
              >

                {/* Decorative Shape */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-28
                    w-28
                    bg-white/50
                    transition-transform
                    duration-500
                    group-hover:scale-125
                  "
                />

                <div className="relative">

                  {/* Icon + Label */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      {/* Label */}
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        {item.label}
                      </p>

                      {/* Number */}
                      <div
                        className={`
                          mt-4
                          text-5xl
                          font-black
                          tracking-tight
                          ${item.numberColor}
                        `}
                      >
                        {total}
                      </div>

                    </div>

                    {/* Icon */}
                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        ${item.iconBg}
                        ${item.iconColor}
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:rotate-3
                      `}
                    >
                      <Icon
                        size={25}
                        strokeWidth={2.5}
                      />
                    </div>

                  </div>

                  {/* =================================================
                      ACTION
                  ================================================= */}
                  <Link
                    href={item.href}
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      bg-white/80
                      px-4
                      py-3
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-slate-700
                      shadow-sm
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:bg-white
                      hover:text-emerald-600
                      hover:shadow-md
                    "
                  >

                    <span>
                      {item.action}
                    </span>

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        bg-slate-100
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:bg-emerald-100
                        group-hover:text-emerald-600
                      "
                    >
                      <ArrowUpRight size={15} />
                    </span>

                  </Link>

                </div>
              </div>
            )
          })}

        </section>

        {/* =====================================================
            FOOTER INFO
        ===================================================== */}
        <section
          className="
            mt-8
            bg-white
            p-5
            shadow-sm
            animate-in
            fade-in
            duration-700
          "
        >

          <div className="flex items-center gap-3">

            {/* Icon */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                bg-emerald-50
                text-emerald-600
              "
            >
              <Activity size={18} />
            </div>

            {/* Text */}
            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-slate-800
                "
              >
                Dashboard Desa Kadu Agung
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Gunakan menu admin untuk mengelola konten website desa.
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  )
}