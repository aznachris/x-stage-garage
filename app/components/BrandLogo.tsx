"use client";
/**
 * BrandLogo — renders an SVG logo for a car brand.
 *
 * Simple-icons is used for brands that have official icons there.
 * Hand-crafted minimal SVGs are used for the rest (Mercedes, Alfa Romeo, Jaguar, Lexus).
 *
 * All icons render at whatever color `currentColor` resolves to, so they inherit
 * the parent element's text colour automatically.
 */

import {
  siAcura, siAmg, siAstonmartin, siAudi, siBmw, siCadillac,
  siChevrolet, siFord, siFerrari, siHonda, siHyundai, siInfiniti,
  siKia, siLamborghini, siMaserati, siMazda, siMclaren, siMini,
  siMitsubishi, siNissan, siOpel, siPorsche, siSeat, siSkoda,
  siSubaru, siToyota, siVolkswagen,
} from "simple-icons";

/* ── Types ─────────────────────────────────────────────────────────────── */

type PathIcon = { type: "path"; d: string };
type CustomIcon = { type: "custom"; el: () => React.ReactNode };
type BrandIconDef = PathIcon | CustomIcon;

/* ── Custom SVGs for brands not in simple-icons ─────────────────────────
   All use fill="none" / stroke="currentColor" with strokeWidth ~1.7
   Viewport: 0 0 24 24
   ──────────────────────────────────────────────────────────────────────── */

// Mercedes-Benz — the iconic three-pointed star inside a ring
const MercedesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Mercedes"
    role="img"
  >
    <circle cx="12" cy="12" r="10.5" />
    {/* Three arms: top, lower-right (30°), lower-left (150°) */}
    <line x1="12" y1="12" x2="12" y2="1.5" />
    <line x1="12" y1="12" x2="21.09" y2="17.25" />
    <line x1="12" y1="12" x2="2.91" y2="17.25" />
    {/* Small hub dot */}
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

// Alfa Romeo — simplified circular badge with Milanese cross (left) + biscione / serpent (right)
const AlfaRomeoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Alfa Romeo"
    role="img"
  >
    {/* Outer ring */}
    <circle cx="12" cy="12" r="10.5" strokeWidth="1.3" />
    {/* Vertical dividing line */}
    <line x1="12" y1="1.5" x2="12" y2="22.5" strokeWidth="0.7" strokeOpacity="0.5" />
    {/* LEFT half — Milanese cross: vertical + horizontal bar */}
    <line x1="8.5"  y1="8"  x2="8.5"  y2="16" strokeWidth="1.4" />
    <line x1="5.5"  y1="12" x2="11.5" y2="12" strokeWidth="1.4" />
    {/* RIGHT half — Biscione (serpent): open S-curve from top-right to bottom-right */}
    <path d="M13.5 7 C17 7 17.5 9.5 15 11 C12.5 12.5 13 15 16.5 15 C18.5 15 18.5 13.5 17 13" strokeWidth="1.1" />
  </svg>
);

// Jaguar — leaping cat silhouette (simplified geometric)
const JaguarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Jaguar"
    role="img"
  >
    {/*
      Simplified leaping jaguar profile (right-facing, mid-leap):
      Body arches upward, front legs extend forward, rear legs push back, tail curves.
    */}
    <path d="
      M3.5 16
      C3 14.5 3.5 13 4.5 12
      C5 11.5 5.5 11 5.5 10.5
      C5.5 9 6.5 8 7.5 7.5
      C9 7 10 7.5 11 8
      C12 8.5 13 9 14 9
      C15.5 9 17 8.5 18 7.5
      C18.5 7 19 7 19.5 7.5
      C20 8 19.5 8.5 19 9
      C18 10 17 11 16.5 12
      C16 13 16.5 14 17 15
      L16 15.5
      C15.5 14.5 15 13.5 15 12.5
      C15 11.5 15.5 10.5 16 9.5
      C15 10 13.5 10.5 12 10.5
      C10.5 10.5 9.5 10 8.5 9.5
      C8 9.2 7.5 9 7 9.5
      C6.5 10 6.5 11 6 12
      C5.5 12.8 5 14 5 15.5
      L4.5 16
      L3.5 16 Z
    " />
    {/* Head */}
    <ellipse cx="19.5" cy="8" rx="1.5" ry="1.2" />
    {/* Ear */}
    <path d="M19 6.5 L20 5.5 L21 6.8 Z" />
    {/* Front paw */}
    <ellipse cx="17.5" cy="16" rx="1.2" ry="0.8" />
    {/* Rear paw */}
    <ellipse cx="4.5" cy="16.5" rx="1" ry="0.7" />
    {/* Tail curves up */}
    <path d="M5 15 C3 14 2 12 3 10 C3.5 8.5 4.5 8 5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Lexus — stylised "L" intersecting an ellipse (the actual Lexus logo concept)
const LexusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Lexus"
    role="img"
  >
    {/* Outer oval */}
    <ellipse cx="12" cy="12" rx="11" ry="7.5" strokeWidth="1.5" />
    {/* Stylised L: vertical stroke + short horizontal base */}
    <path d="M9.5 7.5 L9.5 16.5 L15 16.5" strokeWidth="2.2" />
  </svg>
);

/* ── Master brand → icon mapping ────────────────────────────────────────── */

function p(d: string): PathIcon {
  return { type: "path", d };
}
function c(el: () => React.ReactNode): CustomIcon {
  return { type: "custom", el };
}

const BRAND_ICONS: Record<string, BrandIconDef> = {
  // ─── simple-icons ───────────────────────────────
  Acura:          p(siAcura.path),
  AMG:            p(siAmg.path),
  "Aston Martin": p(siAstonmartin.path),
  Audi:           p(siAudi.path),
  BMW:            p(siBmw.path),
  Cadillac:       p(siCadillac.path),
  Chevrolet:      p(siChevrolet.path),
  Ferrari:        p(siFerrari.path),
  Ford:           p(siFord.path),
  Honda:          p(siHonda.path),
  Hyundai:        p(siHyundai.path),
  Infiniti:       p(siInfiniti.path),
  Kia:            p(siKia.path),
  Lamborghini:    p(siLamborghini.path),
  Maserati:       p(siMaserati.path),
  Mazda:          p(siMazda.path),
  McLaren:        p(siMclaren.path),
  MINI:           p(siMini.path),
  Mitsubishi:     p(siMitsubishi.path),
  Nissan:         p(siNissan.path),
  Opel:           p(siOpel.path),
  Porsche:        p(siPorsche.path),
  SEAT:           p(siSeat.path),
  Škoda:          p(siSkoda.path),
  Subaru:         p(siSubaru.path),
  Toyota:         p(siToyota.path),
  Volkswagen:     p(siVolkswagen.path),
  // ─── custom SVGs ────────────────────────────────
  Mercedes:       c(MercedesIcon),
  "Alfa Romeo":   c(AlfaRomeoIcon),
  Jaguar:         c(JaguarIcon),
  Lexus:          c(LexusIcon),
};

/* ── Component ──────────────────────────────────────────────────────────── */

interface BrandLogoProps {
  brand: string;
  size?: number;
  className?: string;
}

export default function BrandLogo({ brand, size = 18, className = "" }: BrandLogoProps) {
  const def = BRAND_ICONS[brand];
  if (!def) return null;

  if (def.type === "custom") {
    return (
      <span
        style={{ display: "inline-flex", width: size, height: size, flexShrink: 0 }}
        className={className}
        aria-hidden="true"
      >
        {def.el()}
      </span>
    );
  }

  // simple-icons path — always fill-based, 24×24 viewBox
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-label={brand}
      role="img"
    >
      <path d={def.d} />
    </svg>
  );
}
