"use client";

import Link, { useLinkStatus } from "next/link";
import { createPortal } from "react-dom";
import type { ComponentProps } from "react";

/**
 * Thin, non-blocking navigation progress bar.
 *
 * Background: we removed the global full-screen `app/loading.tsx` overlay. That
 * overlay painted an opaque sheet (`fixed inset-0 bg-ink-0`) over the entire UI —
 * chrome bar included — every time a route suspended. In dev that happens on the
 * FIRST visit to each route (Next compiles routes on demand), so the first hop to
 * a page read as a full-page "blink"/reload, navbar and all. Without the overlay,
 * the router simply keeps the current page visible until the next one is ready,
 * which is the seamless behaviour we want.
 *
 * The only thing the overlay gave us was feedback on a slow navigation. This bar
 * restores that feedback WITHOUT ever covering the navbar: `useLinkStatus`
 * reports the pending state of its parent <Link>, and we portal a 2px accent bar
 * to <body> so the frame's transforms can't trap its `position: fixed`.
 */
function NavLinkProgress() {
  const { pending } = useLinkStatus();
  if (!pending || typeof document === "undefined") return null;
  return createPortal(<span className="route-progress" aria-hidden />, document.body);
}

/**
 * Drop-in replacement for next/link used by the primary navigation. Behaves
 * exactly like <Link>; it just also renders the pending-state progress bar so a
 * slow route switch shows a sliver of motion instead of nothing.
 */
export function NavLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <NavLinkProgress />
    </Link>
  );
}
