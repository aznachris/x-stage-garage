"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ project, initialIndex = 0, onClose }: Props) {
  const photos = project.photos;
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && photos.length > 1) prev();
      if (e.key === "ArrowRight" && photos.length > 1) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next, photos.length]);

  const photo = photos[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-['Orbitron'] font-black text-sm text-white tracking-wide">{project.title}</span>
            <span className="font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm border"
              style={{ color: project.accent, borderColor: `${project.accent}40`, background: `${project.accent}15` }}>
              {project.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {photos.length > 0 && (
              <span className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/40">
                {index + 1} / {photos.length}
              </span>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#d4d8e8]/50 hover:text-white transition-colors border border-[#00AAFF]/15 hover:border-[#00AAFF]/40 rounded-sm">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Image area */}
        <div
          className="relative w-full rounded-sm overflow-hidden border border-[#00AAFF]/15 flex items-center justify-center"
          style={{ aspectRatio: "16/9", background: `linear-gradient(135deg, ${project.color} 0%, #050608 100%)` }}
        >
          {photos.length === 0 ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <svg viewBox="0 0 80 30" className="w-32 opacity-40" fill="none">
                <ellipse cx="40" cy="22" rx="36" ry="6" fill={project.accent} opacity="0.15" />
                <path d="M8 20 L14 12 L28 8 L52 8 L66 12 L72 20 Z" fill={project.accent} opacity="0.5" />
                <circle cx="20" cy="22" r="5" fill={project.accent} opacity="0.7" />
                <circle cx="60" cy="22" r="5" fill={project.accent} opacity="0.7" />
              </svg>
              <div className="flex items-center gap-2 text-[#d4d8e8]/30">
                <Images size={16} />
                <span className="font-['JetBrains_Mono'] text-xs">Δεν υπάρχουν φωτογραφίες ακόμα</span>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.caption || project.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-[#00AAFF]/20 text-white/60 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-[#00AAFF]/20 text-white/60 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Caption */}
        {photo?.caption && (
          <p className="font-['JetBrains_Mono'] text-sm text-[#d4d8e8]/60 text-center">
            {photo.caption}
          </p>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                className={`w-14 h-10 rounded-sm overflow-hidden border-2 transition-all ${
                  i === index ? "border-[#00AAFF]" : "border-transparent opacity-40 hover:opacity-70"
                }`}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
