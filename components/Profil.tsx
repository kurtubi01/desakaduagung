"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    <section id="profil" ref={ref} className={`section-reveal py-20 md:py-28 px-5 md:px-8 max-w-6xl mx-auto overflow-hidden ${visible ? "section-reveal--visible" : ""}`}>
      <p className="text-[#198754] font-medium italic text-xl mb-2">Mengenal Desa 🌿</p>
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#073b27]">Desa Kadu Agung</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Desa Kadu Agung merupakan salah satu desa yang berada di wilayah
            Kecamatan Gunung Sari, Kabupaten Serang, Provinsi Banten. Desa ini
            dikenal dengan potensi pertanian dan kearifan lokal masyarakatnya
            yang terus dijaga hingga sekarang.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Dengan semangat gotong royong dan kekayaan alam yang melimpah,
            masyarakat Desa Kadu Agung terus berupaya membangun desa yang
            mandiri, sejahtera, dan berkelanjutan bagi generasi mendatang.
          </p>

          <a href="#kontak" className="inline-flex items-center gap-2 text-[#198754] font-semibold">Lebih Lanjut <span className="text-xl">→</span></a>
        </div>
        <div
          style={{ transitionDelay: "150ms" }}
          className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <Image src="/kantor_desa.jpeg" alt="Pemandangan Desa Kadu Agung" width={1200} height={900} className="rounded-3xl shadow-lg w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>
  );
}