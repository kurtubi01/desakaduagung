"use client";

import { useEffect, useRef, useState } from "react";
import { Apple, Drumstick, Factory, Sprout, LucideIcon, X } from "lucide-react";
import Image from "next/image";

interface PotensiItem {
  icon: LucideIcon;
  judul: string;
  deskripsi: string;
  keterangan: string;
  foto: string;
}

const data: PotensiItem[] = [
  {
    icon: Apple,
    judul: "Perkebunan Durian",
    deskripsi: "Durian berkualitas yang menjadi kebanggaan desa.",
    keterangan: "Perkebunan durian menjadi salah satu potensi pertanian Desa Kadu Agung. Hasil panennya dapat dikembangkan menjadi produk unggulan dan membantu meningkatkan pendapatan warga.",
    foto: "/pohondurian.jpeg",
  },
  {
    icon: Sprout,
    judul: "Emping",
    deskripsi: "Produk lokal unggulan dengan nilai ekonomi tinggi.",
    keterangan: "Melinjo merupakan hasil perkebunan yang dapat diolah menjadi emping dan berbagai produk pangan khas. Pengolahan ini membuka peluang usaha bagi masyarakat desa.",
    foto: "/emping.jpeg",
  },
  {
    icon: Drumstick,
    judul: "Peternakan Ayam",
    deskripsi: "Ternak berkualitas dengan sistem modern dan terawat.",
    keterangan: "Peternakan ayam mendukung ketersediaan pangan sekaligus menjadi sumber penghasilan bagi warga. Pengelolaan yang baik membantu menjaga kualitas ternak dan hasil produksinya.",
    foto: "/desa.jpeg",
  },
  {
    icon: Factory,
    judul: "Pabrik Tahu",
    deskripsi: "Sentra produksi tahu lokal yang mendukung usaha dan lapangan kerja warga.",
    keterangan: "Pabrik tahu mengolah kedelai menjadi produk pangan yang dibutuhkan masyarakat setiap hari. Kegiatan ini menggerakkan ekonomi lokal dan memberikan peluang kerja bagi warga sekitar.",
    foto: "/pabrik tahu.jpeg",
  },
];

interface PotensiCardProps {
  item: PotensiItem;
  index: number;
  onMore: (item: PotensiItem) => void;
}

function PotensiCard({ item, index, onMore }: PotensiCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
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
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`potensi-card bg-white rounded-xl shadow hover:shadow-lg transition-all duration-700 ease-out overflow-hidden ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={item.foto}
          alt={item.judul}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="potensi-card__icon absolute -bottom-5 left-5 w-10 h-10 rounded-full bg-green-100 border-4 border-white flex items-center justify-center text-lg">
          <item.icon size={20} />
        </div>
      </div>

      <div className="p-6 pt-8">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{item.judul}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.deskripsi}</p>
        <button type="button" onClick={() => onMore(item)} className="potensi-card__link text-green-700 text-sm font-semibold hover:underline">
          Selengkapnya →
        </button>
      </div>
    </div>
  );
}

export default function Potensi() {
  const [selectedItem, setSelectedItem] = useState<PotensiItem | null>(null);

  useEffect(() => {
    if (!selectedItem) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItem(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedItem]);

  return (
    <section id="potensi" className="py-20 md:py-28 px-5 md:px-8 bg-[#eaf5ec]">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-[#198754] font-medium italic text-xl mb-2">
          Potensi Unggulan 🌿
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-[#073b27]">
          Keunggulan Desa Kami
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Desa Kadu Agung memiliki berbagai potensi yang menjadi kekuatan utama dalam mewujudkan desa yang maju dan sejahtera.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((item, i) => (
            <PotensiCard key={item.judul} item={item} index={i} onMore={setSelectedItem} />
          ))}
        </div>
      </div>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#073b27]/60 px-5 py-8"
          role="presentation"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="potensi-dialog relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="potensi-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-green-50 hover:text-[#0f5132]"
              aria-label="Tutup keterangan"
            >
              <X size={20} />
            </button>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#0f5132]">
              <selectedItem.icon size={24} />
            </div>
            <h3 id="potensi-detail-title" className="mb-3 pr-10 text-2xl font-bold text-[#073b27]">
              {selectedItem.judul}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">{selectedItem.keterangan}</p>
            <div className="relative h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={selectedItem.foto}
                alt={`Foto ${selectedItem.judul}`}
                fill
                sizes="(max-width: 768px) 100vw, 32rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}