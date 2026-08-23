'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { ArrowUpRight, MapPin, Sparkles, X } from 'lucide-react';

interface PotensiDesa {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at?: string;
}

// Skeleton flat
function FlatSkeleton() {
  return (
    <div className="bg-white flex flex-col animate-pulse min-w-75 md:min-w-0">
      <div className="h-52 w-full bg-zinc-200" />

      <div className="p-5 space-y-4">
        <div className="h-6 bg-zinc-200 w-3/4" />

        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 w-full" />
          <div className="h-4 bg-zinc-200 w-5/6" />
          <div className="h-4 bg-zinc-200 w-4/6" />
        </div>

        <div className="pt-4 flex justify-between items-center">
          <div className="h-4 bg-zinc-200 w-24" />
          <div className="h-8 bg-zinc-200 w-24" />
        </div>
      </div>
    </div>
  );
}

export default function PotensiDesaSection() {
  const supabase = createClient();

  const [items, setItems] = useState<PotensiDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PotensiDesa | null>(null);

  const fetchPublishedPotensi = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('potensi_desa')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPublishedPotensi();
  }, [fetchPublishedPotensi]);

  return (
    <section className="bg-zinc-100 py-16 md:py-20 px-5 md:px-10 font-mono text-zinc-900" id="potensi">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-10 md:mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-600 mb-4">
            <MapPin className="w-4 h-4" />
            Desa Kaduagung
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
                Potensi Desa
              </h2>

              <div className="w-16 h-1 bg-emerald-600 mt-4" />
            </div>

            <p className="font-sans text-sm md:text-base text-zinc-600 max-w-xl leading-relaxed">
              Eksplorasi kekayaan hasil alam, komoditas unggulan
              pertanian, dan potensi ekonomi lokal yang dikembangkan
              langsung oleh warga Desa Kaduagung.
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <div
            className="
              flex overflow-x-auto gap-5 pb-4
              md:grid md:grid-cols-2 lg:grid-cols-3
              md:overflow-visible
              scrollbar-hide
            "
          >
            <FlatSkeleton />
            <FlatSkeleton />
            <FlatSkeleton />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-zinc-300" />

            <p className="font-bold uppercase text-zinc-500 text-sm">
              Belum ada data potensi desa yang dipublikasikan.
            </p>
          </div>
        ) : (
          <div
            className="
              flex overflow-x-auto gap-5 pb-5
              md:grid md:grid-cols-2 lg:grid-cols-3
              md:overflow-visible
              scrollbar-hide
              snap-x snap-mandatory
            "
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="
                  bg-white
                  flex flex-col
                  min-w-[82%]
                  sm:min-w-[60%]
                  md:min-w-0
                  snap-start
                  group
                "
              >
                {/* IMAGE */}
                <div className="h-52 md:h-56 w-full bg-zinc-200 relative overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 82vw, (max-width: 1200px) 50vw, 33vw"
                      className="
                        object-cover
                        group-hover:scale-105
                        transition-transform duration-500
                      "
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold uppercase text-xs">
                      No Image Available
                    </div>
                  )}

                  {/* LABEL */}
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold uppercase px-3 py-1 z-10">
                    Unggulan
                  </span>
                </div>

                {/* BODY */}
                <div className="p-5 md:p-6 flex flex-col flex-1">

                  <h3 className="text-lg md:text-xl font-black uppercase text-zinc-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-sans text-sm text-zinc-600 leading-relaxed line-clamp-3 mb-6">
                    {item.description}
                  </p>

                  {/* ACTION */}
                  <div className="mt-auto">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="
                        w-full
                        bg-zinc-900
                        hover:bg-emerald-600
                        text-white
                        font-bold
                        uppercase
                        text-xs
                        py-3
                        px-4
                        flex
                        items-center
                        justify-between
                        transition-colors
                      "
                    >
                      <span>Lihat Selengkapnya</span>

                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ================= MOBILE SCROLL INDICATOR ================= */}
        {!loading && items.length > 1 && (
          <div className="flex md:hidden justify-center items-center gap-2 mt-4">
            <div className="w-8 h-1 bg-emerald-600" />
            <div className="w-2 h-1 bg-zinc-300" />
            <div className="w-2 h-1 bg-zinc-300" />
          </div>
        )}

        {/* ================= MODAL ================= */}
        {selectedItem && (
          <div
            className="
              fixed inset-0
              bg-zinc-900/70
              flex items-center justify-center
              p-4
              z-50
            "
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="
                bg-white
                max-w-2xl
                w-full
                relative
                overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}
              <div className="bg-zinc-900 text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                    Potensi Desa
                  </span>

                  <h3 className="text-sm font-black uppercase mt-1">
                    Detail Potensi
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="
                    text-white
                    hover:text-emerald-400
                    transition-colors
                  "
                  aria-label="Tutup"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="max-h-[75vh] overflow-y-auto">

                {selectedItem.image_url && (
                  <div className="h-56 md:h-72 w-full bg-zinc-100 relative overflow-hidden">
                    <Image
                      src={selectedItem.image_url}
                      alt={selectedItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6 md:p-8">

                  <h4 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 leading-tight mb-4">
                    {selectedItem.title}
                  </h4>

                  <div className="w-12 h-1 bg-emerald-600 mb-5" />

                  <p className="font-sans text-sm md:text-base text-zinc-700 leading-relaxed whitespace-pre-line">
                    {selectedItem.description}
                  </p>

                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="bg-zinc-100 px-5 py-4 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="
                    bg-zinc-900
                    hover:bg-emerald-600
                    text-white
                    px-6
                    py-2.5
                    text-xs
                    font-bold
                    uppercase
                    transition-colors
                  "
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}