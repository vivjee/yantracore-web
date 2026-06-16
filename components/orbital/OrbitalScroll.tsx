"use client";

import { useEffect, useRef } from "react";

/**
 * OrbitalScroll — the internal scroll region for an orbital page whose content
 * is taller than the (non-scrolling) TV screen, e.g. /projects.
 *
 * The persistent Sun is rendered by the orbital layout and pinned behind the
 * satellites. Once this region scrolls off the top, the Sun would sit
 * distractingly behind the content scrolling over it (its logo lands right under
 * the section copy), so we toggle `is-scrolled` on the shared `.orbital-stage`;
 * CSS then dims the Sun (logo + animated rings/glow) with a transition. The
 * class is cleared on unmount, so navigating back to a non-scrolling orbital
 * page (Home) restores the Sun to full brightness.
 */
export function OrbitalScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current?.closest(".orbital-stage") as HTMLElement | null;
    return () => stage?.classList.remove("is-scrolled");
  }, []);

  const handleScroll = () => {
    const el = ref.current;
    const stage = el?.closest(".orbital-stage");
    if (!el || !stage) return;
    stage.classList.toggle("is-scrolled", el.scrollTop > 0);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className={`no-scrollbar relative z-10 h-full w-full overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}
