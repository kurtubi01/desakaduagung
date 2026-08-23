"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, X, Images, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

export default function Gallery() {
  const supabase = createClient();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchGallery = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("gallery")
      .select("id, title, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data galeri:", error);
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const nextImage = () => {
    if (items.length === 0) return;

    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (items.length === 0) return;

    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <section className="bg-white py-16 md:py-20" id="galeri">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-1 bg-emerald-600" />

                <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
                  Dokumentasi Desa
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                Galeri Desa Kadu Agung
              </h2>

              <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-500">
                Dokumentasi kegiatan, pembangunan, dan berbagai aktivitas
                masyarakat Desa Kadu Agung.
              </p>
            </div>

            {items.length > 0 && (
              <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Images className="w-5 h-5 text-emerald-600" />
                {items.length} Dokumentasi
              </div>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-62.5 items-center justify-center bg-slate-50">
              <div className="text-center">
                <Loader2 className="mx-auto mb-3 h-7 w-7 animate-spin text-emerald-600" />

                <p className="text-sm font-medium text-slate-500">
                  Memuat galeri...
                </p>
              </div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && items.length === 0 && (
            <div className="bg-slate-50 py-16 text-center">
              <Images className="mx-auto mb-4 h-10 w-10 text-slate-300" />

              <h3 className="font-bold text-slate-700">
                Belum Ada Dokumentasi
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Dokumentasi kegiatan desa akan tampil di sini.
              </p>
            </div>
          )}

          {/* ================= MOBILE SLIDER ================= */}
          {!loading && items.length > 0 && (
            <div className="md:hidden">
              <div className="relative overflow-hidden bg-slate-100">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {items.map((item) => (
                    <div key={item.id} className="relative min-w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(item)}
                        className="block w-full text-left"
                      >
                        <div className="relative aspect-4/3 w-full">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5 pt-16">
                            <h3 className="text-lg font-bold text-white">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs text-slate-200">
                              {formatDate(item.created_at)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* PREVIOUS */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Foto sebelumnya"
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      bg-white/90
                      text-slate-800
                      hover:bg-white
                      transition
                    "
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* NEXT */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Foto berikutnya"
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      bg-white/90
                      text-slate-800
                      hover:bg-white
                      transition
                    "
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* DOTS */}
              {items.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Lihat foto ${index + 1}`}
                      className={`
                        h-1.5
                        transition-all
                        ${
                          index === currentIndex
                            ? "w-7 bg-emerald-600"
                            : "w-2 bg-slate-300"
                        }
                      `}
                    />
                  ))}
                </div>
              )}

              {/* MOBILE SWIPE HINT */}
              <p className="mt-4 text-center text-xs text-slate-400">
                Geser atau gunakan tombol untuk melihat foto lainnya
              </p>
            </div>
          )}

          {/* ================= DESKTOP GRID ================= */}
          {!loading && items.length > 0 && (
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="
                    group
                    bg-slate-50
                    text-left
                    overflow-hidden
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                >
                  {/* IMAGE */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="
                        (min-width: 1280px) 25vw,
                        (min-width: 1024px) 33vw,
                        50vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* Hover Overlay */}
                    <div
                      className="
                      absolute
                      inset-0
                      bg-black/0
                      group-hover:bg-black/20
                      transition
                    "
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3
                      className="
                      line-clamp-2
                      font-bold
                      text-slate-800
                      group-hover:text-emerald-700
                      transition
                    "
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= LIGHTBOX ================= */}
      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/90
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setSelectedImage(null)}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="
              absolute
              right-4
              top-4
              z-10
              flex
              h-11
              w-11
              items-center
              justify-center
              bg-white
              text-slate-800
              hover:bg-slate-100
              transition
            "
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>

          {/* IMAGE */}
          <div
            className="
              relative
              w-full
              max-w-5xl
              max-h-[90vh]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* TITLE */}
            <div className="bg-white px-5 py-4">
              <h3 className="font-bold text-slate-900">
                {selectedImage.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(selectedImage.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}