"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Category = "All" | "German" | "Japanese";

const projects = [
  {
    id: 1,
    title: "BMW M3 E92",
    category: "German",
    specs: "S65 V8 | 480HP | Full Cage",
    description: "Full track build on a E92 M3. Engine refreshed, suspension rebuilt, roll cage, bucket seats.",
    color: "#1A2B3C",
    accent: "#00AAFF",
    year: "2024",
  },
  {
    id: 2,
    title: "Nissan Skyline R34",
    category: "Japanese",
    specs: "RB26 TT | 650HP | Time Attack",
    description: "Iconic R34 GTR running twin-turbo RB26 built for track dominance. Sequential gearbox, full aero.",
    color: "#0D1A0D",
    accent: "#00FF88",
    year: "2024",
  },
  {
    id: 3,
    title: "Porsche 911 GT3",
    category: "German",
    specs: "9000RPM | 520HP | Clubsport",
    description: "Naturally aspirated 992 GT3 with custom exhaust, aero package and suspension geometry.",
    color: "#1A1A2B",
    accent: "#00AAFF",
    year: "2023",
  },
  {
    id: 4,
    title: "Toyota Supra A90",
    category: "Japanese",
    specs: "B58 | 700HP | Street/Strip",
    description: "Pure street machine. Single turbo upgrade, ECU flash, custom intake manifold and exhaust.",
    color: "#1A0D0D",
    accent: "#FF6600",
    year: "2023",
  },
  {
    id: 5,
    title: "Mercedes AMG C63",
    category: "German",
    specs: "M156 V8 | 560HP | Stanced",
    description: "W205 C63 with full air suspension, forged wheels, dyno-tuned V8 with headers and full exhaust.",
    color: "#0D0D1A",
    accent: "#00AAFF",
    year: "2023",
  },
  {
    id: 6,
    title: "Honda NSX NA1",
    category: "Japanese",
    specs: "C30A | 280HP | Restored",
    description: "Full NSX restoration and upgrade. Engine rebuild, suspension refresh, Mugen aero, recaro interior.",
    color: "#1A1A0D",
    accent: "#FFD700",
    year: "2022",
  },
  {
    id: 7,
    title: "BMW E30 M3",
    category: "German",
    specs: "S54 Swap | 343HP | Restomod",
    description: "Classic E30 shell, modern S54 engine swap with custom mounts, 6-speed gearbox, full rebuild.",
    color: "#1A2B3C",
    accent: "#00AAFF",
    year: "2022",
  },
  {
    id: 8,
    title: "Nissan 350Z",
    category: "Japanese",
    specs: "VQ35HR | 420HP | Drift",
    description: "Dedicated drift build. Engine built, hydraulic handbrake, custom cage, angle kit, wide body kit.",
    color: "#1A0D1A",
    accent: "#FF00AA",
    year: "2022",
  },
  {
    id: 9,
    title: "Porsche 993 Turbo",
    category: "German",
    specs: "3.6TT | 480HP | OEM+",
    description: "Timeless 993 Turbo with period-correct upgrades. Engine rebuild, new turbos, fresh everything.",
    color: "#1A1A2B",
    accent: "#00AAFF",
    year: "2021",
  },
];

const categories: Category[] = ["All", "German", "Japanese"];

export default function Portfolio() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">
            Our Work
          </p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            Build <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>Portfolio</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-12" role="tablist" aria-label="Filter projects by category">
          {categories.map((cat) => (
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
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="glass-card glow-card rounded-sm overflow-hidden group"
              >
                {/* Visual area */}
                <div
                  className="relative h-44 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${p.color} 0%, #050608 100%)` }}
                >
                  {/* Grid pattern inside */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Car silhouette placeholder */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <svg viewBox="0 0 80 30" className="w-32 opacity-60" fill="none">
                      <ellipse cx="40" cy="22" rx="36" ry="6" fill={p.accent} opacity="0.15" />
                      <path
                        d="M8 20 L14 12 L28 8 L52 8 L66 12 L72 20 Z"
                        fill={p.accent}
                        opacity="0.5"
                      />
                      <circle cx="20" cy="22" r="5" fill={p.accent} opacity="0.7" />
                      <circle cx="60" cy="22" r="5" fill={p.accent} opacity="0.7" />
                    </svg>
                  </div>
                  {/* Category badge */}
                  <span
                    className="absolute top-3 right-3 font-['Orbitron'] text-[10px] font-700 tracking-widest uppercase px-2 py-1 rounded-sm"
                    style={{
                      background: `${p.accent}20`,
                      border: `1px solid ${p.accent}40`,
                      color: p.accent,
                    }}
                  >
                    {p.category}
                  </span>
                  {/* Year */}
                  <span className="absolute bottom-3 left-3 font-['JetBrains_Mono'] text-[10px] text-white/30">
                    {p.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="font-['Orbitron'] font-700 text-sm text-white group-hover:text-[#00AAFF] transition-colors">
                      {p.title}
                    </h3>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#00AAFF]/60 mt-1">
                      {p.specs}
                    </p>
                  </div>
                  <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/45 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
