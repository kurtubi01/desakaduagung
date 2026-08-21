export default function Kontak() {
  return (
    <section id="kontak" className="py-20 md:py-28 px-5 md:px-8 max-w-6xl mx-auto">
      <p className="text-[#198754] font-medium italic text-xl text-center mb-2">Temukan Kami</p>
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10 text-[#073b27]">Kontak & Lokasi</h2>
      <div className="w-full h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps?q=-6.136497,106.02222&z=15&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Peta Lokasi Desa Kadu Agung"
        />
      </div>
    </section>
  );
}