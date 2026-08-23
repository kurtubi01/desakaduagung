'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Edit2, Upload, X, Loader2 } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  image_url: string
  created_at: string
}

export default function GalleryAdminPage() {
  const supabase = createClient()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching gallery:', error.message)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const resetForm = () => {
    setTitle('')
    setFile(null)
    setPreviewUrl(null)
    setEditingId(null)
  }

  const handleEditClick = (item: GalleryItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setPreviewUrl(item.image_url)
    setFile(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Judul foto wajib diisi!')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = previewUrl

      // Upload gambar baru
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrlData.publicUrl
      }

      if (!imageUrl) {
        throw new Error('Gambar wajib diunggah!')
      }

      // Update
      if (editingId) {
        const { error } = await supabase
          .from('gallery')
          .update({
            title: title.trim(),
            image_url: imageUrl,
          })
          .eq('id', editingId)

        if (error) {
          throw error
        }
      }

      // Insert
      else {
        const { error } = await supabase
          .from('gallery')
          .insert([
            {
              title: title.trim(),
              image_url: imageUrl,
            },
          ])

        if (error) {
          throw error
        }
      }

      resetForm()
      await fetchGallery()
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      return
    }

    try {
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (dbError) {
        throw dbError
      }

      const path = imageUrl.split('/gallery-images/')[1]

      if (path) {
        await supabase.storage
          .from('gallery-images')
          .remove([path])
      }

      await fetchGallery()
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="space-y-8">

        {/* HEADER */}
        <header className="bg-emerald-700 px-6 py-7 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Galeri Desa Kadu Agung
              </h1>

              <p className="text-emerald-100 mt-1 text-sm md:text-base">
                Kelola foto dan dokumentasi kegiatan Desa Kadu Agung
              </p>
            </div>

            <div className="text-sm font-semibold text-emerald-100">
              {items.length} Foto
            </div>
          </div>
        </header>

        {/* FORM */}
        <section className="bg-white border border-slate-200">
          <div className="px-5 py-4 md:px-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">
              {editingId ? 'Edit Foto Galeri' : 'Tambah Foto Baru'}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {editingId
                ? 'Perbarui informasi foto galeri desa.'
                : 'Tambahkan dokumentasi foto terbaru desa.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">

            {/* JUDUL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Judul Foto
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul foto desa..."
                className="
                  w-full
                  bg-slate-50
                  border border-slate-200
                  px-4 py-3
                  text-sm text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  focus:border-emerald-500
                  focus:bg-white
                  transition
                "
                required
              />
            </div>

            {/* FILE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                File Foto
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="
                  w-full
                  bg-slate-50
                  border border-slate-200
                  p-2
                  text-sm
                  text-slate-600
                  file:mr-4
                  file:py-2
                  file:px-4
                  file:border-0
                  file:bg-emerald-600
                  file:text-white
                  file:font-semibold
                  hover:file:bg-emerald-700
                  cursor-pointer
                "
              />

              <p className="text-xs text-slate-400 mt-2">
                Format JPG, JPEG, PNG atau WEBP.
              </p>
            </div>

            {/* PREVIEW */}
            {previewUrl && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Pratinjau
                </p>

                <div className="relative w-full max-w-sm h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* ACTION */}
            <div className="flex flex-wrap gap-3 pt-2">

              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-emerald-600
                  hover:bg-emerald-700
                  disabled:bg-emerald-300
                  text-white
                  font-semibold
                  px-5 py-3
                  text-sm
                  transition
                "
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}

                {editingId
                  ? 'Simpan Perubahan'
                  : 'Publikasikan Foto'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-slate-100
                    hover:bg-slate-200
                    text-slate-700
                    font-semibold
                    px-5 py-3
                    text-sm
                    transition
                  "
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
              )}

            </div>
          </form>
        </section>

        {/* DAFTAR GALERI */}
        <section>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Daftar Galeri Desa
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Dokumentasi foto yang telah dipublikasikan
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-slate-200 p-10 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-emerald-600" />

              <p className="text-sm font-medium text-slate-500">
                Memuat data galeri...
              </p>
            </div>
          ) : items.length === 0 ? (
            /* EMPTY */
            <div className="bg-white border border-slate-200 p-10 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-700">
                Belum Ada Foto
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Silakan tambahkan foto galeri desa.
              </p>
            </div>
          ) : (
            /* GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white
                    border border-slate-200
                    overflow-hidden
                    transition
                    hover:border-slate-300
                  "
                >

                  {/* IMAGE */}
                  <div className="h-52 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition
                        duration-300
                        hover:scale-105
                      "
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    <h3 className="font-bold text-base text-slate-800 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(item.created_at).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </p>

                  </div>

                  {/* ACTION */}
                  <div className="grid grid-cols-2 border-t border-slate-200">

                    <button
                      onClick={() => handleEditClick(item)}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3
                        bg-amber-50
                        hover:bg-amber-100
                        text-amber-700
                        font-semibold
                        text-sm
                        transition
                      "
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id, item.image_url)
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3
                        bg-rose-50
                        hover:bg-rose-100
                        text-rose-600
                        font-semibold
                        text-sm
                        border-l
                        border-slate-200
                        transition
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  )
}