"use client";

import { StarSystem } from "@/components/motion/StarSystem";

/**
 * Technologies ( /technologies ) — now an ORBITAL route.
 *
 * Folded into the (orbital) group so navigating to/from Home & Projects is
 * seamless (shared TV frame + chrome, no CRT glitch). StarSystem is a
 * self-contained star-map with its OWN centre star and an opaque backdrop, so
 * it renders as the satellite layer above the persistent Sun (which it covers).
 * That sidesteps the scale mismatch between the big Home Sun and the small
 * star-map core — the star-map stays exactly as tuned.
 */
export default function TechnologiesPage() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <StarSystem onCenterClick={() => {}} />
    </div>
  );
}
