"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Helper untuk menentukan target URL (anchor atau route)
  const getHref = (hash: string) => (isHomePage ? hash : `/${hash}`);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Desa */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center  text-white overflow-hidden">
                <Image
                  src="/images/Logo_kabupaten_serang.png"
                  alt="Logo Pemerintahan Kota Serang"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-black text-white">Pemerintah Desa</p>
                <p className="text-xs text-slate-500">
                  Informasi & Pelayanan Desa
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Website resmi desa Kadu Agung sebagai media informasi, komunikasi,
              transparansi, dan pelayanan masyarakat.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="font-bold text-white">Navigasi</h3>
            <div className="mt-5 space-y-3 text-sm">
              <Link
                href="/"
                className="block transition hover:text-emerald-400"
              >
                Beranda
              </Link>
              <Link
                href="/berita"
                className={`block transition hover:text-emerald-400 ${
                  pathname === "/berita" ? "text-emerald-400 font-medium" : ""
                }`}
              >
                Berita Desa
              </Link>
              <Link
                href={getHref("#profil")}
                className="block transition hover:text-emerald-400"
              >
                Profil Desa
              </Link>
              <Link
                href={getHref("#potensi")}
                className="block transition hover:text-emerald-400"
              >
                Potensi Desa
              </Link>
            </div>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="font-bold text-white">Informasi</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <span className="leading-6 text-slate-400">
                  Kantor Desa Kadu Agung
                  <br />
                  Jl. Raya Desa No. 123
                </span>
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="shrink-0 text-emerald-500" />
                <span className="text-slate-400">(021) 1234-5678</span>
              </div>
              <div className="flex gap-3">
                <Mail size={18} className="shrink-0 text-emerald-500" />
                <span className="text-slate-400">kontak@kaduagung.desa.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Pemerintah Desa Kadu Agung. Semua hak
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
