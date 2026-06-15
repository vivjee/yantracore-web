import type { IconBaseProps, IconType } from "react-icons";

/**
 * Custom tech icons for brands that `react-icons` doesn't ship.
 *
 * Adobe had Simple Icons (the source `react-icons/si` mirrors) remove all of
 * its marks for trademark reasons, so there is no `SiPhotoshop`. These are
 * neutral lettermark stand-ins that satisfy `IconType` — same call signature
 * as a react-icons glyph (honours `size`, `color`→currentColor, `title`,
 * `className`, `style`) so they drop straight into `techPlanets`/`GlowingOrb`.
 * Swap for an official SVG (e.g. dropped in `/public`) if/when desired.
 */

/** Photoshop — "Ps" app-tile monogram, rendered in currentColor. */
export const PhotoshopIcon: IconType = ({ size, color, title, className, style, ...rest }: IconBaseProps) => {
  const dim = size ?? "1em";
  return (
    <svg
      viewBox="0 0 24 24"
      width={dim}
      height={dim}
      className={className}
      style={{ color, ...style }}
      role="img"
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {/* Rounded app tile: faint fill + crisp currentColor border */}
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="currentColor" opacity={0.14} />
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="none" stroke="currentColor" strokeWidth={1.4} />
      {/* "Ps" lettermark */}
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
        fontSize="11"
        fontWeight={800}
        fill="currentColor"
      >
        Ps
      </text>
    </svg>
  );
};
