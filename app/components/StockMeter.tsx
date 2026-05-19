"use client";
import type { StockStatus } from "@/lib/merch";

const SEGMENTS = 5;

const FILL: Record<StockStatus, string> = {
  in_stock: "bg-[#00AAFF] shadow-[0_0_6px_#00AAFF60]",
  low: "bg-yellow-400 shadow-[0_0_6px_#eab30880]",
  out_of_stock: "bg-red-400/50",
};

const EMPTY = "bg-white/10";

interface StockMeterProps {
  status: StockStatus;
  stock: number;
  lowStockThreshold: number;
  className?: string;
}

/** Filled segment bars instead of a numeric stock label. */
export default function StockMeter({ status, stock, lowStockThreshold, className = "" }: StockMeterProps) {
  const cap = Math.max(lowStockThreshold * 3, 10, stock);
  const ratio = status === "out_of_stock" ? 0 : Math.min(1, stock / cap);
  const filled = status === "out_of_stock" ? 0 : Math.max(1, Math.round(ratio * SEGMENTS));

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-hidden>
      {Array.from({ length: SEGMENTS }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
            i < filled ? FILL[status] : EMPTY
          }`}
        />
      ))}
    </div>
  );
}
