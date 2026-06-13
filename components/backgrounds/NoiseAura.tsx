"use client";

import { cn } from "@/lib/utils/cn";

/**
 * NoiseAura — soft color wash + film grain overlay.
 * The most subtle background; used beneath glass-heavy sections to
 * keep the surface from looking sterile.
 */
export function NoiseAura({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {/* Slow color wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent-1) 18%, transparent), transparent 50%), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--accent-2) 12%, transparent), transparent 50%)",
          animation: "noise-wash 24s ease-in-out infinite alternate",
        }}
      />
      {/* SVG grain overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  );
}
