import type { Metadata } from "next";

import { notFound } from "next/navigation";
import Link from "next/link";
import ShareBerita from "./ShareBerita";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Globe2,
  Newspaper,
  Share2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import DetailBerita from "@/components/berita/DetailBerita";

import type { DataBerita } from "@/components/berita/DaftarBerita";

import Footer from "@/components/Footer";

interface HalamanBeritaProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ambilBerita(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("berita")
    .select(
      `
            id,
            judul,
            slug,
            ringkasan,
            isi,
            gambar_utama,
            kategori,
            tag,
            status,
            tanggal_terbit,
            judul_seo,
            deskripsi_seo,
            dibuat_pada,
            diperbarui_pada
        `,
    )
    .eq("slug", slug)
    .eq("status", "diterbitkan")
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil detail berita:", error);

    return null;
  }

  return data as DataBerita | null;
}

export async function generateMetadata({
  params,
}: HalamanBeritaProps): Promise<Metadata> {
  const { slug } = await params;

  const berita = await ambilBerita(slug);

  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Berita desa yang Anda cari tidak ditemukan.",
    };
  }

  const judul = berita.judul_seo || berita.judul;

  const deskripsi =
    berita.deskripsi_seo || berita.ringkasan || `Baca berita ${berita.judul}`;

  return {
    title: `${judul} | Berita Desa`,

    description: deskripsi,

    alternates: {
      canonical: `/berita/${berita.slug}`,
    },

    openGraph: {
      title: judul,

      description: deskripsi,

      type: "article",

      url: `/berita/${berita.slug}`,

      publishedTime: berita.tanggal_terbit || berita.dibuat_pada || undefined,

      modifiedTime: berita.diperbarui_pada || undefined,

      images: berita.gambar_utama
        ? [
            {
              url: berita.gambar_utama,
              alt: berita.judul,
            },
          ]
        : [],
    },
  };
}

export default async function HalamanDetailBerita({
  params,
}: HalamanBeritaProps) {
  const { slug } = await params;

  const berita = await ambilBerita(slug);

  if (!berita) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "NewsArticle",

    headline: berita.judul,

    description: berita.deskripsi_seo || berita.ringkasan || berita.judul,

    datePublished: berita.tanggal_terbit || berita.dibuat_pada,

    dateModified:
      berita.diperbarui_pada || berita.tanggal_terbit || berita.dibuat_pada,

    mainEntityOfPage: {
      "@type": "WebPage",

      "@id": `/berita/${berita.slug}`,
    },

    image: berita.gambar_utama ? [berita.gambar_utama] : [],

    articleSection: berita.kategori || "Berita Desa",

    keywords: berita.tag || undefined,
  };

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
                STRUCTURED DATA
            ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* =====================================================
                HERO / ARTICLE HEADER
            ====================================================== */}

      <section className="relative overflow-hidden border-b border-emerald-900 bg-emerald-950">
        {/* Decorative elements */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-40 h-[420px] w-[420px] bg-emerald-700/20 blur-3xl" />

          <div className="absolute -right-32 top-0 h-[450px] w-[450px] bg-green-500/10 blur-3xl" />

          <div className="absolute bottom-[-220px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 bg-teal-500/10 blur-3xl" />
        </div>

        {/* Grid pattern */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
                            linear-gradient(
                                rgba(255,255,255,.8) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                90deg,
                                rgba(255,255,255,.8) 1px,
                                transparent 1px
                            )
                            `,
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
          {/* Top navigation */}

          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link
              href="/berita"
              className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-emerald-100/70
                                transition
                                hover:text-white
                            "
            >
              <ArrowLeft
                size={16}
                className="
                                    transition-transform
                                    group-hover:-translate-x-1
                                "
              />
              Kembali ke Berita
            </Link>

            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/40 sm:block">
              Informasi Desa
            </span>
          </div>

          {/* Breadcrumb */}

          <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-emerald-100/40">
            <Link href="/" className="transition hover:text-emerald-300">
              Beranda
            </Link>

            <ChevronRight size={13} />

            <Link href="/berita" className="transition hover:text-emerald-300">
              Berita
            </Link>

            <ChevronRight size={13} />

            <span className="max-w-[280px] truncate text-emerald-100/60">
              {berita.judul}
            </span>
          </div>

          {/* Article heading */}

          <div className="mt-10 max-w-5xl">
            {/* Category */}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {berita.kategori && (
                <span className="inline-flex items-center gap-2 border-l-4 border-emerald-400 pl-3 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                  <Newspaper size={14} />

                  {berita.kategori}
                </span>
              )}

              <span className="inline-flex items-center gap-2 text-sm text-emerald-100/50">
                <CalendarDays size={15} />

                {formatTanggal(berita.tanggal_terbit || berita.dibuat_pada)}
              </span>
            </div>

            {/* Title */}

            <h1
              className="
                            mt-6
                            max-w-5xl
                            text-4xl
                            font-black
                            leading-[1.08]
                            tracking-tight
                            text-white
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                        "
            >
              {berita.judul}
            </h1>

            {/* Summary */}

            {berita.ringkasan && (
              <p
                className="
                                mt-7
                                max-w-3xl
                                border-l
                                border-emerald-400/30
                                pl-5
                                text-base
                                leading-8
                                text-emerald-50/65
                                md:text-lg
                            "
              >
                {berita.ringkasan}
              </p>
            )}

            {/* Metadata */}

            <div
              className="
                            mt-8
                            flex
                            flex-wrap
                            items-center
                            gap-x-6
                            gap-y-3
                            text-xs
                            font-medium
                            uppercase
                            tracking-wider
                            text-emerald-100/40
                        "
            >
              <span className="flex items-center gap-2">
                <CalendarDays size={15} className="text-emerald-400" />
                Dipublikasikan{" "}
                {formatTanggal(berita.tanggal_terbit || berita.dibuat_pada)}
              </span>

              <span className="hidden h-1 w-1 bg-emerald-500/40 sm:block" />

              <span className="flex items-center gap-2">
                <Globe2 size={15} className="text-emerald-400" />
                Pemerintah Desa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                CONTENT
            ====================================================== */}

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* =================================================
                            MAIN ARTICLE
                        ================================================= */}

            <article className="min-w-0">
              {/* Featured image */}

              {berita.gambar_utama && (
                <figure className="overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={berita.gambar_utama}
                    alt={berita.judul}
                    className="
                                            aspect-[16/9]
                                            h-full
                                            w-full
                                            object-cover
                                            transition-transform
                                            duration-700
                                            hover:scale-[1.015]
                                        "
                  />
                </figure>
              )}

              {/* Image caption */}

              {berita.gambar_utama && (
                <div className="border-x border-b border-slate-200 bg-white px-5 py-3">
                  <p className="text-xs leading-5 text-slate-400">
                    Dokumentasi kegiatan — Pemerintah Desa
                  </p>
                </div>
              )}

              {/* Article */}

              <div
                className="
                                mt-8
                                border-y
                                border-slate-200
                                bg-white
                                px-5
                                py-8
                                sm:px-8
                                md:px-12
                                md:py-12
                            "
              >
                <DetailBerita berita={berita} />
              </div>
            </article>

            {/* =================================================
                            SIDEBAR
                        ================================================= */}

            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              {/* Navigation */}

              <div className="border-y border-slate-200 bg-white">
                <ShareBerita title={berita.judul} />
              </div>

              {/* Share */}

              <div className="border-y border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-emerald-50 text-emerald-600">
                      <Share2 size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Bagikan Informasi
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Sebarkan berita desa
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <p className="text-sm leading-6 text-slate-500">
                    Bagikan informasi ini kepada keluarga, tetangga, dan
                    masyarakat agar informasi desa dapat diketahui lebih luas.
                  </p>
                </div>
              </div>

              {/* Government */}

              <div className="bg-emerald-950 px-6 py-7 text-white">
                <div className="flex h-11 w-11 items-center justify-center bg-emerald-500/15 text-emerald-300">
                  <Building2 size={21} />
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                    Pemerintah Desa
                  </p>

                  <h3 className="mt-3 text-xl font-black">
                    Informasi Resmi Desa
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-emerald-100/55">
                    Sumber informasi resmi mengenai kegiatan, pembangunan,
                    pelayanan, dan perkembangan desa.
                  </p>

                  <Link
                    href="/"
                    className="
                                            group
                                            mt-6
                                            inline-flex
                                            items-center
                                            gap-2
                                            border-b
                                            border-emerald-400/40
                                            pb-1
                                            text-sm
                                            font-bold
                                            text-emerald-300
                                            transition
                                            hover:border-white
                                            hover:text-white
                                        "
                  >
                    Tentang Desa
                    <ArrowRight
                      size={15}
                      className="
                                                transition-transform
                                                group-hover:translate-x-1
                                            "
                    />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
                CTA
            ====================================================== */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div
            className="
                        relative
                        overflow-hidden
                        border
                        border-emerald-700
                        bg-emerald-700
                        px-6
                        py-10
                        md:px-10
                        md:py-12
                    "
          >
            {/* Decoration */}

            <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-80 w-80 bg-emerald-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  <Globe2 size={15} />
                  Informasi Desa
                </div>

                <h2
                  className="
                                    mt-3
                                    text-2xl
                                    font-black
                                    tracking-tight
                                    text-white
                                    md:text-4xl
                                "
                >
                  Ingin membaca berita lainnya?
                </h2>

                <p
                  className="
                                    mt-4
                                    max-w-xl
                                    text-sm
                                    leading-7
                                    text-emerald-50/75
                                    md:text-base
                                "
                >
                  Temukan berita, kegiatan, pengumuman, pembangunan, dan
                  informasi terbaru lainnya dari desa.
                </p>
              </div>

              <Link
                href="/berita"
                className="
                                    group
                                    inline-flex
                                    w-fit
                                    shrink-0
                                    items-center
                                    gap-3
                                    border
                                    border-white
                                    bg-white
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-emerald-700
                                    transition
                                    hover:bg-emerald-50
                                "
              >
                Lihat Semua Berita
                <ArrowRight
                  size={17}
                  className="
                                        transition-transform
                                        group-hover:translate-x-1
                                    "
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                FOOTER
            ====================================================== */}

      <Footer />
    </main>
  );
}

/* =========================================================
   HELPER
========================================================= */

function formatTanggal(tanggal: string | null | undefined) {
  if (!tanggal) {
    return "Tanpa tanggal";
  }

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "Tanpa tanggal";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
