"use client";
import { Camera, Video, MessageSquare } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const socials = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: MessageSquare, label: "Twitter / X", href: "#" },
];

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.shop"), href: "#shop" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-[#00AAFF]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <span className="font-['Orbitron'] font-900 text-sm tracking-widest text-white">
                STAGE<span className="text-[#00AAFF]">X</span> GARAGE
              </span>
            </div>
            <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/35 leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-['Orbitron'] text-[10px] font-700 text-[#00AAFF]/60 tracking-[0.3em] uppercase mb-4">
              {t("footer.nav")}
            </p>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {footerLinks.map((l) => (
                <a
                  key={l.href}
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
              {t("footer.social")}
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

        <div className="border-t border-[#00AAFF]/08 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/25">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>
          <p className="font-['JetBrains_Mono'] text-[11px] text-[#d4d8e8]/20">
            {t("footer.built")}
          </p>
        </div>
      </div>
    </footer>
  );
}
