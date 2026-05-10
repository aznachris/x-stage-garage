"use client";
import { motion } from "framer-motion";
import { Wrench, Zap, Settings, Shield, Gauge, Paintbrush } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Custom Builds",
    description: "Full ground-up builds engineered for maximum performance and street presence. No compromises.",
    tags: ["Engine Swap", "Chassis Work", "Roll Cage"],
  },
  {
    icon: Zap,
    title: "Engine Tuning",
    description: "ECU remaps, dyno tuning, forced induction upgrades. Unlock every last horse.",
    tags: ["ECU Remap", "Turbo Build", "Dyno"],
  },
  {
    icon: Settings,
    title: "Suspension & Handling",
    description: "Track-ready suspension setups, alignment, coilovers, and aero balance for any discipline.",
    tags: ["Coilovers", "Alignment", "Aero"],
  },
  {
    icon: Shield,
    title: "Maintenance",
    description: "Factory-level servicing with performance-grade parts. Keep your machine running at peak.",
    tags: ["Oil Service", "Brakes", "Cooling"],
  },
  {
    icon: Gauge,
    title: "Performance Upgrades",
    description: "Intake, exhaust, braking systems, lightweight components — precision-fitted to your build.",
    tags: ["Exhaust", "Intake", "Brakes"],
  },
  {
    icon: Paintbrush,
    title: "Detailing & Wrap",
    description: "Paint correction, ceramic coating, full vinyl wraps. Your car, your identity.",
    tags: ["Ceramic", "Wrap", "PPF"],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">
            What We Do
          </p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            Our <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>Services</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={cardVariants}
                className="glass-card glow-card rounded-sm p-6 group flex flex-col gap-4"
              >
                {/* Icon */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#00AAFF]/10 rounded-sm group-hover:bg-[#00AAFF]/20 transition-colors" />
                  <Icon
                    size={22}
                    className="relative text-[#00AAFF] group-hover:drop-shadow-[0_0_8px_#00AAFF] transition-all"
                  />
                </div>

                {/* Title */}
                <h3 className="font-['Orbitron'] font-700 text-base text-white tracking-wide group-hover:text-[#00AAFF] transition-colors">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/55 leading-relaxed flex-1">
                  {s.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#00AAFF]/10">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#00AAFF]/70 uppercase bg-[#00AAFF]/5 border border-[#00AAFF]/15 px-2 py-1 rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <a href="#contact" className="btn-neon px-10 py-4 text-sm rounded-sm inline-block">
            Request a Quote
          </a>
        </motion.div>
      </div>
    </section>
  );
}
