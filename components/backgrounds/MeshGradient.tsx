"use client";

import { cn } from "@/lib/utils/cn";

/**
 * MeshGradient — slow flowing color blobs.
 *
 * CSS-based for v1 (cheap, looks great). Will get an R3F shader version
 * for the hero scene in Phase 2 where we need more control.
 */
export function MeshGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -inset-1/4 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--accent-1) 35%, transparent) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, color-mix(in srgb, var(--accent-2) 25%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, color-mix(in srgb, var(--accent-3) 20%, transparent) 0%, transparent 55%)",
          filter: "blur(40px)",
          animation: "mesh-flow 18s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
