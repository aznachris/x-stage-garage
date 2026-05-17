"use client";
import { motion } from "framer-motion";
import { Wrench, Zap, Settings, Shield, Gauge, Paintbrush } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const serviceKeys = [
  { icon: Wrench, titleKey: "services.custom.title", descKey: "services.custom.desc", tags: ["Engine Swap", "Chassis Work", "Roll Cage"] },
  { icon: Zap, titleKey: "services.engine.title", descKey: "services.engine.desc", tags: ["ECU Remap", "Turbo Build", "Dyno"] },
  { icon: Settings, titleKey: "services.suspension.title", descKey: "services.suspension.desc", tags: ["Coilovers", "Alignment", "Aero"] },
  { icon: Shield, titleKey: "services.maintenance.title", descKey: "services.maintenance.desc", tags: ["Oil Service", "Brakes", "Cooling"] },
  { icon: Gauge, titleKey: "services.performance.title", descKey: "services.performance.desc", tags: ["Exhaust", "Intake", "Brakes"] },
  { icon: Paintbrush, titleKey: "services.detailing.title", descKey: "services.detailing.desc", tags: ["Ceramic", "Wrap", "PPF"] },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00AAFF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="font-['JetBrains_Mono'] text-xs tracking-[0.4em] text-[#00AAFF] uppercase mb-3">
            {t("services.label")}
          </p>
          <h2 className="font-['Orbitron'] font-900 text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
            {t("services.title1")}{" "}
            <span style={{ color: "#00AAFF", textShadow: "0 0 20px #00AAFF80" }}>{t("services.title2")}</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {serviceKeys.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.titleKey}
                variants={cardVariants}
                className="glass-card glow-card rounded-sm p-6 group flex flex-col gap-4"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#00AAFF]/10 rounded-sm group-hover:bg-[#00AAFF]/20 transition-colors" />
                  <Icon size={22} className="relative text-[#00AAFF] group-hover:drop-shadow-[0_0_8px_#00AAFF] transition-all" />
                </div>
                <h3 className="font-['Orbitron'] font-700 text-base text-white tracking-wide group-hover:text-[#00AAFF] transition-colors">
                  {t(s.titleKey)}
                </h3>
                <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/55 leading-relaxed flex-1">
                  {t(s.descKey)}
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#00AAFF]/10">
                  {s.tags.map((tag) => (
                    <span key={tag} className="font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#00AAFF]/70 uppercase bg-[#00AAFF]/5 border border-[#00AAFF]/15 px-2 py-1 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <a href="#booking" className="btn-neon px-10 py-4 text-sm rounded-sm inline-block">
            {t("services.cta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
