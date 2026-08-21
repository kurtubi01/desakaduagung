"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import Image from "next/image";

interface PhotoItem {
  src: string;
  alt: string;
  size: string;
}

const photos: PhotoItem[] = [
  { src: "/desa.jpeg", alt: "Pemandangan Desa Kadu Agung", size: "md:col-span-2 md:row-span-2" },
  { src: "/kantor_desa.jpeg", alt: "Kantor Desa Kadu Agung", size: "" },
  { src: "/emping.jpeg", alt: "Emping melinjo khas Desa Kadu Agung", size: "" },
  { src: "/pabrik tahu.jpeg", alt: "Pabrik tahu Desa Kadu Agung", size: "md:col-span-2" },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };

    document.body.classList.add("modal-is-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-is-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPhoto]);

  return (
    <section id="galeri" ref={sectionRef} className={`section-reveal py-20 md:py-28 px-5 md:px-8 max-w-6xl mx-auto ${visible ? "section-reveal--visible" : ""}`}>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[#198754] font-medium italic text-xl mb-2">Galeri Desa</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#073b27]">Cerita dalam Foto</h2>
        </div>
        <ArrowUpRight className="text-[#198754] shrink-0" size={28} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:h-[430px]">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.alt}
            onClick={() => setSelectedPhoto(photo)}
            className={`gallery-tile group relative overflow-hidden rounded-3xl min-h-40 text-left ${photo.size}`}
            aria-label={`Buka foto: ${photo.alt}`}
            style={{ "--tile-index": index } as CSSProperties}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <span className="gallery-tile__overlay absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/55 via-transparent to-transparent p-4 text-white">
              <span className="max-w-[80%] text-xs font-medium leading-snug">{photo.alt}</span>
              <Maximize2 size={18} className="gallery-tile__icon" />
            </span>
          </button>
        ))}
      </div>

      {selectedPhoto ? (
        <div className="gallery-lightbox fixed inset-0 z-[70] flex items-center justify-center bg-[#031d13]/90 px-5 py-8" onClick={() => setSelectedPhoto(null)}>
          <div className="relative h-full w-full max-w-5xl" role="dialog" aria-modal="true" aria-label={selectedPhoto.alt} onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedPhoto(null)} className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95" aria-label="Tutup galeri">
              <X size={22} />
            </button>
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image src={selectedPhoto.src} alt={selectedPhoto.alt} fill sizes="100vw" className="object-contain" priority />
            </div>
            <p className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12 text-sm text-white">{selectedPhoto.alt}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}