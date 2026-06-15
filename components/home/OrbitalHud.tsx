"use client";

import { useEffect, useState } from "react";

/**
 * OrbitalHud — the ambient "mission-control" instrumentation that frames the
 * Home hub. The orbital screen is a single, height-locked viewport with a lot of
 * deliberate negative space around the central Sun; rather than crowd that calm
 * with more cards, this overlay turns the empty corners and side gutters into a
 * quiet observatory HUD that reinforces the CRT / orbital identity:
 *
 *   • Viewfinder corner brackets — frame the screen like a scope.
 *   • A bottom telemetry strip   — a live status pulse, a running local clock,
 *                                  and an `ORBITAL HUB / CH·00` tag that slots
 *                                  Home into the existing channel metaphor
 *                                  (the product channels are CH-01…CH-04).
 *   • Vertical edge spines        — micro-type restating the value prop in the
 *                                  wide side gutters (xl screens only).
 *
 * Entirely decorative: the root is aria-hidden and pointer-events-none, so it
 * never steals focus or clicks from the satellites layered above it. Hidden on
 * mobile (the compact layout owns that space) and on very short viewports, where
 * the height lock would otherwise clip it into the centre copy.
 */
export function OrbitalHud() {
  const clock = useClock();

  return (
    <div className="orbital-hud" aria-hidden>
      {/* Viewfinder corners */}
      <span className="orbital-hud__corner orbital-hud__corner--tl" />
      <span className="orbital-hud__corner orbital-hud__corner--tr" />
      <span className="orbital-hud__corner orbital-hud__corner--bl" />
      <span className="orbital-hud__corner orbital-hud__corner--br" />

      {/* Side spines — the value prop, set in the gutters (xl only) */}
      <span className="orbital-hud__spine orbital-hud__spine--left">
        Building for companies &amp; communities
      </span>
      <span className="orbital-hud__spine orbital-hud__spine--right">
        Software · AI · Infrastructure
      </span>

      {/* Bottom telemetry strip */}
      <div className="orbital-hud__strip">
        <span className="orbital-hud__readout">
          <span className="orbital-hud__pulse" />
          Systems Nominal
          <span className="orbital-hud__sep">/</span>
          <span className="orbital-hud__dim">Local</span>
          <span className="orbital-hud__clock">{clock ?? "––:––:––"}</span>
        </span>
        <span className="orbital-hud__readout orbital-hud__readout--right">
          Orbital Hub
          <span className="orbital-hud__sep">/</span>
          <span className="orbital-hud__dim">CH·00</span>
        </span>
      </div>
    </div>
  );
}

/**
 * A ticking wall clock in the visitor's local time. Starts null so the server
 * and first client render agree (both show the placeholder), then fills in after
 * mount — no hydration mismatch. The interval lives only while the orbital screen
 * is powered on, since TvFrame unmounts its children when powered off.
 */
function useClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());

    const tick = () => setTime(format());
    // First paint on the next frame (not synchronously in the effect body) so
    // the clock fills in immediately while staying hydration-safe.
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return time;
}
