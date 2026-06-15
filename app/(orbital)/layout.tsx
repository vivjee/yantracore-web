import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Sun } from "@/components/orbital/Sun";
import { SatelliteTransition } from "@/components/orbital/SatelliteTransition";

/**
 * Orbital route group layout — the persistent shell.
 *
 * This is a Server Component, so every page inside the group ( / , and later
 * /projects, /technologies, /activity ) stays server-rendered with its own
 * metadata. But because Next.js preserves a shared layout across soft
 * navigations between its children, this layout — and everything it renders —
 * mounts exactly ONCE and never re-mounts while you move between orbital pages:
 *
 *   • SiteBackground  → its slow ambient animations keep running (no restart).
 *   • TvFrame         → the CRT shell stays put across navigations.
 *   • Sun             → the animated logo at the centre never changes.
 *
 * Only {children} — the satellites for the current route — swap, via
 * SatelliteTransition. That is the whole point of the makeover: the heart
 * stays still while the constellation around it reassembles.
 */
export default function OrbitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="orbital-stage">
          <Sun />
          <SatelliteTransition>{children}</SatelliteTransition>
        </div>
      </TvFrame>
    </>
  );
}
