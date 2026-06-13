import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "low" | "mid" | "accent";

interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div";
  tone?: Tone;
  children: ReactNode;
}

const toneClass: Record<Tone, string> = {
  low: "text-text-low",
  mid: "text-text-mid",
  accent: "text-accent-1",
};

/**
 * Eyebrow — small mono uppercase label. The "01 — Section name" pattern.
 * Used liberally throughout the site as scene markers.
 */
export function Eyebrow({
  as: Component = "p",
  tone = "low",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={cn(
        "font-mono text-xs uppercase tracking-[0.2em]",
        toneClass[tone],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
