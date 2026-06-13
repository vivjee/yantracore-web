"use client";

import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "light" | "medium" | "heavy";

interface GlassCardProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Disable interactive hover (for static cards). */
  interactive?: boolean;
}

/**
 * GlassCard — the most-used surface in the site.
 *
 * Signature hover: lift + 3D tilt toward cursor + accent glow + cursor spotlight.
 * All driven by CSS custom properties so the JS work is just reading mouse coords.
 */
export function GlassCard({
  variant = "medium",
  className,
  children,
  interactive = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    // Tilt: max ±6deg, inverted axes for natural feel
    const rx = (py - 0.5) * -12;
    const ry = (px - 0.5) * 12;

    const el = ref.current;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }

  function handleEnter() {
    if (!interactive || !ref.current) return;
    ref.current.style.setProperty("--lift", "-4px");
    ref.current.style.setProperty("--glow", "1");
    ref.current.style.setProperty("--spot", "1");
  }

  function handleLeave() {
    if (!interactive || !ref.current) return;
    const el = ref.current;
    el.style.setProperty("--lift", "0px");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glow", "0");
    el.style.setProperty("--spot", "0");
  }

  const variantClass = {
    light: "glass-light",
    medium: "glass-medium",
    heavy: "glass-heavy",
  }[variant];

  const style: CSSProperties = interactive
    ? {
        transform:
          "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--lift, 0px))",
        transition:
          "transform var(--dur-base) var(--ease-out-soft), box-shadow var(--dur-slow) var(--ease-out-soft)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0,0,0,0.5), 0 0 calc(60px * var(--glow, 0)) calc(-10px) rgba(110, 86, 255, calc(0.4 * var(--glow, 0)))",
      }
    : {};

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        variantClass,
        "relative isolate rounded-3xl p-8 [transform-style:preserve-3d] will-change-transform",
        className
      )}
      style={style}
    >
      {/* Cursor spotlight overlay */}
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out-soft)]"
          style={{
            opacity: "var(--spot, 0)",
            background:
              "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(110, 86, 255, 0.18), transparent 65%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
