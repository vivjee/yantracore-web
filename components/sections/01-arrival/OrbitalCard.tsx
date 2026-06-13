"use client";

import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

type Depth = "front" | "mid" | "back";

interface OrbitalCardProps {
  children: ReactNode;
  /** Absolute-positioning classes ("left-[8%] top-[20%]"). */
  className?: string;
  /** Drift offset so cards never stay in sync. e.g. "-3s". */
  delay?: string;
  /** Drift cycle duration. Default "16s". */
  duration?: string;
  /** Depth affects scale + opacity (back = recedes, front = pops). */
  depth?: Depth;
}

const depthStyle: Record<Depth, CSSProperties> = {
  front: { transform: "scale(1)", opacity: 1 },
  mid: { transform: "scale(0.92)", opacity: 0.88 },
  back: { transform: "scale(0.84)", opacity: 0.74 },
};

/**
 * OrbitalCard — the floating glass tile that drifts around the hero's logo.
 *
 * Plain glass surface — no animated border. The conic-sweep is reserved for
 * CTA buttons so the eye lands on them. Drift is CSS-only (orbital-drift
 * keyframes). Each card needs a unique `delay` so they don't move in unison.
 */
export function OrbitalCard({
  children,
  className,
  delay = "0s",
  duration = "16s",
  depth = "mid",
}: OrbitalCardProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-auto hidden md:block z-[3]",
        className
      )}
      style={depthStyle[depth]}
    >
      <div
        style={{
          animation: `orbital-drift ${duration} ease-in-out infinite`,
          animationDelay: delay,
        }}
      >
        <div className="glass-medium rounded-[24px] p-5 min-w-[280px] max-w-[340px]">
          {children}
        </div>
      </div>
    </div>
  );
}
