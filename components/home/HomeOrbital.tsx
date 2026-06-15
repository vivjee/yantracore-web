"use client";

import { useRouter } from "next/navigation";
import { Boxes, Info } from "lucide-react";
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
 * single elliptical ORBIT around it, like planets holding station:
 *   - Left arc   (Explore)      — where to go next: Projects, Technologies, About.
 *   - Right arc  (Our Projects) — the YantraCore initiatives: Jimbo, Restroverse,
 *                                 Shramdan. Calm portals; the live simulations
 *                                 they used to run now live on the Projects page.
 *   - Centre copy + CTAs        — who we are, nested in the open base of the ring.
 *
 * Each satellite is placed by its angle on the ring (polar `left/top` built from
 * the shared --orbit-rx / --orbit-ry radii) and drifts on a slow, independent
 * bob. The geometry is centred on the fixed Sun, so the heart never shifts when
 * navigating between orbital pages. Phones keep the compact 2-column grid.
 */

const INITIATIVES = [
  {
    name: "Jimbo",
    tagline: "24/7 AI business assistant",
    href: "/channels/jimbo",
    accent: "var(--accent-1)",
    logoImg: "/images/logo/jimbo_logo.png",
  },
  {
    name: "Restroverse",
    tagline: "Discover your perfect stay",
    href: "/channels/restroverse",
    accent: "var(--accent-2)",
    logoImg: "/images/logo/restroverse_logo.png",
  },
  {
    name: "Shramdan",
    tagline: "Community work, made visible",
    href: "/channels/shramdan",
    accent: "var(--accent-warm)",
    logoImg: "/images/logo/shramdaan_logo.png",
  },
] as const;

const DESTINATIONS = [
  {
    name: "Projects",
    tagline: "What we've built",
    href: "/projects",
    accent: "var(--accent-2)",
    Icon: Boxes,
  },
  {
    name: "Technologies",
    tagline: "The stack we wield",
    href: "/technologies",
    accent: "var(--accent-1)",
    Icon: StellarOrbitIcon,
  },
  {
    name: "About",
    tagline: "Who we are",
    href: "/about",
    accent: "var(--accent-3)",
    Icon: Info,
  },
] as const;

/* ── Entrance choreography ────────────────────────────────────────────────
   A calm centre-outward bloom on mount (mirrors the StarSystem's reveal): the
   wordmark + CTAs settle first — the heart — then the orbit's labels and
   satellites cascade in, each gliding outward from the Sun into its slot on the
   ring. All on the site's --ease-out-soft curve (see Rise). Reduced-motion
   renders it all at rest. */
const COPY_BASE = 0.08;  // s — eyebrow lands first
const COPY_STEP = 0.08;  // s — per line of the centre copy
const COL_BASE = 0.42;   // s — the arc labels, just after the copy
const COL_TRAIL = 0.05;  // s — the right label trails the left by a hair
const NODE_BASE = 0.52;  // s — the first satellite settles
const NODE_STEP = 0.09;  // s — per-satellite stagger around the ring
const COL_SLIDE = 16;    // px — each satellite glides outward from the Sun

/* ── Orbit geometry ───────────────────────────────────────────────────────
   The six satellites are positioned by angle on a shared ellipse centred on the
   Sun. Angles are measured from the 3-o'clock axis, counter-clockwise positive;
   the two arcs are mirror images so the ring reads as one circle. The open
   wedges at top (≈90°) and bottom (≈270°) leave the Sun's crown and the centre
   copy clear. Radii live in CSS (--orbit-rx / --orbit-ry) so they stay
   responsive; here we only feed in the per-node cos/sin. */
const DEG = Math.PI / 180;

/** Polar `left/top` for a satellite (anchored by its inner edge via the
 *  --left/--right modifier) plus the radial inward offset it enters from. */
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

/** Polar `left/top` for an arc label, pushed out past the satellites by `rf`. */
function labelSlot(angleDeg: number, rf: number) {
  const a = angleDeg * DEG;
  return {
    left: `calc(50% + (var(--orbit-rx) * ${(Math.cos(a) * rf).toFixed(4)}))`,
    top: `calc(var(--orbit-cy) - (var(--orbit-ry) * ${(Math.sin(a) * rf).toFixed(4)}))`,
  } as React.CSSProperties;
}

/* The satellites in render order: left arc (Explore) top→bottom, then right arc
   (Our Projects) top→bottom. `angle` places each on the ring; `bob` gives every
   one its own drift amplitude / tempo / phase so they never move in unison. */
const PLANETS = [
  { ...DESTINATIONS[0], side: "left",  angle: 110, bob: { dur: "9s",    delay: "-1s",   x: "-5px", y: "-9px"  } },
  { ...DESTINATIONS[1], side: "left",  angle: 162, bob: { dur: "10.5s", delay: "-4s",   x: "-6px", y: "-6px"  } },
  { ...DESTINATIONS[2], side: "left",  angle: 212, bob: { dur: "8.5s",  delay: "-2.5s", x: "-4px", y: "-10px" } },
  { ...INITIATIVES[0],  side: "right", angle: 70,  bob: { dur: "9.5s",  delay: "-3s",   x: "5px",  y: "-8px"  } },
  { ...INITIATIVES[1],  side: "right", angle: 18,  bob: { dur: "11s",   delay: "-1.5s", x: "6px",  y: "-6px"  } },
  { ...INITIATIVES[2],  side: "right", angle: -32, bob: { dur: "8s",    delay: "-5s",   x: "4px",  y: "-11px" } },
] as const;

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
          Book a Consultation
        </GlassButton>
        <GlassButton
          variant="secondary"
          onMouseEnter={() => audioSynth.playHover()}
          onClick={() => go("/projects")}
        >
          Explore Projects
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

        {/* The two arc labels, crowning each side. */}
        <span
          className="home-orbit__label"
          style={{ ...labelSlot(104, 1.18), "--label-accent": "var(--accent-2)", "--label-delay": `${COL_BASE}s` } as React.CSSProperties}
        >
          <span className="home-orbit__label-dot" aria-hidden />
          Explore
        </span>
        <span
          className="home-orbit__label"
          style={{ ...labelSlot(76, 1.18), "--label-accent": "var(--accent-warm)", "--label-delay": `${COL_BASE + COL_TRAIL}s` } as React.CSSProperties}
        >
          <span className="home-orbit__label-dot" aria-hidden />
          Our Projects
        </span>

        {/* The satellites, placed by angle on the ring. */}
        <ul className="home-orbit__ring">
          {PLANETS.map((planet, i) => {
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
        <div className="pointer-events-auto grid w-full max-w-[360px] grid-cols-2 gap-2.5">
          {[...INITIATIVES, ...DESTINATIONS].map((node, i) => (
            <Rise key={node.name} delay={NODE_BASE + i * (NODE_STEP * 0.6)} y={14} className="w-full">
              <OrbitNode {...node} className="orbital-node--compact" />
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
