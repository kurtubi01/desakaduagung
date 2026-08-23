'use client'

type StatusSelectProps = {
  id: string
  currentStatus: string
  onUpdateStatus: (formData: FormData) => Promise<void>
}

export default function StatusSelect({
  id,
  currentStatus,
  onUpdateStatus,
}: StatusSelectProps) {
  return (
    <form action={onUpdateStatus} className="flex-1">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="w-full border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
      >
        <option value="baru">Baru</option>
        <option value="dibaca">Dibaca</option>
        <option value="diproses">Diproses</option>
        <option value="selesai">Selesai</option>
      </select>
    </form>
  )
}