import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="beranda" className="relative">
      <div className="hero-stage relative min-h-[560px] sm:min-h-[620px] md:min-h-[740px] flex items-center pt-20 pb-20 md:pt-24 md:pb-32">
        <div className="hero-stage__image absolute inset-0 bg-[url('/desa.jpeg')] bg-cover bg-center" />
        <div className="hero-stage__overlay absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full">
          <div className="text-white max-w-2xl">
            <p className="hero-copy hero-copy--1 text-[#f3d67a] text-lg md:text-2xl font-medium mb-3">
              Selamat Datang di
            </p>
            <h1 className="hero-copy hero-copy--2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.98] tracking-tight drop-shadow-lg">
              Desa<br />Kadu Agung
            </h1>
            <p className="hero-copy hero-copy--3 mt-6 text-base md:text-lg text-gray-100 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Desa yang asri, mandiri, dan berbudaya menuju masyarakat yang sejahtera.
            </p>
            <div className="hero-copy hero-copy--4 mt-8 flex">
              <a href="#profil" className="hero-button bg-[#0f5132] hover:bg-[#073b27] transition text-white px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-3 shadow-lg">
                Jelajahi Desa <ArrowRight size={19} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}