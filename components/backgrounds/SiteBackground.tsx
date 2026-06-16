/**
 * SiteBackground — the one animated canvas that lives behind the entire page.
 *
 * Layers (back → front):
 *   0  Solid ink-0 base
 *   1  Mesh gradient blobs (slow-drifting colored radials)
 *   2  Scan-line grid (very faint orthogonal lines — "control room" feel)
 *   3  Volumetric light cones (violet / cyan / pink)
 *   4  Edge vignette (keeps the canvas feeling bounded)
 *   5  Starfield
 *
 * Uses `position: fixed` so it never moves while the user scrolls.
 * Sections sit on top with `position: relative` and transparent backgrounds.
 */
export function SiteBackground() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.round(((i * 137.508 + 23) % 97) * 1.03),
    y: Math.round(((i * 73.1 + 11) % 91) * 1.1),
    size: i % 5 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,
    dur: 3 + (i % 7),
    delay: (i * 0.37) % 6,
    opacity: 0.12 + (i % 6) * 0.07,
  }));

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "var(--ink-0)" }}
    >
      {/* ── Layer 1: Mesh gradient blobs ── */}
      <div
        className="site-bg-fx absolute -inset-1/4 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--accent-1) 35%, transparent) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 30%, color-mix(in srgb, var(--accent-2) 25%, transparent) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 50% 80%, color-mix(in srgb, var(--accent-3) 20%, transparent) 0%, transparent 55%)",
          filter: "blur(40px)",
          animation: "mesh-flow 18s ease-in-out infinite alternate",
        }}
      />

      {/* ── Layer 2: Scan-line grid ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Layer 3: Volumetric light cones ── */}
      {/* Primary violet cone — upper left */}
      <div
        className="site-bg-fx absolute w-[700px] h-[700px] rounded-full"
        style={{
          left: "5%",
          top: "-15%",
          background:
            "radial-gradient(circle, rgba(110, 86, 255, 0.30) 0%, transparent 58%)",
          filter: "blur(80px)",
          animation: "light-drift 20s ease-in-out infinite alternate",
        }}
      />
      {/* Cyan cone — upper right */}
      <div
        className="site-bg-fx absolute w-[560px] h-[560px] rounded-full"
        style={{
          right: "0%",
          top: "0%",
          background:
            "radial-gradient(circle, rgba(0, 224, 203, 0.22) 0%, transparent 58%)",
          filter: "blur(80px)",
          animation: "light-drift 26s ease-in-out infinite alternate-reverse",
        }}
      />
      {/* Pink accent — mid-right */}
      <div
        className="site-bg-fx absolute w-[400px] h-[400px] rounded-full"
        style={{
          right: "20%",
          top: "55%",
          background:
            "radial-gradient(circle, rgba(255, 79, 176, 0.12) 0%, transparent 58%)",
          filter: "blur(70px)",
          animation: "light-drift 16s ease-in-out infinite alternate",
          animationDelay: "3s",
        }}
      />
      {/* Violet — lower left */}
      <div
        className="site-bg-fx absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: "-5%",
          bottom: "10%",
          background:
            "radial-gradient(circle, rgba(110, 86, 255, 0.18) 0%, transparent 58%)",
          filter: "blur(90px)",
          animation: "light-drift 22s ease-in-out infinite alternate",
          animationDelay: "7s",
        }}
      />

      {/* ── Layer 4: Soft edge vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(6,7,13,0.65) 100%)",
        }}
      />

      {/* ── Layer 5: Starfield ── */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((s) => (
          <div
            key={s.id}
            className={`absolute star-drift-container star-drift-${(s.id % 3) + 1}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDuration: `${s.dur * 5}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <div
              className="rounded-full star-particle"
              style={{
                width: s.size,
                height: s.size,
                background:
                  s.id % 3 === 0
                    ? "var(--particle-color-1)"
                    : s.id % 3 === 1
                    ? "var(--particle-color-2)"
                    : "var(--particle-color-3)",
                opacity: s.opacity,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
                "--tw-opacity": s.opacity,
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
