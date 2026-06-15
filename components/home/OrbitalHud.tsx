"use client";

import { Fragment, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * OrbitalHud — the ambient "mission-control" instrumentation that frames the
 * Home hub. The orbital screen is a single, height-locked viewport with a lot of
 * deliberate negative space around the central Sun; rather than crowd that calm
 * with more cards, this overlay turns the empty corners and side gutters into a
 * quiet observatory HUD that reinforces the CRT / orbital identity:
 *
 *   • Viewfinder corner brackets — frame the screen like a scope.
 *   • A bottom telemetry strip   — a live status pulse with a `YantraCore / Home`
 *                                  brand readout on the left, and the visitor's
 *                                  local timezone + a running clock on the right.
 *   • Vertical edge spines        — micro-type in the wide side gutters (xl only):
 *                                  the left spine names who we build for as a
 *                                  live telemetry channel — Individuals ·
 *                                  Companies · Communities, scanning one lit at a
 *                                  time; the right restates the capability stack.
 *
 * Entirely decorative: the root is aria-hidden and pointer-events-none, so it
 * never steals focus or clicks from the satellites layered above it. Hidden on
 * mobile (the compact layout owns that space) and on very short viewports, where
 * the height lock would otherwise clip it into the centre copy.
 */
/** Who we build for — the left spine cycles a lit highlight across these, one at
 *  a time, like a scanning telemetry channel. The whole triad is always present
 *  (legible, not just an animation); the scan only moves the emphasis. */
const AUDIENCES = ["Individuals", "Companies", "Communities"] as const;
const AUDIENCE_DWELL = 3000; // ms each audience stays lit

export function OrbitalHud() {
  const clock = useClock();
  const lit = useAudienceScan();

  return (
    <div className="orbital-hud" aria-hidden>
      {/* Viewfinder corners */}
      <span className="orbital-hud__corner orbital-hud__corner--tl" />
      <span className="orbital-hud__corner orbital-hud__corner--tr" />
      <span className="orbital-hud__corner orbital-hud__corner--bl" />
      <span className="orbital-hud__corner orbital-hud__corner--br" />

      {/* Side spines — the value prop, set in the gutters (xl only). Left names
          who we build for as a live scan; right restates the capability stack. */}
      <span
        className={`orbital-hud__spine orbital-hud__spine--left${lit < 0 ? " is-static" : ""}`}
      >
        {AUDIENCES.map((who, i) => (
          <Fragment key={who}>
            {i > 0 && <span className="orbital-hud__spine-sep">·</span>}
            <span className={`orbital-hud__audience${i === lit ? " is-active" : ""}`}>
              {who}
            </span>
          </Fragment>
        ))}
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
          <span className="orbital-hud__dim">{clock?.zone ?? "—"}</span>
          <span className="orbital-hud__clock">{clock?.time ?? "––:––:––"}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Drives the left spine's scanning highlight: returns the index of the currently
 * lit audience, advancing every AUDIENCE_DWELL ms. Returns -1 when the user
 * prefers reduced motion (and until mount, so SSR/first paint agree) — the spine
 * then renders the full triad evenly lit and still, no scan.
 */
function useAudienceScan() {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (reduced) {
      // Settle to the static (evenly-lit) state on the next frame — never
      // synchronously in the effect body — in case the scan was already running.
      const raf = requestAnimationFrame(() => setLit(-1));
      return () => cancelAnimationFrame(raf);
    }
    // Light the first audience on the next frame, then scan on a fixed cadence.
    const raf = requestAnimationFrame(() => setLit(0));
    const id = setInterval(
      () => setLit((i) => (i + 1) % AUDIENCES.length),
      AUDIENCE_DWELL,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [reduced]);

  return lit;
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
