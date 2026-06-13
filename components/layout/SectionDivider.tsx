/**
 * SectionDivider — an almost-invisible horizontal rule between sections.
 *
 * A left-to-right linear gradient line at ~0.5px height, transparent at the
 * edges and barely-perceptible at the centre. It reads as a seam — not a wall.
 * The background shines through entirely so it never disturbs the animation.
 */
export function SectionDivider() {
  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: "1px",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        /* Half-pixel visual weight via opacity, not scale, so subpixel AA stays clean */
        opacity: 0.55,
        pointerEvents: "none",
        flexShrink: 0,
      }}
    />
  );
}
