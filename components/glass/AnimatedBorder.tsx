"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "sweep" | "pulse" | "trace";

interface AnimatedBorderProps {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** Border radius in px; must match the inner element's radius. Default 24. */
  radius?: number;
  /** Sweep animation duration in ms. Default 8000. */
  duration?: number;
  /** Pause the animation (used for reduced motion fallback). */
  paused?: boolean;
}

/**
 * AnimatedBorder
 *
 * Three modes:
 *  - sweep  → conic gradient rotating around the perimeter (the signature look)
 *  - pulse  → soft glow border, no rotation
 *  - trace  → SVG path that draws itself on scroll into view (TODO: scroll trigger)
 *
 * Usage: wrap the element whose border you want animated. The wrapper itself
 * is invisible — the border is drawn on a `::before`-style layer behind the child.
 */
export function AnimatedBorder({
  variant = "sweep",
  className,
  style,
  children,
  radius = 24,
  duration = 8000,
  paused = false,
}: AnimatedBorderProps) {
  if (variant === "sweep") {
    const borderStyle: CSSProperties = {
      borderRadius: radius,
    };
    const layerStyle: CSSProperties = {
      borderRadius: radius,
      background:
        "conic-gradient(from var(--angle), transparent 0%, var(--accent-1) 25%, var(--accent-2) 50%, var(--accent-3) 75%, transparent 100%)",
      WebkitMask:
        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      WebkitMaskComposite: "xor",
      mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
      maskComposite: "exclude",
      padding: 1,
      animation: paused
        ? "none"
        : `border-spin ${duration}ms linear infinite`,
      opacity: "var(--border-opacity, 1)",
      transition: "opacity var(--border-transition-duration, 0.4s) cubic-bezier(0.16, 1, 0.3, 1)",
    };
    return (
      <div
        className={cn("relative isolate", className)}
        style={{ ...borderStyle, ...style }}
      >
        <div aria-hidden className="absolute inset-0 -z-10" style={layerStyle} />
        {children}
      </div>
    );
  }

  if (variant === "pulse") {
    const wrapperStyle: CSSProperties = { borderRadius: radius };
    const layerStyle: CSSProperties = {
      borderRadius: radius,
      animation: paused ? "none" : "pulse-glow 2400ms ease-in-out infinite",
    };
    return (
      <div
        className={cn("relative isolate", className)}
        style={wrapperStyle}
      >
        <div aria-hidden className="absolute inset-0 -z-10" style={layerStyle} />
        {children}
      </div>
    );
  }

  // trace — TODO: implement with IntersectionObserver + stroke-dashoffset
  return <div className={className}>{children}</div>;
}
