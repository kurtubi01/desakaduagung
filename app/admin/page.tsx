import {
  Users,
  FileText,
  UserCheck,
  Clock3,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react'

const statistics = [
  {
    title: 'Total Pendaftar',
    value: '1,248',
    change: '+12.5%',
    description: 'dibanding bulan lalu',
    icon: Users,
  },
  {
    title: 'Pendaftaran Baru',
    value: '328',
    change: '+8.2%',
    description: 'bulan ini',
    icon: FileText,
  },
  {
    title: 'Terverifikasi',
    value: '284',
    change: '+15.4%',
    description: 'dari total pendaftar',
    icon: UserCheck,
  },
  {
    title: 'Menunggu Verifikasi',
    value: '44',
    change: '-4.3%',
    description: 'perlu ditinjau',
    icon: Clock3,
  },
]

const recentRegistrations = [
  {
    name: 'Ahmad Fauzan',
    email: 'ahmad@example.com',
    status: 'Terverifikasi',
    date: '23 Agu 2026',
  },
  {
    name: 'Siti Rahma',
    email: 'siti@example.com',
    status: 'Menunggu',
    date: '23 Agu 2026',
  },
  {
    name: 'Muhammad Rizky',
    email: 'rizky@example.com',
    status: 'Terverifikasi',
    date: '22 Agu 2026',
  },
  {
    name: 'Nur Aisyah',
    email: 'aisyah@example.com',
    status: 'Menunggu',
    date: '22 Agu 2026',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-slate-400">
            Selamat datang kembali 👋
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard Administrator
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Pantau aktivitas pendaftaran dan kelola data
            sistem Desa Kudaung dari satu tempat.
          </p>
        </div>

        {/* Decorative */}
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-white/[0.03]" />
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon size={21} />
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    {item.value}
                  </h3>

                  <span className="mb-1 text-xs font-semibold text-emerald-600">
                    {item.change}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </section>

      {/* Content */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Pendaftaran Terbaru
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Data pendaftar yang baru masuk
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Lihat semua
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRegistrations.map((item) => (
              <div
                key={item.email}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {item.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {item.email}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`
                      inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold
                      ${
                        item.status === 'Terverifikasi'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }
                    `}
                  >
                    {item.status}
                  </span>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              Aktivitas
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Ringkasan aktivitas sistem
            </p>
          </div>

          <div className="space-y-5">
            <ActivityItem
              title="Pendaftaran baru"
              description="32 pendaftar baru hari ini"
              time="2 jam lalu"
            />

            <ActivityItem
              title="Verifikasi data"
              description="18 data berhasil diverifikasi"
              time="4 jam lalu"
            />

            <ActivityItem
              title="Data diperbarui"
              description="12 data siswa diperbarui"
              time="6 jam lalu"
            />

            <ActivityItem
              title="Login administrator"
              description="Administrator masuk ke sistem"
              time="Hari ini"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex gap-3">
      <div className="relative flex w-8 justify-center">
        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />

        <span className="absolute left-1/2 top-4 h-full w-px -translate-x-1/2 bg-slate-100" />
      </div>

      <div className="flex-1 pb-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <span className="shrink-0 text-[10px] text-slate-400">
            {time}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  )
}