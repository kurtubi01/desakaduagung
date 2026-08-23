'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Search, Edit3, Trash2, Eye, X, 
  CheckCircle, Clock, Image as ImageIcon, MapPin 
} from 'lucide-react';

interface PotensiDesa {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: 'published' | 'draft';
  created_at?: string;
}

// Komponen Skeleton Loader untuk Card Grid (Flat)
function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col animate-pulse">
      {/* Gambar Skeleton */}
      <div className="h-48 w-full bg-slate-200" />
      
      {/* Body Skeleton */}
      <div className="p-5 flex-1 flex flex-col space-y-3">
        {/* Title Skeleton */}
        <div className="h-5 bg-slate-200 w-3/4" />
        
        {/* Description Skeleton (2 baris) */}
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-200 w-full" />
          <div className="h-3.5 bg-slate-200 w-5/6" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="h-8 bg-slate-200 flex-1" />
          <div className="h-8 bg-slate-200 w-16" />
          <div className="h-8 bg-slate-200 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function AdminPotensiDesa() {
  const supabase = createClient();

  const [items, setItems] = useState<PotensiDesa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PotensiDesa | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('potensi_desa')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert(`Gagal mengambil data: ${error.message}`);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('potensi-images')
      .upload(filePath, file);

    if (uploadError) {
      alert(`Upload gambar gagal: ${uploadError.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from('potensi-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = currentImageUrl;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const payload = {
      title,
      description,
      status,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from('potensi_desa')
        .update(payload)
        .eq('id', editingId);

      if (error) alert(`Gagal memperbarui data: ${error.message}`);
    } else {
      const { error } = await supabase
        .from('potensi_desa')
        .insert([payload]);

      if (error) alert(`Gagal menambahkan data: ${error.message}`);
    }

    setUploading(false);
    closeModal();
    fetchData();
  };

  const handleDelete = async (item: PotensiDesa) => {
    if (!confirm(`Yakin ingin menghapus "${item.title}"?`)) return;

    if (item.image_url) {
      const path = item.image_url.split('/potensi-images/')[1];
      if (path) {
        await supabase.storage.from('potensi-images').remove([path]);
      }
    }

    const { error } = await supabase
      .from('potensi_desa')
      .delete()
      .eq('id', item.id);

    if (error) {
      alert(`Gagal menghapus data: ${error.message}`);
    } else {
      fetchData();
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('published');
    setImageFile(null);
    setCurrentImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PotensiDesa) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status || 'published');
    setImageFile(null);
    setCurrentImageUrl(item.image_url || '');
    setIsModalOpen(true);
  };

  const openDetailModal = (item: PotensiDesa) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filtering & Search
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-1">
            <MapPin className="w-4 h-4" /> DESA KADUAGUNG
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            POTENSI DESA KADUAGUNG
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">
            Buat dan Publikasikan Potensi Desa Ke Halaman Utama Website Desa Kadu Agung
          </p>
        </div>

        {/* SEARCH, FILTER & ACTION BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border border-slate-200 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari potensi desa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 text-xs font-medium">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 transition ${filterStatus === 'published' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Publikasi
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1.5 transition ${filterStatus === 'draft' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Draft
              </button>
            </div>

            {/* Tambah Button */}
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </div>

        {/* CARD GRID VIEW & SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Tidak ada potensi desa yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-xs">Tidak ada gambar</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold flex items-center gap-1 backdrop-blur-md ${
                      item.status === 'published'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {item.status === 'published' ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Publikasi
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Draft
                      </>
                    )}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-emerald-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openDetailModal(item)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL FORM (CREATE / EDIT) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {editingId ? 'Edit Potensi Desa' : 'Tambah Potensi Desa'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Judul Potensi</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Contoh: Perkebunan Durian"
                    className="w-full px-3 py-2 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3 py-2 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="published">Publikasi (Tampil ke publik)</option>
                    <option value="draft">Draft (Hanya internal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    placeholder="Tuliskan deskripsi lengkap mengenai potensi desa..."
                    className="w-full px-3 py-2 border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Upload Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {uploading ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETAIL */}
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-slate-700 p-1.5 z-10"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedItem.image_url && (
                <div className="h-56 w-full bg-slate-100">
                  <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold ${selectedItem.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedItem.status === 'published' ? 'Publikasi' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{selectedItem.title}</h3>
                <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}