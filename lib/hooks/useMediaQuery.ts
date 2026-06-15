"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media-query subscription — the single source of truth for
 * viewport-driven layout decisions in JS (CSS should still prefer Tailwind
 * breakpoints; reach for these hooks only when a layout genuinely needs to
 * branch in JavaScript, e.g. swapping whole scenes).
 *
 * Built on `useSyncExternalStore` like `useFullscreen` — the server snapshot is
 * a stable default, then it reconciles to the real value after hydration, so
 * there is no hydration mismatch and no `useEffect`/`useState` ceremony.
 */

/**
 * Canonical breakpoints — mirror Tailwind v4 defaults so JS and CSS agree.
 * (`xs` is also registered in `globals.css` via `--breakpoint-xs`.)
 */
export const BREAKPOINTS = {
  xs: 400,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // server / pre-hydration snapshot
  );
}

/** `true` at or above the given breakpoint (min-width). */
export function useMinWidth(bp: BreakpointKey): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}

/** `true` below the given breakpoint (max-width, sub-pixel to avoid overlap). */
export function useMaxWidth(bp: BreakpointKey): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS[bp] - 0.02}px)`);
}

/**
 * Semantic device bands used across the responsive sweep:
 *   mobile  ≤ 639px · tablet 640–1023px · desktop ≥ 1024px
 */
export function useBreakpoint() {
  const isMobile = useMaxWidth("sm"); // < 640
  const isDesktop = useMinWidth("lg"); // ≥ 1024
  return {
    isMobile,
    isTablet: !isMobile && !isDesktop, // 640–1023
    isDesktop,
    /** mobile OR tablet — i.e. anything below the desktop solar-system threshold */
    isCompact: !isDesktop,
  };
}

/** Coarse pointer (touch). Use to disable hover-only / parallax affordances. */
export function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
