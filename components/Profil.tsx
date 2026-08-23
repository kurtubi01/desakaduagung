"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Landmark } from "lucide-react";

export default function Profil() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="profil"
      ref={ref}
      className="w-full bg-slate-50 py-20 md:py-28 border-b border-neutral-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Kolom Teks (Left) */}
          <div
            className={`md:col-span-7 transition-all duration-700 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Tagline dengan aksen garis datar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#20c997]" />
              <p className="text-[#073b27] font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
                Profil & Integritas Desa
              </p>
            </div>

            {/* Judul Utamanya (Flat Typography) */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#073b27] leading-none mb-8">
              Desa Kadu Agung
            </h2>

            {/* Konten Deskripsi */}
            <div className="space-y-4 text-gray-700 font-light text-base md:text-lg leading-relaxed border-l-2 border-[#073b27]/20 pl-5">
              <p>
                Desa Kadu Agung merupakan salah satu wilayah strategis di Kecamatan Gunung Sari, 
                Kabupaten Serang, Provinsi Banten. Desa ini berdiri di atas fondasi potensi pertanian 
                yang kuat dan kearifan lokal yang terjaga secara turun-temurun.
              </p>
              <p>
                Melalui semangat gotong royong dan pemanfaatan sumber daya alam yang bijak, 
                pemerintah desa bersama masyarakat berkomitmen mewujudkan tata kelola desa 
                yang mandiri, sejahtera, dan berkelanjutan.
              </p>
            </div>

            {/* Statistik Ringkas / Highlight Data (Flat Grid) */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-200">
              <div className="bg-white p-4 border border-neutral-200 rounded-none">
                <span className="block text-2xl md:text-3xl font-black text-[#073b27]">
                  Gunung Sari
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kecamatan
                </span>
              </div>
              <div className="bg-white p-4 border border-neutral-200 rounded-none">
                <span className="block text-2xl md:text-3xl font-black text-[#073b27]">
                  Kab. Serang
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kabupaten
                </span>
              </div>
            </div>

            {/* CTA Button Sharp Flat */}
            <div className="mt-8">
              <a
                href="#kontak"
                className="inline-flex items-center gap-3 bg-[#073b27] text-white px-7 py-4 font-bold text-xs uppercase tracking-wider hover:bg-[#20c997] hover:text-[#073b27] transition-colors duration-200 rounded-none border border-[#073b27]"
              >
                Hubungi Kami
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Kolom Gambar (Right) */}
          <div
            style={{ transitionDelay: "150ms" }}
            className={`md:col-span-5 transition-all duration-700 ease-out ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative border-2 border-[#073b27] p-2 bg-white rounded-none">
              
              {/* Badge Ikon Lembaga di Pojok Gambar */}
              <div className="absolute -top-4 -left-4 z-20 bg-[#073b27] text-white p-3 rounded-none border border-white">
                <Landmark size={24} className="text-[#20c997]" />
              </div>

              {/* Main Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src="/kantor_desa.jpeg"
                  alt="Kantor Desa Kadu Agung"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-none filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Text Caption Dibawah Gambar */}
              <div className="p-3 bg-[#073b27] text-white mt-2 flex items-center justify-between rounded-none">
                <span className="text-xs font-mono uppercase tracking-wider">
                  Kantor Pemerintahan Desa
                </span>
                <span className="text-[10px] text-[#20c997] font-mono">
                  SERANG, BANTEN
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}