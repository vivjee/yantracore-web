import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";
type Size = "sm" | "md";

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  children: ReactNode;
  /** Semantic color. Default neutral. */
  tone?: Tone;
  /** Show a leading status dot. Default false. */
  dot?: boolean;
  /** Animate the dot with a soft pulse (implies dot). Default false. */
  pulse?: boolean;
  /** Default md. */
  size?: Size;
}

const toneColor: Record<Tone, string> = {
  neutral: "var(--text-mid)",
  accent: "var(--accent-1)",
  success: "var(--accent-2)",
  warning: "var(--accent-warm)",
  danger: "#FB7185",
};

const sizeClass: Record<Size, string> = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
};

/**
 * Badge — a status indicator with an optional (optionally pulsing) dot.
 * For states like "Live", "New", "Beta", counts, or availability.
 * Distinct from Tag: Badge signals state; Tag labels metadata.
 */
export function Badge({
  children,
  tone = "neutral",
  dot = false,
  pulse = false,
  size = "md",
  className,
  style,
  ...props
}: BadgeProps) {
  const c = toneColor[tone];
  const showDot = dot || pulse;

  const toneStyle: CSSProperties = {
    color: c,
    borderColor: `color-mix(in srgb, ${c} 35%, transparent)`,
    background: `color-mix(in srgb, ${c} 12%, transparent)`,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium leading-none whitespace-nowrap",
        sizeClass[size],
        className
      )}
      style={{ ...toneStyle, ...style }}
      {...props}
    >
      {showDot && (
        <span
          aria-hidden
          className={cn("rounded-full", pulse && "animate-pulse")}
          style={{
            width: 6,
            height: 6,
            background: "currentColor",
            boxShadow: `0 0 6px 1px color-mix(in srgb, ${c} 60%, transparent)`,
          }}
        />
      )}
      {children}
    </span>
  );
}
