"use client";

import { cn } from "@/lib/utils/cn";

/**
 * LineWeave — animated SVG lines that gently drift vertically.
 * Inspired by the ptolemay.com animated background near the blog.
 * Used in the Lab Notes section.
 */
export function LineWeave({ className }: { className?: string }) {
  const lineCount = 8;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        <defs>
          <linearGradient id="weave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--accent-1)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {Array.from({ length: lineCount }).map((_, i) => (
          <path
            key={i}
            d={`M-100,${80 + i * 90} Q300,${30 + i * 100} 600,${
              140 + i * 80
            } T1300,${80 + i * 90}`}
            stroke="url(#weave-grad)"
            strokeWidth="1"
            fill="none"
            opacity={0.35 - i * 0.025}
            style={{
              animation: `weave-flow ${20 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * -1.5}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
