"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 170, 255, ${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,170,255,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #050608)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 gap-8">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 relative"
            style={{ filter: "drop-shadow(0 0 20px #00AAFF) drop-shadow(0 0 40px #00AAFF60)" }}
          >
            <svg viewBox="0 0 128 128" fill="none" className="w-full h-full">
              <rect width="128" height="128" fill="#000" />
              <rect width="128" height="128" fill="none" stroke="#00AAFF" strokeWidth="2" />
              <line x1="16" y1="16" x2="112" y2="112" stroke="#00AAFF" strokeWidth="14" strokeLinecap="square" />
              <line x1="112" y1="16" x2="16" y2="112" stroke="#00AAFF" strokeWidth="14" strokeLinecap="square" />
            </svg>
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="font-['Orbitron'] font-black text-5xl sm:text-7xl lg:text-8xl tracking-widest text-white uppercase"
            style={{ letterSpacing: "0.25em" }}
          >
            STAGE
          </span>
          <span
            className="font-['Orbitron'] font-black text-7xl sm:text-9xl lg:text-[10rem] leading-none"
            style={{
              color: "#00AAFF",
              textShadow: "0 0 20px #00AAFF, 0 0 60px #00AAFF80, 0 0 100px #00AAFF40",
              letterSpacing: "0.1em",
            }}
          >
            X
          </span>
          <span
            className="font-['Orbitron'] font-black text-5xl sm:text-7xl lg:text-8xl tracking-widest text-white uppercase"
            style={{ letterSpacing: "0.25em" }}
          >
            GARAGE
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="font-['JetBrains_Mono'] text-xs sm:text-sm tracking-[0.4em] text-[#00AAFF]/70 uppercase"
        >
          Service &amp; Tuning
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          className="font-['JetBrains_Mono'] text-sm sm:text-base text-[#d4d8e8]/50 max-w-lg leading-relaxed"
        >
          German precision. Japanese spirit. Built to dominate.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <a href="#portfolio" className="btn-neon-filled px-8 py-4 text-sm rounded-sm">
            View Builds
          </a>
          <a href="#contact" className="btn-neon px-8 py-4 text-sm rounded-sm">
            Book Service
          </a>
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-8 sm:gap-16 mt-8 pt-8 border-t border-[#00AAFF]/10 w-full max-w-md justify-center"
        >
          {[
            { value: "200+", label: "Builds" },
            { value: "15yr", label: "Experience" },
            { value: "100%", label: "Passion" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="font-['Orbitron'] font-700 text-xl sm:text-2xl text-[#00AAFF]">{s.value}</span>
              <span className="font-['JetBrains_Mono'] text-xs tracking-widest text-[#d4d8e8]/40 uppercase">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#00AAFF]/50 hover:text-[#00AAFF] transition-colors cursor-pointer"
        aria-label="Scroll to services"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.a>
    </section>
  );
}
