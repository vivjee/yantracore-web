"use client";

import React from "react";

interface YantraElectricTitleProps {
  /** The text to display. Defaults to "YantraCore". */
  text?: string;
  /** Size preset for the text. If specified, overrides/determines the font size. */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  /** CSS font-size value. Fallback / custom override. */
  fontSize?: string;
  /** Additional class names. */
  className?: string;
  /** HTML tag to render. Defaults to "span" for inline use. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

const sizeMap = {
  xs: "0.75rem",
  sm: "0.9rem",
  md: "1.1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "clamp(2rem, 4vw, 3rem)",
  "3xl": "clamp(2.25rem, 5vw, 4.25rem)",
  "4xl": "clamp(3rem, 7vw, 5.5rem)",
  "5xl": "clamp(4rem, 10vw, 7.5rem)",
};

/**
 * YantraElectricTitle
 *
 * Shared component for the electric gradient + scan-line + flicker title
 * used on the homepage solar-system scene. Accepts size / tag props so
 * it can be dropped in at any scale (hero -> header wordmark).
 *
 * The CSS pseudo-elements (::before / ::after) receive their text content
 * via the `data-text` attribute so the animation labels always match the
 * rendered text, regardless of the `text` prop.
 */
export function YantraElectricTitle({
  text = "YantraCore",
  size,
  fontSize,
  className = "",
  as: Tag = "span",
}: YantraElectricTitleProps) {
  const resolvedFontSize = fontSize || (size ? sizeMap[size] : "clamp(2.25rem, 5vw, 4.25rem)");

  return (
    <Tag
      className={`yantra-electric-title font-bold ${className}`}
      style={{ fontSize: resolvedFontSize }}
      // Passed to CSS ::before / ::after via attr(data-text)
      data-text={text}
    >
      {text}
    </Tag>
  );
}
