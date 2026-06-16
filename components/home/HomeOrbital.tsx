"use client";

import { useRouter } from "next/navigation";
import { Boxes, Globe2, Info, Mail } from "lucide-react";
import { OrbitNode } from "./OrbitNode";
import { OrbitalHud } from "./OrbitalHud";
import { Rise } from "@/components/motion/Rise";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";
import { GlassButton } from "@/components/glass/GlassButton";
import { StellarOrbitIcon } from "@/components/chrome/NavIcons";
import { audioSynth } from "@/lib/audio";

/**
 * HomeOrbital — the new Home: a calm, one-screen navigation hub.
 *
 * The persistent Sun (the animated logo) is rendered by the orbital layout and
 * sits behind this layer. On large screens the satellites are arranged on a
 * single elliptical ORBIT around it, like planets holding station: one uniform
 * ring of the site's primary destinations — Projects, Technologies, Reach,
 * About, Contact — with the wordmark + CTAs nested in the open base of the ring.
 * (The product showcases — Jimbo, Restroverse, Shramdan — now live solely on the
 * Projects page; Home is pure wayfinding.)
 *
 * Each satellite is placed by its angle on the ring (polar `left/top` built from
 * the shared --orbit-rx / --orbit-ry radii) and drifts on a slow, independent
 * bob. The geometry is centred on the fixed Sun, so the heart never shifts when
 * navigating between orbital pages. Phones keep the compact grid below.
 */

/* The five destinations, in render order (also the mobile grid order). `angle`
   places each on the ring — measured from the 3-o'clock axis, CCW positive — and
   `side` chooses which edge anchors on the orbit (top = centred). The set is
   symmetric about the vertical axis: a crown node at 90°, then a mirrored pair
   on each side, leaving the whole lower wedge open for the centre copy. `bob`
   gives each its own drift so they never move in unison. */
const SATELLITES = [
  { name: "Projects",     tagline: "Things we've shipped",     href: "/projects",     accent: "var(--accent-2)",    Icon: Boxes,            side: "top",   angle: 90,  bob: { dur: "9.5s", delay: "-2s",   x: "0px",  y: "-9px"  } },
  { name: "Technologies", tagline: "The tools of the craft",   href: "/technologies", accent: "var(--accent-1)",    Icon: StellarOrbitIcon, side: "left",  angle: 140, bob: { dur: "8.5s", delay: "-4s",   x: "-5px", y: "-10px" } },
  { name: "Reach",        tagline: "How far our work travels", href: "/reach",        accent: "var(--accent-warm)", Icon: Globe2,           side: "left",  angle: 190, bob: { dur: "10s",  delay: "-2.5s", x: "-4px", y: "-7px"  } },
  { name: "About",        tagline: "The minds behind it",      href: "/about",        accent: "var(--accent-3)",    Icon: Info,             side: "right", angle: 40,  bob: { dur: "9s",   delay: "-3s",   x: "5px",  y: "-8px"  } },
  { name: "Contact",      tagline: "Let's build something",    href: "/contact",      accent: "var(--accent-2)",    Icon: Mail,             side: "right", angle: -10, bob: { dur: "11s",  delay: "-1s",   x: "6px",  y: "-6px"  } },
] as const;

/* ── Entrance choreography ────────────────────────────────────────────────
   A calm centre-outward bloom on mount (mirrors the StarSystem's reveal): the
   wordmark + CTAs settle first — the heart — then the satellites cascade in,
   each gliding outward from the Sun into its slot on the ring. All on the site's
   --ease-out-soft curve (see Rise). Reduced-motion renders it all at rest. */
const COPY_BASE = 0.08;  // s — eyebrow lands first
const COPY_STEP = 0.08;  // s — per line of the centre copy
const NODE_BASE = 0.5;   // s — the first satellite settles, just after the copy
const NODE_STEP = 0.09;  // s — per-satellite stagger around the ring
const COL_SLIDE = 16;    // px — each satellite glides outward from the Sun

/* ── Orbit geometry ───────────────────────────────────────────────────────
   Satellites are positioned by angle on a shared ellipse centred on the Sun.
   Angles are measured from the 3-o'clock axis, counter-clockwise positive. The
   set is symmetric about the vertical axis, with the whole lower wedge left open
   for the centre copy. Radii live in CSS (--orbit-rx / --orbit-ry) so they stay
   responsive; here we only feed in the per-node cos/sin. */
const DEG = Math.PI / 180;

/** Polar `left/top` for a satellite (anchored by its inner edge — or centred,
 *  for the top node — via the side modifier) plus the inward offset it enters
 *  from. */
function ringSlot(angleDeg: number, accent: string) {
  const a = angleDeg * DEG;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    style: {
      left: `calc(50% + (var(--orbit-rx) * ${cos.toFixed(4)}))`,
      top: `calc(var(--orbit-cy) - (var(--orbit-ry) * ${sin.toFixed(4)}))`,
      "--node-accent": accent,
    } as React.CSSProperties,
    inX: -cos * COL_SLIDE, // start nudged toward the Sun, settle outward
    inY: sin * COL_SLIDE,
  };
}

function CenterCopy({ compact = false, as = "h1" }: { compact?: boolean; as?: "h1" | "p" }) {
  const router = useRouter();

  const go = (href: string) => {
    audioSynth.playClick();
    router.push(href);
  };

  return (
    <div className="flex w-full max-w-[460px] flex-col items-center gap-3 px-4 text-center md:gap-4">
      <Rise delay={COPY_BASE}>
        <p
          className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] md:text-[11px] md:tracking-[0.26em]"
          style={{ color: "var(--text-mid)" }}
        >
          Technology for a Better World
        </p>
      </Rise>

      <Rise delay={COPY_BASE + COPY_STEP}>
        <YantraElectricTitle as={as} text="YantraCore" size={compact ? "lg" : "xl"} />
      </Rise>

      {!compact && (
        <Rise delay={COPY_BASE + COPY_STEP * 2}>
          <p className="max-w-[52ch] text-sm leading-relaxed" style={{ color: "var(--text-low)" }}>
            At YantraCore, we transform bold ideas into powerful digital products - apps,
            platforms, and intelligent systems that are fast, elegant, practical, and built to
            make life simpler, work smarter, and communities stronger.
          </p>
        </Rise>
      )}

      <Rise
        delay={COPY_BASE + COPY_STEP * 3}
        className="mt-1 flex flex-wrap items-center justify-center gap-2.5"
      >
        <GlassButton
          variant="primary"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => go("/book")}
        >
          Start a Project
        </GlassButton>
      </Rise>
    </div>
  );
}

export function HomeOrbital() {
  return (
    <section className="relative h-full w-full overflow-hidden" aria-label="YantraCore — home">
      {/* Ambient mission-control HUD framing the empty space (desktop only) */}
      <OrbitalHud />

      {/* ── DESKTOP / TABLET — the orbit ring (md+) ───────────────────── */}
      <nav className="home-orbit" aria-label="Explore YantraCore">
        {/* The orbit path the satellites ride (decorative). */}
        <span className="home-orbit__path" aria-hidden />

        {/* Sun hover sensor — a centred disc over the logo. The persistent Sun is
            pointer-events:none and sits beneath this layer, so it can't feel the
            cursor itself; hovering this disc 'wakes' it (the rings brighten and a
            soft bloom rises behind the logo) via CSS :has on .orbital-stage.
            Purely decorative — the logo isn't a link. */}
        <span className="home-orbit__sun-sense" aria-hidden />

        {/* The satellites, placed by angle on the ring. */}
        <ul className="home-orbit__ring">
          {SATELLITES.map((planet, i) => {
            const { side, angle, bob, ...node } = planet;
            const { style, inX, inY } = ringSlot(angle, node.accent);
            return (
              <li key={node.name} className={`home-orbit__planet home-orbit__planet--${side}`} style={style}>
                <div
                  className="home-orbit__float"
                  style={{ "--bob-dur": bob.dur, "--bob-delay": bob.delay, "--bob-x": bob.x, "--bob-y": bob.y } as React.CSSProperties}
                >
                  <Rise delay={NODE_BASE + i * NODE_STEP} x={inX} y={inY}>
                    <OrbitNode {...node} />
                  </Rise>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Centre copy — the Sun shows through behind it; nested in the open base
          of the orbit ring (md+). */}
      <div className="home-orbit-copy">
        <CenterCopy />
      </div>

      {/* ── MOBILE ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-end px-5 pb-6 md:hidden">
        {/* Mobile copy uses a <p> wordmark so the page keeps a single <h1>
            (the desktop CenterCopy). Both are display-toggled, both in the DOM. */}
        <div className="pointer-events-auto mb-5">
          <CenterCopy compact as="p" />
        </div>
        {/* Flex-wrap (not a grid) so the odd fifth tile centres on its own row
            instead of stranding in a column. */}
        <div className="pointer-events-auto flex w-full max-w-[360px] flex-wrap justify-center gap-2.5">
          {SATELLITES.map((node, i) => (
            <Rise
              key={node.name}
              delay={NODE_BASE + i * (NODE_STEP * 0.6)}
              y={14}
              className="w-[calc(50%-5px)]"
            >
              <OrbitNode {...node} className="orbital-node--compact" />
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
