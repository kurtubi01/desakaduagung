"use client";

import { useEffect, useState, CSSProperties } from "react";
import { Images, Leaf, Mail, Map, Menu, Sprout, X, LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: "Beranda", href: "#beranda", icon: Leaf },
  { label: "Profil Desa", href: "#profil", icon: Leaf },
  { label: "Potensi Desa", href: "#potensi", icon: Sprout },
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
    <nav className={`site-navbar ${scrolled ? "site-navbar--scrolled" : ""}`}>
      <div className="site-navbar__progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-[5.5rem]">
        <div className="flex items-center gap-3">
          <div className="brand-mark w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#0f5132] flex items-center justify-center text-white shadow-sm">
            <Leaf size={23} />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-[#073b27] text-sm md:text-base">Desa Kadu Agung</p>
            <p className="text-[9px] md:text-[10px] text-gray-500 tracking-wide">Kec. Gunungsari, Kab. Serang</p>
          </div>
        </div>

        <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
          {menuItems.map((item) => {
            const sectionId = item.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.label}>
                <a href={item.href} className={`nav-link ${isActive ? "nav-link--active" : ""}`}>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#kontak"
          className="nav-map-button flex items-center gap-2 bg-[#0f5132] text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-full hover:bg-[#073b27] transition"
          aria-label="Buka peta Desa Kadu Agung"
          title="Peta Desa"
        >
          <Map size={16} /> <span className="hidden sm:inline">Peta Desa</span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-[#0f5132] text-white transition hover:bg-[#073b27] active:scale-95"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`mobile-menu-backdrop lg:hidden ${menuOpen ? "mobile-menu-backdrop--open" : ""}`} onClick={closeMenu} />
      <div className={`mobile-menu-panel lg:hidden ${menuOpen ? "mobile-menu-panel--open" : ""}`}>
        <ul className="flex flex-col gap-1 px-4 py-3 text-sm font-medium text-gray-700">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            return (
              <li key={item.label} className="mobile-menu-panel__item" style={{ "--menu-index": index } as CSSProperties}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className={`mobile-menu-link ${isActive ? "mobile-menu-link--active" : ""}`}
                >
                  <Icon size={18} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mobile-bottom-nav lg:hidden">
        {(
          [
            ["Beranda", "#beranda", Leaf],
            ["Potensi", "#potensi", Sprout],
            ["Galeri", "#galeri", Images],
            ["Kontak", "#kontak", Mail],
          ] as const
        ).map(([label, href, Icon]) => {
          const isActive = activeSection === href.slice(1);
          return (
            <a key={label} href={href} className={`mobile-bottom-nav__item ${isActive ? "mobile-bottom-nav__item--active" : ""}`}>
              <span className="mobile-bottom-nav__icon"><Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} /></span>
              <span>{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}