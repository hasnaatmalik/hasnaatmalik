import type React from "react";
import type { Glyph } from "@/constants/profile";

export function BrandIcon({
  glyph,
  size = 16,
  tint = false,
}: {
  glyph: Glyph;
  size?: number;
  tint?: boolean;
}) {
  const color = tint && glyph.hex ? `#${glyph.hex}` : "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className="brand-icon"
      style={
        isVivid(glyph.hex) ? ({ "--brand": `#${glyph.hex}` } as React.CSSProperties) : undefined
      }
      {...(glyph.stroke
        ? {
            fill: "none",
            stroke: color,
            strokeWidth: 1.9,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }
        : { fill: color })}
    >
      <path d={glyph.path} />
    </svg>
  );
}

/** Near-black brand colours (Next.js, Rust, GitHub…) would vanish on the dark theme, so they stay neutral. */
function isVivid(hex?: string) {
  if (!hex) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! > 0.12;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" {...stroke}>
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  );
}

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" {...stroke}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Pin({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" {...stroke}>
      <path d="M8 14.5s4.5-4.2 4.5-7.8a4.5 4.5 0 0 0-9 0c0 3.6 4.5 7.8 4.5 7.8z" />
      <circle cx="8" cy="6.6" r="1.6" />
    </svg>
  );
}

export function Sun({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" {...stroke}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
    </svg>
  );
}

export function Moon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" {...stroke}>
      <path d="M13.4 9.6A5.6 5.6 0 0 1 6.4 2.6a5.6 5.6 0 1 0 7 7z" />
    </svg>
  );
}

/** Loose hand-drawn arrow for the margin notes. Points down-left by default. */
export function ScribbleArrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 48"
      width="56"
      height="42"
      aria-hidden="true"
      className="scribble-arrow"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      {...stroke}
      strokeWidth={1.4}
    >
      <path d="M52 4c3 14-6 30-40 34" pathLength={1} />
      <path d="M19 31.5 11.5 38.2l9.2 3.6" pathLength={1} />
    </svg>
  );
}
