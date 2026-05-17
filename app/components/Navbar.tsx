"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.shop"), href: "#shop" },
    { label: t("nav.booking"), href: "#booking" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const toggleLocale = () => setLocale(locale === "el" ? "en" : "el");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? "py-4 bg-[#0d0f12]/90 backdrop-blur-md border-b border-[#00AAFF]/10" : "py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center flex-shrink-0">
          <span className="font-['Orbitron'] font-black text-[15px] tracking-[0.18em] text-white whitespace-nowrap" style={{ fontWeight: 900 }}>
            STAGE<span className="text-[#00AAFF]" style={{ textShadow: "0 0 14px #00AAFF, 0 0 28px #00AAFF60" }}>X</span>{" "}
            <span style={{ letterSpacing: "0.22em" }}>GARAGE</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-['JetBrains_Mono'] text-[13px] font-medium text-[#d4d8e8]/80 hover:text-[#00AAFF] transition-colors duration-200 tracking-wide">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleLocale}
            className="font-['JetBrains_Mono'] text-[11px] tracking-widest border border-[#00AAFF]/20 rounded-sm px-3 py-1.5 transition-all duration-200 hover:border-[#00AAFF]/50"
            aria-label="Toggle language"
          >
            <span className={locale === "el" ? "text-[#00AAFF]" : "text-[#d4d8e8]/35"}>EL</span>
            <span className="text-[#d4d8e8]/25 mx-1.5">|</span>
            <span className={locale === "en" ? "text-[#00AAFF]" : "text-[#d4d8e8]/35"}>EN</span>
          </button>
          <a href="#booking" className="btn-neon-filled h-9 px-5 text-xs rounded-sm flex items-center">
            {t("nav.booking")}
          </a>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleLocale}
            className="font-['JetBrains_Mono'] text-[11px] tracking-widest border border-[#00AAFF]/20 rounded-sm px-2.5 py-1"
          >
            <span className={locale === "el" ? "text-[#00AAFF]" : "text-[#d4d8e8]/35"}>EL</span>
            <span className="text-[#d4d8e8]/25 mx-1">|</span>
            <span className={locale === "en" ? "text-[#00AAFF]" : "text-[#d4d8e8]/35"}>EN</span>
          </button>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" className="text-[#d4d8e8]/70 hover:text-white transition-colors">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#00AAFF]/10 bg-[#0d0f12]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/65 hover:text-[#00AAFF] transition-colors py-2.5 border-b border-[#00AAFF]/06 last:border-0"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
