"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

/** The site's signature soothing curve — the same cubic-bezier `Reveal`, the
 *  glass surfaces, and the StarSystem entrance all ride. */
const RISE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RiseProps extends HTMLMotionProps<"div"> {
  /** Stagger handle — seconds to wait before this item enters. Default 0. */
  delay?: number;
  /** Travel distance on the Y axis (px). Element rises from y → 0. Default 18. */
  y?: number;
  /** Optional X travel (px) for a subtle slide-in from a side. Default 0. */
  x?: number;
  /** Entrance duration (s). Default 0.7 — cinematic-soothing. */
  duration?: number;
}

/**
 * Rise — a fade + translate entrance that fires once on mount.
 *
 * The mount-time sibling of {@link Reveal} (which waits for scroll). Use it to
 * choreograph a staggered reveal of a screenful of items that are all visible
 * at once — give each a slightly larger `delay` and they bloom in sequence.
 *
 * Respects prefers-reduced-motion: renders its children at rest, instantly.
 * Animates opacity + transform only, so it never shifts layout (no CLS) and the
 * children ship present in the server HTML for crawlers.
 */
export function Rise({
  children,
  delay = 0,
  y = 18,
  x = 0,
  duration = 0.7,
  ...rest
}: RiseProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <motion.div {...rest}>{children}</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, ease: RISE_EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
