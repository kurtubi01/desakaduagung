import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profil from "@/components/Profil";
import Potensi from "@/components/Potensi";
import Gallery from "@/components/Gallery";
import Kontak from "@/components/Kontak";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Profil />
      <Potensi />
      <Gallery />
      <Kontak />
      <Footer />
    </main>
  );
}