"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#shop", label: "Shop" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#050608]/90 backdrop-blur-md border-b border-[#00AAFF]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group" aria-label="Stage X Garage home">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-[#00AAFF] opacity-20 rounded blur-sm group-hover:opacity-40 transition-opacity" />
            <svg viewBox="0 0 32 32" fill="none" className="relative w-8 h-8">
              <rect width="32" height="32" fill="#000" />
              <line x1="4" y1="4" x2="28" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
              <line x1="28" y1="4" x2="4" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-['Orbitron'] font-900 text-sm tracking-widest text-white">
            STAGE<span className="text-[#00AAFF]">X</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-['Orbitron'] text-xs font-700 tracking-widest text-[#d4d8e8]/70 hover:text-[#00AAFF] transition-colors duration-200 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:block btn-neon px-5 py-2 text-xs rounded-sm"
        >
          Book Now
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#d4d8e8] hover:text-[#00AAFF] transition-colors cursor-pointer p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#050608]/95 backdrop-blur-md border-b border-[#00AAFF]/10">
          <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile navigation">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-['Orbitron'] text-xs font-700 tracking-widest text-[#d4d8e8]/70 hover:text-[#00AAFF] transition-colors py-2 border-b border-[#1a1f28] cursor-pointer"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-neon px-5 py-3 text-xs rounded-sm text-center mt-2"
            >
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
