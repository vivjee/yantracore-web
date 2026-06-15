import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "accent";
type Shape = "pill" | "square";
type Size = "xs" | "sm" | "md";

interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  children: ReactNode;
  /** neutral = white-on-glass; accent = tinted with `accentColor`. Default neutral. */
  tone?: Tone;
  /** Any CSS color. Only used when tone="accent". Default var(--accent-1). */
  accentColor?: string;
  /** pill = rounded-full (metadata/tech), square = rounded-lg (stack chips). Default pill. */
  shape?: Shape;
  /** xs = micro card chip, sm = default, md = standalone strip. Default sm. */
  size?: Size;
}

const sizeClass: Record<Size, string> = {
  xs: "text-[9px] px-2 py-0.5",
  sm: "text-[10px] px-2.5 py-1",
  md: "text-xs px-3 py-1.5",
};

const shapeClass: Record<Shape, string> = {
  pill: "rounded-full",
  square: "rounded-lg",
};

/**
 * Tag — the small mono-uppercase chip used for tech labels, categories,
 * and metadata. The single source for the pill/chip pattern that was
 * previously inlined across Work, Capabilities, and the project cards.
 */
export function Tag({
  children,
  tone = "neutral",
  accentColor = "var(--accent-1)",
  shape = "pill",
  size = "sm",
  className,
  style,
  ...props
}: TagProps) {
  const accentStyle: CSSProperties | undefined =
    tone === "accent"
      ? {
          color: accentColor,
          borderColor: `color-mix(in srgb, ${accentColor} 35%, transparent)`,
          background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
        }
      : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center border font-mono uppercase tracking-wider whitespace-nowrap leading-none",
        sizeClass[size],
        shapeClass[shape],
        tone === "neutral" && "border-white/10 bg-white/[0.03] text-text-low",
        className
      )}
      style={{ ...accentStyle, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
