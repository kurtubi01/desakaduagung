export default function Footer() {
  return (
    <footer id="footer" className="bg-[#073b27] text-white py-10 px-5 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Desa Kadu Agung</h4>
          <p className="text-green-100">
            Kecamatan Gunung Sari, Kabupaten Serang, Provinsi Banten
          </p>
        </div>
        <div>
          <p className="text-green-100">© {new Date().getFullYear()} Pemerintah Desa Kadu Agung</p>
        </div>
      </div>
    </footer>
  );
}