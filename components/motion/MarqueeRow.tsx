"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface MarqueeRowProps {
  children: ReactNode;
  /** Speed multiplier — higher = faster. Default 1. */
  speed?: number;
  /** Direction. Default "left". */
  direction?: "left" | "right";
  className?: string;
  /** Gap between items in px. Default 48. */
  gap?: number;
  /** Pause on hover. Default true. */
  pauseOnHover?: boolean;
}

/**
 * MarqueeRow — infinite looping horizontal scroll.
 *
 * Renders children twice side-by-side so the loop is seamless.
 * Pure CSS animation — no JS scroll, zero layout shift.
 */
export function MarqueeRow({
  children,
  speed = 1,
  direction = "left",
  className,
  gap = 48,
  pauseOnHover = true,
}: MarqueeRowProps) {
  const duration = `${Math.round(40 / speed)}s`;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className={cn(
          "flex w-max",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          gap: `${gap}px`,
          animation: `marquee-${direction} ${duration} linear infinite`,
        }}
      >
        {/* First copy */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* Second copy for seamless loop */}
        <div
          className="flex shrink-0 items-center"
          aria-hidden
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
