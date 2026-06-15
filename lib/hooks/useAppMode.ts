"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * useAppMode — true when the UI is in "app mode", i.e. a `TvFrame` is mounted
 * (which sets `body.app-mode-active`) or we're under `/dashboard`. Mirrors the
 * detection `Header` uses to hide the brochure nav, so off-page chrome can pick
 * the right surface (inline TV-chrome controls vs. the floating dock).
 *
 * Returns false during SSR / first paint, then syncs on mount and reacts to
 * body-class changes via a MutationObserver.
 */
export function useAppMode(): boolean {
  const pathname = usePathname();
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsAppMode(
        document.body.classList.contains("app-mode-active") ||
          (pathname?.startsWith("/dashboard") ?? false)
      );

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [pathname]);

  return isAppMode;
}
