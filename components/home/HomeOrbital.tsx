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
 * sits behind this layer. Here we arrange the satellites around it:
 *   - Inner ring  (proof)      — the YantraCore initiatives: Jimbo, Restroverse,
 *                                Shramdan. Calm portals; the live simulations
 *                                they used to run now live on the Projects page.
 *   - Outer ring  (wayfinding) — where to go next: Projects, Technologies, About.
 *   - Centre copy + CTAs       — who we are, in one short breath.
 *
 * Everything is positioned around the fixed Sun so the centre never shifts when
 * navigating between orbital pages.
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
   wordmark + CTAs settle first — the heart — then each column's heading and
   nodes cascade in, gliding gently toward the Sun. All on the site's
   --ease-out-soft curve (see Rise). Reduced-motion renders it all at rest. */
const COPY_BASE = 0.08;  // s — eyebrow lands first
const COPY_STEP = 0.08;  // s — per line of the centre copy
const COL_BASE = 0.42;   // s — a column heading, just after the copy
const COL_TRAIL = 0.05;  // s — the right column trails the left by a hair
const NODE_BASE = 0.52;  // s — the first node under a heading
const NODE_STEP = 0.09;  // s — per-node stagger down a column
const COL_SLIDE = 14;    // px — nodes/headings glide in toward the centre

/**
 * ColumnHeading — a quiet cap above one Home column. A mono eyebrow with an
 * accent dot and a hairline rule that fades toward the outer edge, mirroring
 * the column it labels (left columns hug their right/inner edge, and vice
 * versa). Purely decorative: pointer-events stay with the nodes below.
 */
function ColumnHeading({
  label,
  side,
  accent,
}: {
  label: string;
  side: "left" | "right";
  accent: string;
}) {
  return (
    <div
      className={`orbital-col-heading orbital-col-heading--${side}`}
      style={{ "--col-accent": accent } as React.CSSProperties}
    >
      <span className="orbital-col-heading__label">
        <span className="orbital-col-heading__dot" aria-hidden />
        {label}
      </span>
      <span className="orbital-col-heading__rule" aria-hidden />
    </div>
  );
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

      {/* ── DESKTOP / TABLET ─────────────────────────────────────────── */}
      <div className="pointer-events-none hidden h-full w-full grid-cols-[1fr_minmax(240px,440px)_1fr] items-center gap-x-6 px-8 md:grid lg:grid-cols-[1fr_minmax(340px,440px)_1fr] lg:gap-x-10">
        {/* Left — wayfinding (where to go next) */}
        <div className="pointer-events-auto flex flex-col items-end justify-center gap-4">
          <Rise delay={COL_BASE} x={-COL_SLIDE}>
            <ColumnHeading label="Explore" side="left" accent="var(--accent-2)" />
          </Rise>
          <div className="flex flex-col items-end gap-5 lg:gap-7">
            {DESTINATIONS.map((node, i) => (
              <Rise key={node.name} delay={NODE_BASE + i * NODE_STEP} x={-COL_SLIDE} y={12}>
                <OrbitNode {...node} />
              </Rise>
            ))}
          </div>
        </div>

        {/* Centre — sun shows through from the layout; copy sits at the base */}
        <div className="pointer-events-none relative flex h-full flex-col items-center justify-end pb-[7vh]">
          <div className="pointer-events-auto">
            <CenterCopy />
          </div>
        </div>

        {/* Right — our projects (the YantraCore products) */}
        <div className="pointer-events-auto flex flex-col items-start justify-center gap-4">
          <Rise delay={COL_BASE + COL_TRAIL} x={COL_SLIDE}>
            <ColumnHeading label="Our Projects" side="right" accent="var(--accent-warm)" />
          </Rise>
          <div className="flex flex-col items-start gap-5 lg:gap-7">
            {INITIATIVES.map((node, i) => (
              <Rise key={node.name} delay={NODE_BASE + COL_TRAIL + i * NODE_STEP} x={COL_SLIDE} y={12}>
                <OrbitNode {...node} />
              </Rise>
            ))}
          </div>
        </div>
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
