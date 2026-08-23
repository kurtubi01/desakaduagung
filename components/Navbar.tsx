"use client";

import { useEffect, useState, CSSProperties } from "react";
import { Images, HomeIcon, Newspaper,  Mail, Map, Menu, Sprout, X, LucideIcon, Building2 } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: "Beranda", href: "#beranda", icon: HomeIcon },
  { label: "Profil Desa", href: "#profil", icon: Building2 },
  { label: "Potensi Desa", href: "#potensi", icon: Sprout },
  { label: "Berita", href: "#berita", icon:  Newspaper},
  { label: "Galeri", href: "#galeri", icon: Images },
  { label: "Kontak", href: "#kontak", icon: Mail },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 18);
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const sections = menuItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#073b27]/95 backdrop-blur-md border-[#0f5132] shadow-lg"
          : "bg-[#073b27] border-white/10"
      }`}
    >
      {/* Scroll Progress Bar (Sharp Sharp Corner) */}
      <div
        className="h-1 bg-[#20c997] transition-all duration-150 ease-out origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Brand Section */}
        <a href="#beranda" className="flex items-center gap-3 group">
          
          <div className="leading-tight">
            <p className="font-bold text-white text-sm md:text-base tracking-wider uppercase">
              Desa Kadu Agung
            </p>
            <p className="text-[10px] md:text-[11px] text-emerald-200/70 tracking-widest uppercase">
              Kec. Gunungsari, Kab. Serang
            </p>
          </div>
        </a>

        {/* Desktop Menu Items */}
        <ul className="hidden lg:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold">
          {menuItems.map((item) => {
            const sectionId = item.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`px-4 py-2 border-b-2 transition-all duration-200 block ${
                    isActive
                      ? "border-[#20c997] text-[#20c997] bg-white/5"
                      : "border-transparent text-gray-200 hover:text-white hover:bg-white/5 hover:border-gray-400"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#kontak"
            className="flex items-center gap-2 bg-[#20c997] text-[#073b27] text-xs font-bold uppercase tracking-wider px-4 py-2.5 hover:bg-white transition-all duration-200 active:translate-y-0.5"
            aria-label="Buka peta Desa Kadu Agung"
            title="Peta Desa"
          >
            <Map size={16} />
            <span className="hidden sm:inline">Peta Desa</span>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-[#0f5132] border border-[#20c997]/30 text-white transition hover:bg-[#20c997] hover:text-[#073b27] active:scale-95"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[68px] bg-black/60 backdrop-blur-sm lg:hidden z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Slide Panel */}
      <div
        className={`lg:hidden fixed top-[68px] left-0 right-0 bg-[#073b27] border-b border-[#0f5132] transition-all duration-300 ease-in-out z-50 overflow-hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-4 text-sm font-semibold tracking-wide uppercase divide-y divide-white/5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            return (
              <li
                key={item.label}
                style={{ "--menu-index": index } as CSSProperties}
              >
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 transition-all ${
                    isActive
                      ? "bg-[#0f5132] text-[#20c997] border-l-4 border-[#20c997]"
                      : "text-gray-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[#20c997]" : "text-gray-400"} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Fixed Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#073b27] border-t border-[#0f5132] z-40 flex items-center justify-around h-16 px-2">
        {(
          [
            ["Beranda", "#beranda", HomeIcon],
            ["Potensi", "#potensi", Sprout],
            ["Galeri", "#galeri", Images],
            ["Kontak", "#kontak", Mail],
          ] as const
        ).map(([label, href, Icon]) => {
          const isActive = activeSection === href.slice(1);
          return (
            <a
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all border-t-2 ${
                isActive
                  ? "border-[#20c997] text-[#20c997] bg-white/5"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold tracking-wider uppercase">{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}