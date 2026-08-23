import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profil from "@/components/Profil";
import Gallery from "@/components/Gallery";
import Kontak from "@/components/Kontak";
import Footer from "@/components/Footer";
import SectionBerita from "@/components/BeritaSection";
import PotensiDesaSection from "@/components/PotensiDesaSection";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <ScrollReveal
        y={0}
        duration={0.8}
      >
        <Hero />
      </ScrollReveal>

      {/* Profil */}
      <ScrollReveal>
        <Profil />
      </ScrollReveal>

      {/* Potensi Desa */}
      <ScrollReveal delay={0.05}>
        <PotensiDesaSection />
      </ScrollReveal>

      {/* Berita */}
      <ScrollReveal delay={0.05}>
        <SectionBerita />
      </ScrollReveal>

      {/* Gallery */}
      <ScrollReveal delay={0.05}>
        <Gallery />
      </ScrollReveal>

      {/* Kontak */}
      <ScrollReveal delay={0.05}>
        <Kontak />
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal
        y={30}
        duration={0.6}
      >
        <Footer />
      </ScrollReveal>
    </main>
  );
}