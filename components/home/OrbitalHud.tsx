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
 *   • A bottom telemetry strip   — a live status pulse with a `YantraCore / Home`
 *                                  brand readout, and an `Orbital Hub / CH·00`
 *                                  tag carrying the visitor's local timezone +
 *                                  running clock (the channel code slots Home into
 *                                  the existing CH-01…CH-04 metaphor).
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
          YantraCore
          <span className="orbital-hud__sep">/</span>
          <span className="orbital-hud__dim">Home</span>
        </span>
        <span className="orbital-hud__readout orbital-hud__readout--right">
          Orbital Hub
          <span className="orbital-hud__sep">/</span>
          <span className="orbital-hud__dim">CH·00</span>
          <span className="orbital-hud__sep">/</span>
          <span className="orbital-hud__dim">{clock?.zone ?? "—"}</span>
          <span className="orbital-hud__clock">{clock?.time ?? "––:––:––"}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * The visitor's local timezone + a ticking wall clock. Starts null so the server
 * and first client render agree (both show the placeholder), then fills in after
 * mount — no hydration mismatch. The interval lives only while the orbital screen
 * is powered on, since TvFrame unmounts its children when powered off.
 */
function useClock() {
  const [clock, setClock] = useState<{ time: string; zone: string } | null>(null);

  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }).formatToParts(new Date());

      const zone = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
      const time = parts
        .filter((p) => p.type !== "timeZoneName")
        .map((p) => p.value)
        .join("")
        .trim();
      return { time, zone };
    };

    const tick = () => setClock(read());
    // First paint on the next frame (not synchronously in the effect body) so
    // the clock fills in immediately while staying hydration-safe.
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return clock;
}
