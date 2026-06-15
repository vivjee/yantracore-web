"use client";

/**
 * OrbitalRings — three concentric SVG rings (plus a tick ring) that rotate at
 * different speeds and directions, giving the "solar system" feel around the
 * central Sun. Extracted from the original Showcase scene so both the Home hub
 * and (later) the Technologies / Projects constellations can share one
 * canonical ring system around the persistent logo.
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
      className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center"
      aria-hidden
    >
      {/* Ring 1 — fastest, innermost */}
      <div className="absolute" style={{ animation: "ring-spin-cw 18s linear infinite" }}>
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

      {/* Ring 2 — medium, tilted for 3D depth */}
      <div
        className="absolute"
        style={{ animation: "ring-spin-ccw 28s linear infinite", transform: "rotateX(65deg)" }}
      >
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

      {/* Ring 3 — slow, outermost circle, pure dashes */}
      <div className="absolute" style={{ animation: "ring-spin-cw 44s linear infinite" }}>
        <svg width="860" height="860" viewBox="0 0 860 860">
          <circle
            cx="430" cy="430" r="418"
            fill="none" stroke="rgba(110,86,255,0.09)" strokeWidth="1" strokeDasharray="2 22"
          />
        </svg>
      </div>

      {/* Tick marks on ring 3, counter-rotating */}
      <div className="absolute" style={{ animation: "ring-spin-ccw 44s linear infinite" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 2,
              height: i % 6 === 0 ? 10 : 5,
              background: i % 6 === 0 ? "rgba(0,224,203,0.5)" : "rgba(110,86,255,0.3)",
              borderRadius: 1,
              left: "50%",
              top: 0,
              transformOrigin: "1px 430px",
              transform: `rotate(${(360 / 24) * i}deg) translateX(-50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
