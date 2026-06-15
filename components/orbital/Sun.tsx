"use client";

import { memo } from "react";
import { LogoMark } from "@/components/sections/01-arrival/LogoMark";
import { OrbitalRings } from "./OrbitalRings";

/**
 * Sun — the persistent centre of the orbital route group.
 *
 * This component is rendered ONCE by the orbital layout (app/(orbital)/layout.tsx)
 * and is intentionally NOT part of any individual page. Because the layout is
 * preserved across soft navigations between orbital routes, the Sun mounts a
 * single time and never re-mounts — its slow CSS animations and the LogoMark's
 * effects keep running continuously while only the satellites around it swap.
 * That is the mechanism behind the seamless, "the heart never changes"
 * transition between Home / Projects / Technologies / Activity.
 *
 * It is memoized so layout re-renders (e.g. when children change) never re-run
 * the LogoMark. It is purely ambient — pointer-events-none — so the satellites,
 * copy, and CTAs layered above it always stay interactive.
 */
function SunBase() {
  return (
    <div className="orbital-sun" aria-hidden>
      <OrbitalRings />
      {/* Soft radial bloom behind the logo — invisible at rest. It rises (and the
          rings brighten) when the Home sense disc over the logo is hovered,
          driven purely by CSS :has, so the persistent Sun stays JS-free here. */}
      <span className="orbital-sun__bloom" aria-hidden />
      {/* parallax disabled: the Sun is pointer-events:none and never unmounts,
          so the cursor-tilt rAF would run forever doing nothing. */}
      <LogoMark centerY="44%" parallax={false} />
    </div>
  );
}

export const Sun = memo(SunBase);
