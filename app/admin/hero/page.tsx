
"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Image as ImageIcon,
    Eye,
    EyeOff,
    GripVertical,
    Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface HeroSlide {
    id: string;
    tagline: string | null;
    title: string;
    description: string | null;
    image_url: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface FormData {
    tagline: string;
    title: string;
    description: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
}

const initialForm: FormData = {
    tagline: "",
    title: "",
    description: "",
    image_url: "",
    sort_order: 1,
    is_active: true,
};

export default function HeroAdminPage() {
    const supabase = createClient();

    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState<FormData>(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const fetchSlides = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("hero_slides")
            .select("*")
            .order("sort_order", {
                ascending: true,
            });

        if (error) {
            console.error("Gagal mengambil slide:", error);
            alert("Gagal mengambil data slide.");
            setLoading(false);
            return;
        }

        setSlides(data ?? []);
        setLoading(false);
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const openCreateModal = () => {
        setEditingId(null);

        setForm({
            ...initialForm,
            sort_order: slides.length + 1,
        });

        setImageFile(null);
        setImagePreview("");
        setModalOpen(true);
    };

    const openEditModal = (slide: HeroSlide) => {
        setEditingId(slide.id);

        setForm({
            tagline: slide.tagline ?? "",
            title: slide.title,
            description: slide.description ?? "",
            image_url: slide.image_url,
            sort_order: slide.sort_order,
            is_active: slide.is_active,
        });

        setImageFile(null);
        setImagePreview(slide.image_url);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving || uploading) return;

        setModalOpen(false);
        setEditingId(null);
        setForm(initialForm);
        setImageFile(null);
        setImagePreview("");
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Ukuran gambar maksimal 5 MB.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("File harus berupa gambar.");
            return;
        }

        setImageFile(file);

        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    };

    const uploadImage = async (file: File) => {
        setUploading(true);

        const extension =
            file.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `hero/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("hero-slides")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            setUploading(false);
            throw new Error("Gagal mengupload gambar.");
        }

        const {
            data: { publicUrl },
        } = supabase.storage
            .from("hero-slides")
            .getPublicUrl(filePath);

        setUploading(false);

        return publicUrl;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!form.title.trim()) {
            alert("Judul wajib diisi.");
            return;
        }

        if (!editingId && !imageFile) {
            alert("Silakan pilih gambar.");
            return;
        }

        if (editingId && !form.image_url && !imageFile) {
            alert("Gambar wajib tersedia.");
            return;
        }

        setSaving(true);

        try {
            let imageUrl = form.image_url;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            if (!imageUrl) {
                throw new Error("Gambar belum tersedia.");
            }

            const payload = {
                tagline: form.tagline.trim() || null,
                title: form.title.trim(),
                description: form.description.trim() || null,
                image_url: imageUrl,
                sort_order: Number(form.sort_order) || 1,
                is_active: form.is_active,
                updated_at: new Date().toISOString(),
            };

            if (editingId) {
                const { error } = await supabase
                    .from("hero_slides")
                    .update(payload)
                    .eq("id", editingId);

                if (error) {
                    console.error(error);
                    throw new Error(
                        "Gagal memperbarui slide."
                    );
                }

                alert("Slide berhasil diperbarui.");
            } else {
                const { error } = await supabase
                    .from("hero_slides")
                    .insert({
                        ...payload,
                        created_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error(error);
                    throw new Error(
                        "Gagal menambahkan slide."
                    );
                }

                alert("Slide berhasil ditambahkan.");
            }

            closeModal();
            await fetchSlides();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteStorageImage = async (imageUrl: string) => {
        if (!imageUrl) return;

        try {
            const marker =
                "/storage/v1/object/public/hero-slides/";

            const index = imageUrl.indexOf(marker);

            if (index === -1) return;

            const filePath = imageUrl.substring(
                index + marker.length
            );

            await supabase.storage
                .from("hero-slides")
                .remove([filePath]);
        } catch (error) {
            console.error(
                "Gagal menghapus gambar storage:",
                error
            );
        }
    };

    const handleDelete = async (slide: HeroSlide) => {
        const confirmed = window.confirm(
            `Apakah Anda yakin ingin menghapus slide "${slide.title}"?`
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("hero_slides")
            .delete()
            .eq("id", slide.id);

        if (error) {
            console.error(error);
            alert("Gagal menghapus slide.");
            return;
        }

        await deleteStorageImage(slide.image_url);

        alert("Slide berhasil dihapus.");

        await fetchSlides();
    };

    const toggleActive = async (slide: HeroSlide) => {
        const { error } = await supabase
            .from("hero_slides")
            .update({
                is_active: !slide.is_active,
                updated_at: new Date().toISOString(),
            })
            .eq("id", slide.id);

        if (error) {
            console.error(error);
            alert("Gagal mengubah status slide.");
            return;
        }

        setSlides((current) =>
            current.map((item) =>
                item.id === slide.id
                    ? {
                          ...item,
                          is_active: !item.is_active,
                      }
                    : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Hero Slider
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Kelola tampilan slider pada halaman
                            beranda Desa Kadu Agung.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-[#073b27]
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#0b5136]
                        "
                    >
                        <Plus size={18} />
                        Tambah Slide
                    </button>
                </div>

                {/* INFO */}
                <div className="mb-6 border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex gap-3">
                        <ImageIcon
                            className="mt-0.5 shrink-0 text-emerald-600"
                            size={20}
                        />

                        <div>
                            <h2 className="font-semibold text-emerald-900">
                                Pengaturan Hero
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-emerald-700">
                                Tambahkan foto, tagline, judul, dan
                                deskripsi untuk setiap slide.
                                Tombol "Jelajahi Desa" akan otomatis
                                ditampilkan pada semua slide.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="overflow-hidden border border-slate-200 bg-white">

                    {/* DESKTOP HEADER */}
                    <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid md:grid-cols-[40px_180px_1fr_100px_140px] md:gap-4">
                        <div />

                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Foto
                        </div>

                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Konten
                        </div>

                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                        </div>

                        <div className="text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Aksi
                        </div>
                    </div>

                    {/* LOADING */}
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="text-sm text-slate-500">
                                Memuat data...
                            </div>
                        </div>
                    ) : slides.length === 0 ? (
                        <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 flex h-16 w-16 items-center justify-center bg-slate-100">
                                <ImageIcon
                                    size={28}
                                    className="text-slate-400"
                                />
                            </div>

                            <h3 className="font-semibold text-slate-900">
                                Belum ada slide
                            </h3>

                            <p className="mt-1 max-w-md text-sm text-slate-500">
                                Tambahkan slide pertama untuk
                                ditampilkan pada halaman beranda.
                            </p>

                            <button
                                onClick={openCreateModal}
                                className="
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-[#073b27]
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#0b5136]
                                "
                            >
                                <Plus size={18} />
                                Tambah Slide
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {slides.map((slide) => (
                                <div
                                    key={slide.id}
                                    className="
                                        group
                                        p-4
                                        md:grid
                                        md:grid-cols-[40px_180px_1fr_100px_140px]
                                        md:items-center
                                        md:gap-4
                                        md:px-6
                                    "
                                >

                                    {/* ORDER */}
                                    <div className="mb-3 flex items-center gap-2 md:mb-0">
                                        <GripVertical
                                            size={18}
                                            className="text-slate-300"
                                        />

                                        <span className="flex h-7 w-7 items-center justify-center bg-slate-100 text-xs font-bold text-slate-600">
                                            {slide.sort_order}
                                        </span>
                                    </div>

                                    {/* IMAGE */}
                                    <div className="mb-4 md:mb-0">
                                        <div className="aspect-video overflow-hidden bg-slate-100">
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition
                                                    duration-300
                                                    group-hover:scale-105
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="min-w-0">

                                        {slide.tagline && (
                                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#20c997]">
                                                {slide.tagline}
                                            </p>
                                        )}

                                        <h3 className="line-clamp-2 font-bold text-slate-900">
                                            {slide.title}
                                        </h3>

                                        {slide.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                {slide.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* STATUS */}
                                    <div className="mt-4 md:mt-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleActive(slide)
                                            }
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                border
                                                px-3
                                                py-2
                                                text-xs
                                                font-semibold
                                                ${
                                                    slide.is_active
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                        : "border-slate-200 bg-slate-50 text-slate-500"
                                                }
                                            `}
                                        >
                                            {slide.is_active ? (
                                                <>
                                                    <Eye size={14} />
                                                    Aktif
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={14} />
                                                    Nonaktif
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="mt-4 flex items-center justify-start gap-2 md:mt-0 md:justify-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(slide)
                                            }
                                            className="
                                                inline-flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                border
                                                border-slate-200
                                                text-slate-600
                                                transition
                                                hover:border-blue-200
                                                hover:bg-blue-50
                                                hover:text-blue-600
                                            "
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(slide)
                                            }
                                            className="
                                                inline-flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                border
                                                border-slate-200
                                                text-slate-600
                                                transition
                                                hover:border-red-200
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* TOTAL */}
                {!loading && slides.length > 0 && (
                    <div className="mt-4 text-sm text-slate-500">
                        Total {slides.length} slide
                        {slides.length !== 1 ? "s" : ""} terdaftar.
                    </div>
                )}
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto bg-white">

                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-6">

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingId
                                        ? "Edit Slide"
                                        : "Tambah Slide"}
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Isi informasi yang akan tampil
                                    pada hero beranda.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving || uploading}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                "
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5 md:p-6"
                        >

                            {/* IMAGE */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Foto Hero
                                </label>

                                <label className="block cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                    {imagePreview ? (
                                        <div className="group relative aspect-video overflow-hidden border border-slate-200 bg-slate-100">

                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />

                                            <div className="
                                                absolute
                                                inset-0
                                                flex
                                                items-center
                                                justify-center
                                                bg-black/50
                                                opacity-0
                                                transition
                                                group-hover:opacity-100
                                            ">
                                                <div className="flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                                    <Upload size={16} />
                                                    Ganti Foto
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="
                                            flex
                                            aspect-video
                                            flex-col
                                            items-center
                                            justify-center
                                            border-2
                                            border-dashed
                                            border-slate-300
                                            bg-slate-50
                                            transition
                                            hover:border-[#20c997]
                                            hover:bg-emerald-50
                                        ">
                                            <Upload
                                                size={28}
                                                className="mb-2 text-slate-400"
                                            />

                                            <p className="text-sm font-semibold text-slate-600">
                                                Klik untuk upload
                                                foto
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                JPG, PNG, WEBP •
                                                Maks. 5 MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* TAGLINE */}
                            <div>
                                <label
                                    htmlFor="tagline"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Tagline
                                </label>

                                <input
                                    id="tagline"
                                    type="text"
                                    value={form.tagline}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            tagline:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: Selamat Datang di"
                                    className="
                                        w-full
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-[#20c997]
                                        focus:bg-white
                                    "
                                />
                            </div>

                            {/* TITLE */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Judul / H1
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <textarea
                                    id="title"
                                    rows={2}
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            title:
                                                e.target.value,
                                        })
                                    }
                                    placeholder={
                                        "Contoh:\nDesa Kadu Agung"
                                    }
                                    className="
                                        w-full
                                        resize-none
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-[#20c997]
                                        focus:bg-white
                                    "
                                    required
                                />

                                <p className="mt-1 text-xs text-slate-400">
                                    Gunakan Enter jika ingin
                                    membuat baris baru pada judul.
                                </p>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Deskripsi / Paragraf
                                </label>

                                <textarea
                                    id="description"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi singkat mengenai desa..."
                                    className="
                                        w-full
                                        resize-none
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-[#20c997]
                                        focus:bg-white
                                    "
                                />
                            </div>

                            {/* ORDER + STATUS */}
                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="sort_order"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Urutan Slide
                                    </label>

                                    <input
                                        id="sort_order"
                                        type="number"
                                        min={1}
                                        value={form.sort_order}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sort_order:
                                                    Number(
                                                        e.target
                                                            .value
                                                    ),
                                            })
                                        }
                                        className="
                                            w-full
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-[#20c997]
                                            focus:bg-white
                                        "
                                    />
                                </div>

                                {/* STATUS */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Status
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                is_active:
                                                    !form.is_active,
                                            })
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            border
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                form.is_active
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 bg-slate-50 text-slate-500"
                                            }
                                        `}
                                    >
                                        <span>
                                            {form.is_active
                                                ? "Slide Aktif"
                                                : "Slide Nonaktif"}
                                        </span>

                                        {/* SWITCH */}
                                        <span
                                            className={`
                                                relative
                                                h-6
                                                w-11
                                                transition
                                                ${
                                                    form.is_active
                                                        ? "bg-[#20c997]"
                                                        : "bg-slate-300"
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    absolute
                                                    top-1
                                                    h-4
                                                    w-4
                                                    bg-white
                                                    transition
                                                    ${
                                                        form.is_active
                                                            ? "left-6"
                                                            : "left-1"
                                                    }
                                                `}
                                            />
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* CTA INFO */}
                            <div className="border border-slate-200 bg-slate-50 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Tombol CTA
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-3">

                                    <span className="bg-[#20c997] px-4 py-2 text-xs font-bold text-[#073b27]">
                                        Jelajahi Desa
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        Otomatis mengarah ke
                                        section #profil
                                    </span>
                                </div>
                            </div>

                            {/* ACTION */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={
                                        saving || uploading
                                    }
                                    className="
                                        border
                                        border-slate-200
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving || uploading
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-[#073b27]
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#0b5136]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {saving || uploading ? (
                                        <>
                                            <span className="
                                                h-4
                                                w-4
                                                animate-spin
                                                border-2
                                                border-white/30
                                                border-t-white
                                            " />

                                            {uploading
                                                ? "Mengupload..."
                                                : "Menyimpan..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />

                                            {editingId
                                                ? "Simpan Perubahan"
                                                : "Tambah Slide"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}