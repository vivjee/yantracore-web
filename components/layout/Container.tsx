import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Width = "narrow" | "default" | "wide" | "full";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: Width;
  /** Skip default horizontal padding (px-6 md:px-8). */
  noPadding?: boolean;
  children: ReactNode;
}

const widthClass: Record<Width, string> = {
  narrow: "max-w-[720px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
  full: "max-w-full",
};

/**
 * Container — width-clamped wrapper with default horizontal padding.
 * Use `width` to pick from the brand's container scale.
 */
export function Container({
  width = "default",
  noPadding,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        widthClass[width],
        !noPadding && "px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
