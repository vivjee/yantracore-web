"use client";

/**
 * OrbitalRings — three concentric SVG rings (plus a counter-rotating tick ring)
 * that spin at different speeds and directions, giving the "solar system" feel
 * around the central Sun. Extracted from the original Showcase scene so both the
 * Home hub and (later) the Technologies / Projects constellations can share one
 * canonical ring system around the persistent logo.
 *
 * CENTRING — every ring shares ONE hub: the logo's centre (50% / 44%, matching
 * LogoMark's centerY, the node orbit's --orbit-cy, and this layer's
 * transform-origin). Each ring lives in a box centred on that hub via
 * translate(-50%, -50%); the spin runs on an INNER element so the animated
 * rotate() never clobbers the centring translate. The result is provably
 * concentric with the Sun on every viewport.
 *
 * Pure decoration: pointer-events-none, aria-hidden. Motion is CSS-only
 * (ring-spin-cw / ring-spin-ccw keyframes), so the in-app reduced-motion toggle
 * (`html.prefers-reduced-motion`, applied globally with !important) stops it.
 * (The OS-level `@media (prefers-reduced-motion: reduce)` block is scoped to
 * specific selectors and doesn't yet cover these inline-animated rings — a
 * site-wide a11y item shared with LogoMark, tracked for a later pass.)
 */
export function OrbitalRings() {
  return (
    <div
      className="orbital-rings absolute inset-0 z-[2] pointer-events-none"
      aria-hidden
    >
      {/* The shared hub — the logo's centre. Every ring centres on this point. */}
      <div className="absolute left-1/2 top-[44%]">
        {/* Ring 1 — fastest, innermost */}
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <div style={{ animation: "ring-spin-cw 18s linear infinite" }}>
            <svg width="480" height="480" viewBox="0 0 480 480">
              <ellipse
                cx="240" cy="240" rx="228" ry="90"
                fill="none" stroke="url(#orbital-ring-grad-1)" strokeWidth="1" strokeDasharray="6 14"
              />
              <defs>
                <linearGradient id="orbital-ring-grad-1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(110,86,255,0)" />
                  <stop offset="40%" stopColor="rgba(110,86,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(0,224,203,0.5)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Ring 2 — medium, counter-rotating */}
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <div style={{ animation: "ring-spin-ccw 28s linear infinite" }}>
            <svg width="660" height="660" viewBox="0 0 660 660">
              <ellipse
                cx="330" cy="330" rx="318" ry="126"
                fill="none" stroke="url(#orbital-ring-grad-2)" strokeWidth="1" strokeDasharray="3 18" opacity="0.65"
              />
              <defs>
                <linearGradient id="orbital-ring-grad-2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0,224,203,0)" />
                  <stop offset="50%" stopColor="rgba(0,224,203,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,79,176,0.4)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Ring 3 — slow, outermost circle, pure dashes */}
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <div style={{ animation: "ring-spin-cw 44s linear infinite" }}>
            <svg width="860" height="860" viewBox="0 0 860 860">
              <circle
                cx="430" cy="430" r="418"
                fill="none" stroke="rgba(110,86,255,0.09)" strokeWidth="1" strokeDasharray="2 22"
              />
            </svg>
          </div>
        </div>

        {/* Tick marks riding ring 3, counter-rotating around the shared hub.
            Each tick pivots about the hub (transform-origin 0 0) then is pushed
            out to the ring radius — so the tick ring is exactly concentric with
            the rest, not offset. */}
        <div className="absolute left-0 top-0" style={{ animation: "ring-spin-ccw 44s linear infinite" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 top-0"
              style={{
                width: 2,
                height: i % 6 === 0 ? 10 : 5,
                background: i % 6 === 0 ? "rgba(0,224,203,0.5)" : "rgba(110,86,255,0.3)",
                borderRadius: 1,
                transformOrigin: "0 0",
                transform: `rotate(${(360 / 24) * i}deg) translate(-1px, -430px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
