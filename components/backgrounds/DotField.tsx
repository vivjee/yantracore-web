"use client";

import { cn } from "@/lib/utils/cn";

/**
 * DotField — slowly drifting dot grid with a radial mask so edges fade.
 * Cheap, GPU-friendly. Used in capabilities and lab sections.
 */
export function DotField({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute -inset-[20%]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 75%)",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 75%)",
          animation: "dot-drift 30s linear infinite",
        }}
      />
    </div>
  );
}
