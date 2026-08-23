"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Slide {
    id: string;
    image_url: string;
    tagline: string | null;
    title: string;
    description: string | null;
    sort_order: number;
}

interface HeroSliderProps {
    slides: Slide[];
}

export default function HeroSlider({
    slides,
}: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;

        setCurrentSlide((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    }, [slides.length]);

    const prevSlide = () => {
        if (slides.length === 0) return;

        setCurrentSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    /*
     * Jika belum ada data dari database
     */
    if (slides.length === 0) {
        return (
            <section
                id="beranda"
                className="relative w-full bg-[#073b27] overflow-hidden pt-16 md:pt-20"
            >
                <div className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[760px] flex items-center">

                    <div className="relative z-20 max-w-7xl mx-auto px-5 md:px-8 w-full">
                        <div className="max-w-2xl text-white">

                            <p className="text-[#20c997] text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest mb-3">
                                Desa Kadu Agung
                            </p>

                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] drop-shadow-md">
                                Selamat Datang
                            </h1>

                            <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-200 max-w-lg leading-relaxed">
                                Selamat datang di website resmi Desa Kadu Agung.
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <a
                                    href="#profil"
                                    className="inline-flex items-center gap-3 bg-[#20c997] text-[#073b27] px-6 py-4 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all duration-200 active:translate-y-0.5"
                                >
                                    Jelajahi Desa
                                    <ArrowRight size={18} />
                                </a>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        );
    }

    /*
     * Pastikan currentSlide tidak keluar
     * dari jumlah slide ketika data berubah.
     */
    const safeCurrentSlide =
        currentSlide >= slides.length
            ? 0
            : currentSlide;

    const current = slides[safeCurrentSlide];

    return (
        <section
            id="beranda"
            className="relative w-full bg-[#073b27] overflow-hidden pt-16 md:pt-20"
        >
            <div className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[760px] flex items-center">

                {/* Background Images Slider */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === safeCurrentSlide
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out"
                            style={{
                                backgroundImage: `url('${slide.image_url}')`,
                            }}
                        />

                        {/* Overlay Gradient Tajam */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#073b27]/95 via-[#073b27]/70 to-transparent" />

                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="relative z-20 max-w-7xl mx-auto px-5 md:px-8 w-full">
                    <div className="max-w-2xl text-white">

                        {/* Tagline / Subtitle */}
                        {current.tagline && (
                            <p
                                key={`tag-${current.id}`}
                                className="text-[#20c997] text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest mb-3 animate-fade-in"
                            >
                                {current.tagline}
                            </p>
                        )}

                        {/* Title / Heading */}
                        <h1
                            key={`title-${current.id}`}
                            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] drop-shadow-md whitespace-pre-line animate-slide-up"
                        >
                            {current.title}
                        </h1>

                        {/* Description */}
                        {current.description && (
                            <p
                                key={`desc-${current.id}`}
                                className="mt-5 text-sm sm:text-base md:text-lg text-gray-200 max-w-lg leading-relaxed animate-fade-in"
                            >
                                {current.description}
                            </p>
                        )}

                        {/* CTA Button */}
                        <div className="mt-8 flex items-center gap-4">
                            <a
                                href="#profil"
                                className="inline-flex items-center gap-3 bg-[#20c997] text-[#073b27] px-6 py-4 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all duration-200 active:translate-y-0.5"
                            >
                                Jelajahi Desa
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Controls - Panah Kiri & Kanan */}
                {slides.length > 1 && (
                    <div className="absolute right-4 md:right-8 bottom-8 z-30 flex items-center gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 bg-[#073b27]/80 border border-white/20 text-white flex items-center justify-center hover:bg-[#20c997] hover:text-[#073b27] hover:border-[#20c997] transition-all"
                            aria-label="Slide sebelumnya"
                        >
                            <ChevronLeft size={22} />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 bg-[#073b27]/80 border border-white/20 text-white flex items-center justify-center hover:bg-[#20c997] hover:text-[#073b27] hover:border-[#20c997] transition-all"
                            aria-label="Slide selanjutnya"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                )}

                {/* Slide Indicators */}
                {slides.length > 1 && (
                    <div className="absolute left-5 md:left-8 bottom-8 z-30 flex items-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() =>
                                    setCurrentSlide(index)
                                }
                                className={`h-1.5 transition-all duration-300 ${
                                    index === safeCurrentSlide
                                        ? "w-10 bg-[#20c997]"
                                        : "w-4 bg-white/40 hover:bg-white/70"
                                }`}
                                aria-label={`Buka slide ${
                                    index + 1
                                }`}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}