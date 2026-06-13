"use client";

import {
  useState,
  type AnimationEvent,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import { AnimatedBorder } from "./AnimatedBorder";

type Variant = "primary" | "secondary";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const wrapperTransition: CSSProperties = {
  transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * GlassButton — pill-shaped glass surface.
 *
 *  - primary:   violet-tinted surface + sweep border + bright accent halo on hover
 *  - secondary: neutral glass + sweep border + neutral elevation on hover
 *  - disabled:  no animated border, dimmed, no hover, no press shine
 *
 * Press shine: on mousedown / touchstart, a diagonal white gradient sweeps
 * across the button interior over 600ms. Decoupled from lift/shadow.
 * The shine animation completes regardless of how briefly the user holds.
 */
export function GlassButton({
  variant = "primary",
  className,
  children,
  type = "button",
  disabled,
  onMouseDown,
  onTouchStart,
  ...props
}: GlassButtonProps) {
  const [shining, setShining] = useState(false);

  function startShine() {
    if (disabled) return;
    // Reset to ensure animation re-fires on rapid repeat clicks
    setShining(false);
    requestAnimationFrame(() => setShining(true));
  }

  function handleAnimEnd(e: AnimationEvent<HTMLButtonElement>) {
    if (e.animationName === "button-shine") setShining(false);
  }

  const innerButton = (
    <button
      type={type}
      disabled={disabled}
      onMouseDown={(e) => {
        startShine();
        onMouseDown?.(e);
      }}
      onTouchStart={(e) => {
        startShine();
        onTouchStart?.(e);
      }}
      onAnimationEnd={handleAnimEnd}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
        "font-medium text-text-hi text-[0.95rem]",
        variant === "primary" && "glass-primary",
        variant === "secondary" && "glass-light",
        "btn-shine-target",
        shining && "btn-shining",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0",
        "cursor-pointer disabled:cursor-default",
        className
      )}
      {...props}
    >
      <span className="relative z-[1]">{children}</span>
    </button>
  );

  const wrapperBase =
    "relative inline-block rounded-full will-change-transform";
  const baseShadow = "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]";

  // Disabled — no animated border, dimmed, inert
  if (disabled) {
    return (
      <div
        className={cn(wrapperBase, baseShadow, "opacity-50")}
        style={wrapperTransition}
      >
        {innerButton}
      </div>
    );
  }

  // Primary — sweep border + bright accent halo on hover
  if (variant === "primary") {
    return (
      <div
        className={cn(
          wrapperBase,
          baseShadow,
          "hover:-translate-y-1",
          "hover:shadow-[0_32px_64px_-16px_rgba(110,86,255,0.55),0_12px_30px_-8px_rgba(0,0,0,0.45)]",
          "active:translate-y-0",
          "active:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]"
        )}
        style={wrapperTransition}
      >
        <AnimatedBorder variant="sweep" radius={9999} duration={6000}>
          {innerButton}
        </AnimatedBorder>
      </div>
    );
  }

  // Secondary — sweep border + neutral elevation on hover
  return (
    <div
      className={cn(
        wrapperBase,
        baseShadow,
        "hover:-translate-y-1",
        "hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_8px_20px_-6px_rgba(0,0,0,0.35)]",
        "active:translate-y-0",
        "active:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)]"
      )}
      style={wrapperTransition}
    >
      <AnimatedBorder variant="sweep" radius={9999} duration={6000}>
        {innerButton}
      </AnimatedBorder>
    </div>
  );
}
