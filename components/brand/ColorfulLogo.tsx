"use client";

/**
 * ColorfulLogo — compact, reusable brand mark.
 *
 * Uses the same prismatic technique as the homepage LogoMark:
 *   - CSS mask over the SVG shape filled with a flowing cyan → violet → pink gradient
 *   - Chromatic-aberration ghost layers (red + cyan) subtly drifting behind
 *   - Subtle drop-shadow glow that pulses with `yantra-electric-pulse`
 *
 * Props:
 *   size     — pixel height (default 24). Width is auto.
 *   className — extra Tailwind / CSS classes on the wrapper
 *   animate  — if false, skips gradient animation (lighter for sidebars etc.)
 */

import { CSSProperties } from "react";

interface ColorfulLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
  /** Forward inline styles to the outer wrapper */
  style?: CSSProperties;
}

const SRC = "/images/logo/logo-white-no-text.svg";

export function ColorfulLogo({
  size = 24,
  className = "",
  animate = true,
  style,
}: ColorfulLogoProps) {
  const maskStyle: CSSProperties = {
    WebkitMaskImage: `url('${SRC}')`,
    maskImage: `url('${SRC}')`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    background: "linear-gradient(135deg, #00e0cb 0%, #6e56ff 50%, #ff4fb0 100%)",
    backgroundSize: "200% 200%",
    animation: animate ? "yantra-electric-flow 8s linear infinite" : "none",
  };

  const chromaOffset = Math.max(1, Math.round(size * 0.06));

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden
    >
      {/* Chromatic red ghost */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(-${chromaOffset}px, ${chromaOffset}px)`,
          opacity: 0.25,
          animation: animate ? "logo-chroma-r 14s ease-in-out infinite" : "none",
          ...maskStyle,
          background: "linear-gradient(135deg, #ff4f4f 0%, #ff7b7b 100%)",
          backgroundSize: "200% 200%",
        }}
      />
      {/* Chromatic cyan ghost */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${chromaOffset}px, -${chromaOffset}px)`,
          opacity: 0.25,
          animation: animate ? "logo-chroma-c 14s ease-in-out infinite" : "none",
          ...maskStyle,
          background: "linear-gradient(135deg, #00e0cb 0%, #00bfff 100%)",
          backgroundSize: "200% 200%",
        }}
      />
      {/* Primary prismatic fill */}
      <span
        className="absolute inset-0"
        style={{
          ...maskStyle,
          filter: animate
            ? "drop-shadow(0 0 6px rgba(110,86,255,0.55)) drop-shadow(0 0 2px rgba(0,224,203,0.4))"
            : "none",
        }}
      />
    </span>
  );
}
