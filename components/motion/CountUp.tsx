"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to count to */
  to: number;
  /** Duration of animation in ms. Default 2000. */
  duration?: number;
  /** Decimal places. Default 0. */
  decimals?: number;
  /** Prefix string (e.g. "$") */
  prefix?: string;
  /** Suffix string (e.g. "+", "%") */
  suffix?: string;
  /** Start counting only when the element enters the viewport */
  triggerOnView?: boolean;
  className?: string;
}

/**
 * CountUp — animates a number from 0 to `to` when it enters the viewport.
 * Uses IntersectionObserver + requestAnimationFrame for smooth easing.
 */
export function CountUp({
  to,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  triggerOnView = true,
  className,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(!triggerOnView);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!triggerOnView) { setStarted(true); return; }
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, triggerOnView]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}
