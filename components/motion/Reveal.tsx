"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
  className?: string;
  children: ReactNode;
  /** Delay before animation starts (ms). Default 0. */
  delay?: number;
  /** Animation duration (ms). Default 1100 (slow, cinematic). */
  duration?: number;
  /** Initial Y offset in px. Element translates from y → 0 as it enters. Default 24. */
  y?: number;
  /** Trigger only the first time the element enters view. Default true. */
  once?: boolean;
  /** Intersection ratio threshold 0–1. Default 0.15. */
  threshold?: number;
}

/**
 * Reveal — fade + translate entrance when an element scrolls into view.
 *
 * Uses IntersectionObserver. Respects prefers-reduced-motion (instant show).
 * The most-used motion primitive in the site — every section uses it.
 */
export function Reveal({
  className,
  children,
  delay = 0,
  duration = 1100,
  y = 24,
  once = true,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
