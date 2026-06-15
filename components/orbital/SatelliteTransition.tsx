"use client";

import { usePathname } from "next/navigation";

/**
 * SatelliteTransition — the seam where each orbital page's content
 * ("satellites") swaps around the persistent Sun. Keyed on the pathname so the
 * satellites re-mount (and the Sun above does NOT) when navigating between
 * orbital routes.
 *
 * The gentle entrance is CSS-only (`.orbital-satellites` → `orbital-satellites-in`
 * keyframes), which is the robust choice: it ships the page fully present in the
 * server HTML (no flash-of-invisible-content, readable with JS disabled), it
 * re-fires on each keyed re-mount, and it is neutralized by both the in-app and
 * OS-level reduced-motion settings.
 *
 * Phase 0+1 stops here. When a second orbital route joins the group (Projects in
 * Phase 2, Technologies/Activity in Phase 3) this wrapper becomes an
 * AnimatePresence + frozen-router boundary so the outgoing satellites scatter
 * out as the new set curves in — all without the Sun or frame ever participating.
 */
export function SatelliteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="orbital-satellites absolute inset-0 z-10">
      {children}
    </div>
  );
}
