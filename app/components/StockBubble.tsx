"use client";
import { useTranslation } from "@/lib/i18n";
import type { StockStatus } from "@/lib/merch";

const STYLES: Record<StockStatus, { bubble: string; dot: string }> = {
  in_stock: {
    bubble: "text-[#00AAFF] border-[#00AAFF]/35 bg-[#00AAFF]/10 shadow-[0_0_12px_#00AAFF25]",
    dot: "bg-[#00AAFF] shadow-[0_0_6px_#00AAFF]",
  },
  low: {
    bubble: "text-yellow-400 border-yellow-400/40 bg-yellow-400/12 shadow-[0_0_14px_#eab30830]",
    dot: "bg-yellow-400 shadow-[0_0_8px_#eab308] animate-pulse",
  },
  out_of_stock: {
    bubble: "text-red-400 border-red-400/40 bg-red-400/12 shadow-[0_0_14px_#ef444430]",
    dot: "bg-red-400 shadow-[0_0_8px_#ef4444]",
  },
};

interface StockBubbleProps {
  status: StockStatus;
  stock?: number;
  className?: string;
  size?: "sm" | "md";
}

export default function StockBubble({
  status,
  stock,
  className = "",
  size = "sm",
}: StockBubbleProps) {
  const { t } = useTranslation();
  const s = STYLES[status];

  const label =
    status === "out_of_stock"
      ? t("shop.stock.out")
      : status === "low"
        ? t("shop.stock.low")
        : "";

  if (status === "in_stock" && stock === undefined) return null;

  const textSize = size === "md" ? "text-[10px] px-3 py-1" : "text-[9px] px-2.5 py-0.5";
  const stockHint =
    stock !== undefined && status === "low" ? t("shop.stock.left").replace("{n}", String(stock)) : null;

  return (
    <span
      className={`inline-flex items-center gap-2 font-['JetBrains_Mono'] font-500 tracking-widest uppercase rounded-full border backdrop-blur-sm ${textSize} ${s.bubble} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {label}
      {stockHint && <span className="normal-case tracking-normal opacity-90">{stockHint}</span>}
    </span>
  );
}
