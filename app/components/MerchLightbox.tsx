"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MerchPhoto } from "@/lib/merch";

interface MerchLightboxProps {
  photos: MerchPhoto[];
  productName: string;
  initialIndex?: number;
  onClose: () => void;
}

export default function MerchLightbox({
  photos,
  productName,
  initialIndex = 0,
  onClose,
}: MerchLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const current = photos[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="font-['Orbitron'] font-700 text-sm text-white tracking-wider">
            {productName}
          </span>
          {photos.length > 1 && (
            <span className="font-['JetBrains_Mono'] text-xs text-[#00AAFF]/60 border border-[#00AAFF]/20 px-2 py-0.5 rounded-full">
              {index + 1} / {photos.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center text-[#d4d8e8]/50 hover:text-white border border-[#00AAFF]/15 hover:border-[#00AAFF]/40 rounded-sm transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 relative flex items-center justify-center px-4 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.url}
            alt={current.caption || productName}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="max-w-full max-h-full object-contain rounded-sm select-none"
            draggable={false}
          />
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-black/70 border border-[#00AAFF]/25 text-white/70 hover:text-[#00AAFF] hover:border-[#00AAFF]/60 rounded-sm flex items-center justify-center transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 bg-black/70 border border-[#00AAFF]/25 text-white/70 hover:text-[#00AAFF] hover:border-[#00AAFF]/60 rounded-sm flex items-center justify-center transition-all"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <div
          className="flex-shrink-0 px-5 py-2 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-['JetBrains_Mono'] text-xs text-[#d4d8e8]/50 leading-relaxed max-w-lg mx-auto">
            {current.caption}
          </p>
        </div>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div
          className="flex-shrink-0 flex justify-center items-center gap-2 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 bg-[#00AAFF] shadow-[0_0_10px_#00AAFF80]"
                  : "w-1.5 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip — only when 2+ photos */}
      {photos.length > 1 && (
        <div
          className="flex-shrink-0 flex gap-2 px-5 pb-5 overflow-x-auto justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((ph, i) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                i === index
                  ? "border-[#00AAFF] shadow-[0_0_10px_#00AAFF60]"
                  : "border-[#00AAFF]/15 hover:border-[#00AAFF]/45 opacity-60 hover:opacity-90"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            >
              <img
                src={ph.url}
                alt={ph.caption || `Photo ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
