import { GalaxyField } from "@/components/backgrounds/GalaxyField";

/**
 * SiteBackground — the one animated canvas that lives behind the entire page.
 *
 * Layers (back → front):
 *   0  Solid ink-0 base
 *   1  Mesh gradient nebula (slow-drifting colored radials — toned down)
 *   2  Scan-line grid (very faint orthogonal lines — "control room" feel)
 *   3  Volumetric light cones (violet / cyan — toned down)
 *   4  Rotating galaxy of twinkling stars (WebGL, GalaxyField)
 *   5  Edge vignette (frames the canvas, fades the galaxy rim)
 *
 * The galaxy carries the colour and the stars now, so the legacy CSS nebula /
 * light cones are dialled back to a subtle ambient wash beneath it.
 *
 * Uses `position: fixed` so it never moves while the user scrolls.
 * Sections sit on top with `position: relative` and transparent backgrounds.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: "var(--ink-0)" }}
    >
      {/* ── Layer 1: Mesh gradient nebula (toned down — galaxy carries colour now) ── */}
      <div
        className="site-bg-fx absolute -inset-1/4 opacity-40"
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

      {/* ── Layer 3: Volumetric light cones (toned down ambient wash) ── */}
      {/* Primary violet cone — upper left */}
      <div
        className="site-bg-fx absolute w-[700px] h-[700px] rounded-full"
        style={{
          left: "5%",
          top: "-15%",
          background:
            "radial-gradient(circle, rgba(110, 86, 255, 0.20) 0%, transparent 58%)",
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
            "radial-gradient(circle, rgba(0, 224, 203, 0.14) 0%, transparent 58%)",
          filter: "blur(80px)",
          animation: "light-drift 26s ease-in-out infinite alternate-reverse",
        }}
      />
      {/* Violet — lower left */}
      <div
        className="site-bg-fx absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: "-5%",
          bottom: "10%",
          background:
            "radial-gradient(circle, rgba(110, 86, 255, 0.12) 0%, transparent 58%)",
          filter: "blur(90px)",
          animation: "light-drift 22s ease-in-out infinite alternate",
          animationDelay: "7s",
        }}
      />

      {/* ── Layer 4: Rotating galaxy of twinkling stars (WebGL) ── */}
      <GalaxyField />

      {/* ── Layer 5: Soft edge vignette — frames the canvas, fades the galaxy rim ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, transparent 38%, rgba(6,7,13,0.72) 100%)",
        }}
      />
    </div>
  );
}
