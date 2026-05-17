"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import Lightbox from "./Lightbox";
import { DEFAULT_PROJECTS, type Project } from "@/lib/projects";

type Category = "All" | "German" | "Japanese";

export default function Portfolio() {
  const { t } = useTranslation();
  const [active, setActive] = useState<Category>("All");
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [lightbox, setLightbox] = useState<{ project: Project; index: number } | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => {});
  }, []);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  const filterLabels: Record<Category, string> = {
    All: t("portfolio.filter.all"),
    German: t("portfolio.filter.german"),
    Japanese: t("portfolio.filter.japanese"),
  };

  const categoryLabels: Record<Category, string> = {
    All: t("portfolio.filter.all"),
    German: t("portfolio.filter.german"),
    Japanese: t("portfolio.filter.japanese"),
  };

  return (
    <>
      <section id="portfolio" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">
              {t("portfolio.label")}
            </p>
            <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
              {t("portfolio.title1")}{" "}
              <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>{t("portfolio.title2")}</span>
            </h2>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-12" role="tablist" aria-label="Filter projects">
            {(["All", "German", "Japanese"] as Category[]).map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={`font-['Orbitron'] text-xs font-700 tracking-widest uppercase px-6 py-3 rounded-sm border transition-all duration-200 cursor-pointer ${
                  active === cat
                    ? "bg-[#00AAFF] text-black border-[#00AAFF] shadow-[0_0_20px_#00AAFF60]"
                    : "bg-transparent text-[#00AAFF]/60 border-[#00AAFF]/20 hover:border-[#00AAFF]/50 hover:text-[#00AAFF]"
                }`}
              >
                {filterLabels[cat]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" as const }}
                  className="glass-card glow-card rounded-sm overflow-hidden group cursor-pointer"
                  onClick={() => setLightbox({ project: p, index: 0 })}
                >
                  <div
                    className="relative h-44 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${p.color} 0%, #050608 100%)` }}
                  >
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    {p.photos.length > 0 ? (
                      <img
                        src={p.photos[0].url}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="relative z-10">
                        <svg viewBox="0 0 80 30" className="w-32 opacity-60" fill="none">
                          <ellipse cx="40" cy="22" rx="36" ry="6" fill={p.accent} opacity="0.15" />
                          <path d="M8 20 L14 12 L28 8 L52 8 L66 12 L72 20 Z" fill={p.accent} opacity="0.5" />
                          <circle cx="20" cy="22" r="5" fill={p.accent} opacity="0.7" />
                          <circle cx="60" cy="22" r="5" fill={p.accent} opacity="0.7" />
                        </svg>
                      </div>
                    )}

                    {/* Photo count badge */}
                    {p.photos.length > 0 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 border border-white/10 px-2 py-1 rounded-sm backdrop-blur-sm">
                        <Images size={11} className="text-white/60" />
                        <span className="font-['JetBrains_Mono'] text-[10px] text-white/60">{p.photos.length}</span>
                      </div>
                    )}

                    <span
                      className="absolute top-3 right-3 font-['Orbitron'] text-[10px] font-700 tracking-widest uppercase px-2 py-1 rounded-sm"
                      style={{ background: `${p.accent}20`, border: `1px solid ${p.accent}40`, color: p.accent }}
                    >
                      {categoryLabels[p.category]}
                    </span>
                    <span className="absolute bottom-3 left-3 font-['JetBrains_Mono'] text-[10px] text-white/30">
                      {p.year}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <h3 className="font-['Orbitron'] font-700 text-sm text-white group-hover:text-[#00AAFF] transition-colors">
                        {p.title}
                      </h3>
                      <p className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF]/60 mt-1">{p.specs}</p>
                    </div>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/45 leading-relaxed">{p.description}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            project={lightbox.project}
            initialIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
