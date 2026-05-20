"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface CarouselPhoto {
  id: string;
  url: string;
}

interface MerchImageCarouselProps {
  photos: CarouselPhoto[];
  alt?: string;
  className?: string;
  heightClass?: string;
  placeholder?: React.ReactNode;
  showArrows?: boolean;
  onPhotoClick?: (index: number) => void;
}

export default function MerchImageCarousel({
  photos,
  alt = "",
  className = "",
  heightClass = "h-48",
  placeholder,
  showArrows = true,
  onPhotoClick,
}: MerchImageCarouselProps) {
  const items = photos.filter((p) => p.url);
  const [index, setIndex] = useState(0);
  const safeIndex = items.length ? index % items.length : 0;

  if (!items.length) {
    return (
      <div
        className={`relative ${heightClass} bg-gradient-to-br from-[#00AAFF]/06 via-[#0d0f12] to-[#0d0f12] border border-[#00AAFF]/10 rounded-sm overflow-hidden flex items-end justify-start p-3 ${className}`}
      >
        {placeholder ?? (
          <span className="font-['Orbitron'] text-[9px] font-700 tracking-[0.3em] text-[#00AAFF]/18 uppercase relative z-10">
            Stage X Garage
          </span>
        )}
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + items.length) % items.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % items.length);
  };

  const current = items[safeIndex];

  return (
    <div
      className={`relative ${heightClass} bg-[#0d0f12] border border-[#00AAFF]/10 rounded-sm overflow-hidden group ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current.id}
          src={current.url}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => onPhotoClick?.(safeIndex)}
          className={`absolute inset-0 w-full h-full object-cover ${onPhotoClick ? "cursor-zoom-in" : ""}`}
        />
      </AnimatePresence>

      {items.length > 1 && showArrows && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-black/65 border border-[#00AAFF]/25 text-white/70 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-black/65 border border-[#00AAFF]/25 text-white/70 hover:text-[#00AAFF] hover:border-[#00AAFF]/50 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5 px-2">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIndex
                    ? "w-5 bg-[#00AAFF] shadow-[0_0_8px_#00AAFF80]"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
