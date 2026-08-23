"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";

interface Berita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  gambar_utama: string | null;
  kategori: string | null;
  tanggal_terbit: string | null;
}

/* =========================================================
   SKELETON
========================================================= */

function BeritaSkeleton() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse bg-gray-200" />
            <div className="h-9 w-64 animate-pulse bg-gray-200 sm:h-10 sm:w-80" />
            <div className="h-4 w-72 animate-pulse bg-gray-100 sm:w-96" />
          </div>

          <div className="hidden h-10 w-36 animate-pulse bg-gray-100 sm:block" />
        </div>

        {/* Card Skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 bg-white">
              {/* Image */}
              <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-20 animate-pulse bg-gray-100" />
                  <div className="h-3 w-16 animate-pulse bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-5 w-full animate-pulse bg-gray-200" />
                  <div className="h-5 w-4/5 animate-pulse bg-gray-200" />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse bg-gray-100" />
                  <div className="h-3 w-full animate-pulse bg-gray-100" />
                  <div className="h-3 w-2/3 animate-pulse bg-gray-100" />
                </div>

                <div className="mt-7 h-4 w-32 animate-pulse bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatTanggal(tanggal: string | null) {
  if (!tanggal) return "Tanggal tidak tersedia";

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak tersedia";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BeritaSection() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchBerita() {
      try {
        const res = await fetch("/api/berita", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const result = await res.json();

        if (!mounted) return;

        if (result?.berhasil && Array.isArray(result?.data)) {
          setBeritaList(result.data.slice(0, 3));
        } else {
          setBeritaList([]);
        }
      } catch (error) {
        console.error("Gagal mengambil berita:", error);

        if (mounted) {
          setBeritaList([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBerita();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <BeritaSkeleton />;
  }

  return (
    <section className="bg-white py-16 sm:py-20" id="berita">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Informasi Desa
            </div>

            <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Berita Terbaru
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Informasi, kegiatan, dan kabar terbaru seputar Desa Kaduagung.
            </p>
          </div>

          <Link
            href="/berita"
            className="group hidden items-center gap-2 border-b-2 border-gray-950 pb-1 text-sm font-bold text-gray-950 transition-colors hover:border-blue-600 hover:text-blue-600 sm:inline-flex"
          >
            Lihat semua berita
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {beritaList.length === 0 ? (
          <div className="border-y border-gray-200 py-16 text-center">
            <Newspaper className="mx-auto mb-4 h-10 w-10 text-gray-300" />

            <h3 className="text-lg font-bold text-gray-900">
              Belum ada berita
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Informasi terbaru Desa Kaduagung akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          /* =================================================
             BERITA GRID
          ================================================= */

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {beritaList.map((item, index) => (
              <article
                key={item.id}
                className="group flex flex-col border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-400"
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <Link
                  href={`/berita/${item.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-gray-100"
                >
                  <Image
                    src={item.gambar_utama || "/placeholder.jpg"}
                    alt={item.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                  {/* Number */}
                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-white text-sm font-black text-gray-950">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Category */}
                  {item.kategori && (
                    <span className="absolute bottom-4 left-4 bg-blue-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      {item.kategori}
                    </span>
                  )}
                </Link>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Date */}
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <time dateTime={item.tanggal_terbit || undefined}>
                      {formatTanggal(item.tanggal_terbit)}
                    </time>
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-gray-950">
                    <Link
                      href={`/berita/${item.slug}`}
                      className="transition-colors hover:text-blue-600"
                    >
                      {item.judul}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">
                    {item.ringkasan}
                  </p>

                  {/* Read More */}
                  <Link
                    href={`/berita/${item.slug}`}
                    className="group/link mt-6 inline-flex w-fit items-center gap-2 border-b border-gray-300 pb-1 text-sm font-bold text-gray-950 transition-colors hover:border-blue-600 hover:text-blue-600"
                  >
                    Baca selengkapnya
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* =================================================
            MOBILE CTA
        ================================================= */}

        <div className="mt-10 sm:hidden">
          <Link
            href="/berita"
            className="flex w-full items-center justify-center gap-2 bg-gray-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            Lihat semua berita
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
