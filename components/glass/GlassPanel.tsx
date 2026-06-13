import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "light" | "medium" | "heavy";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * GlassPanel — non-interactive glass surface for nav bars, modals,
 * banners. No hover effects. Use GlassCard for interactive surfaces.
 */
export function GlassPanel({
  variant = "heavy",
  className,
  children,
  ...props
}: GlassPanelProps) {
  const variantClass = {
    light: "glass-light",
    medium: "glass-medium",
    heavy: "glass-heavy",
  }[variant];

  return (
    <div className={cn(variantClass, "rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}
