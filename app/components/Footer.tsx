import { Camera, Video, MessageSquare } from "lucide-react";

const socials = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: MessageSquare, label: "Twitter / X", href: "#" },
];

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Shop", href: "#shop" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#00AAFF]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                <rect width="32" height="32" fill="#000" />
                <line x1="4" y1="4" x2="28" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
                <line x1="28" y1="4" x2="4" y2="28" stroke="#00AAFF" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="font-['Orbitron'] font-900 text-sm tracking-widest text-white">
                STAGE<span className="text-[#00AAFF]">X</span> GARAGE
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/35 leading-relaxed max-w-xs">
              Custom builds, tuning and service for German and Japanese performance cars. Built with passion.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-['Orbitron'] text-[10px] font-700 text-[#00AAFF]/60 tracking-[0.3em] uppercase mb-4">
              Navigation
            </p>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {footerLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/45 hover:text-[#00AAFF] transition-colors cursor-pointer w-fit"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="font-['Orbitron'] text-[10px] font-700 text-[#00AAFF]/60 tracking-[0.3em] uppercase mb-4">
              Follow Us
            </p>
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 flex items-center justify-center border border-[#00AAFF]/15 bg-[#00AAFF]/05 text-[#d4d8e8]/40 hover:text-[#00AAFF] hover:border-[#00AAFF]/40 hover:bg-[#00AAFF]/10 transition-all duration-200 rounded-sm cursor-pointer"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#00AAFF]/08 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/25">
            © {new Date().getFullYear()} Stage X Garage. All rights reserved.
          </p>
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/20">
            Service &amp; Tuning — Built to Dominate
          </p>
        </div>
      </div>
    </footer>
  );
}
