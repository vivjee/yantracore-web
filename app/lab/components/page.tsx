"use client";

import type { FC } from "react";
import { CategoryNav, type NavCategory } from "./_components/CategoryNav";
import {
  CategorySection,
  ComponentEntry,
  Replayable,
  VariantLabel,
  type PropDef,
} from "./_components/Showcase";

/* Showcased components */
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput } from "@/components/glass/GlassInput";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { OrbitalCard } from "@/components/sections/01-arrival/OrbitalCard";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";
import { Reveal } from "@/components/motion/Reveal";
import { MarqueeRow } from "@/components/motion/MarqueeRow";
import { CountUp } from "@/components/motion/CountUp";
import { JellyRotateWrapper } from "@/components/motion/JellyRotateWrapper";
import { DotField } from "@/components/backgrounds/DotField";
import { LineWeave } from "@/components/backgrounds/LineWeave";
import { MeshGradient } from "@/components/backgrounds/MeshGradient";
import { NoiseAura } from "@/components/backgrounds/NoiseAura";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";
import {
  StudioIcon,
  CapabilitiesIcon,
  LabIcon,
  SignalIcon,
  UserIcon,
  TvConsoleIcon,
  StatsWaveIcon,
  SynthMusicIcon,
  ChipSettingsIcon,
  ControlSlidersIcon,
  SunCoreIcon,
  MoonCrescentIcon,
  StellarOrbitIcon,
  ContactIcon,
} from "@/components/chrome/NavIcons";
import { techStack } from "@/lib/content/tech-stack";
import { clientProjects } from "@/lib/content/client-work";

/* ── Sidebar registry — ids must match each ComponentEntry id ───────── */
const CATEGORIES: NavCategory[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "colors", label: "Color & tokens" },
      { id: "type-scale", label: "Type scale" },
    ],
  },
  { id: "actions", label: "Actions", items: [{ id: "glassbutton", label: "GlassButton" }] },
  {
    id: "surfaces",
    label: "Surfaces & Cards",
    items: [
      { id: "glasscard", label: "GlassCard" },
      { id: "glasspanel", label: "GlassPanel" },
      { id: "animatedborder", label: "AnimatedBorder" },
      { id: "orbitalcard", label: "OrbitalCard" },
      { id: "projectcard", label: "ProjectCard" },
    ],
  },
  { id: "inputs", label: "Inputs", items: [{ id: "glassinput", label: "GlassInput" }] },
  {
    id: "badges",
    label: "Badges & Tags",
    items: [
      { id: "badge", label: "Badge" },
      { id: "tag", label: "Tag" },
    ],
  },
  {
    id: "typography",
    label: "Typography",
    items: [
      { id: "eyebrow", label: "Eyebrow" },
      { id: "electrictitle", label: "YantraElectricTitle" },
    ],
  },
  {
    id: "icons",
    label: "Icons",
    items: [
      { id: "navicons", label: "Nav icon set" },
      { id: "techicons", label: "Tech stack icons" },
    ],
  },
  {
    id: "motion",
    label: "Motion & Effects",
    items: [
      { id: "reveal", label: "Reveal" },
      { id: "marquee", label: "MarqueeRow" },
      { id: "countup", label: "CountUp" },
      { id: "jelly", label: "JellyRotateWrapper" },
    ],
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    items: [
      { id: "meshgradient", label: "MeshGradient" },
      { id: "dotfield", label: "DotField" },
      { id: "lineweave", label: "LineWeave" },
      { id: "noiseaura", label: "NoiseAura" },
    ],
  },
  { id: "brand", label: "Brand", items: [{ id: "colorfullogo", label: "ColorfulLogo" }] },
];

/* ── Foundations: color tokens ──────────────────────────────────────── */
const TOKEN_GROUPS: { group: string; note?: string; tokens: [string, string][] }[] = [
  {
    group: "Accent",
    note: "Swap live with the palette dots in the sidebar.",
    tokens: [
      ["--accent-1", "Primary · CTA · links"],
      ["--accent-2", "Secondary"],
      ["--accent-3", "Tertiary"],
      ["--accent-warm", "Warm / human"],
    ],
  },
  {
    group: "Ink — surfaces",
    tokens: [
      ["--ink-0", "Canvas"],
      ["--ink-1", "Raised surface"],
      ["--ink-edge", "Edges / borders"],
    ],
  },
  {
    group: "Text",
    tokens: [
      ["--text-hi", "High emphasis"],
      ["--text-mid", "Body"],
      ["--text-low", "Muted"],
      ["--text-faint", "Faint / labels"],
    ],
  },
];

function ColorTokens() {
  return (
    <div className="space-y-8">
      {TOKEN_GROUPS.map((g) => (
        <div key={g.group}>
          <div className="mb-3 flex items-baseline gap-3">
            <VariantLabel>{g.group}</VariantLabel>
            {g.note && <span className="text-xs text-text-faint">{g.note}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {g.tokens.map(([token, desc]) => (
              <div key={token} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                <div
                  className="mb-2 h-14 rounded-md border border-white/10"
                  style={{ background: `var(${token})` }}
                />
                <code className="block font-mono text-[11px] text-text-mid">{token}</code>
                <span className="text-[11px] text-text-faint">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Foundations: type scale ────────────────────────────────────────── */
function TypeScale() {
  return (
    <div className="space-y-8">
      <div>
        <VariantLabel>Display · var(--font-display)</VariantLabel>
        <p
          className="text-4xl font-semibold tracking-tight text-text-hi"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The mechanisms that move modern business.
        </p>
      </div>
      <div>
        <VariantLabel>Body · var(--font-body)</VariantLabel>
        <p className="max-w-2xl text-lg leading-relaxed text-text-mid">
          YantraCore engineers software, AI, and infrastructure for ambitious
          companies — and for the communities we belong to.
        </p>
      </div>
      <div>
        <VariantLabel>Mono · var(--font-mono)</VariantLabel>
        <p className="font-mono text-sm text-text-mid">
          const yantra = () =&gt; software.beautiful.mechanical;
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2 border-t border-ink-edge pt-6">
        {[
          ["5xl", "3rem"],
          ["4xl", "2.25rem"],
          ["3xl", "1.875rem"],
          ["2xl", "1.5rem"],
          ["xl", "1.25rem"],
          ["base", "1rem"],
          ["sm", "0.875rem"],
        ].map(([name, size]) => (
          <span
            key={name}
            className="font-semibold text-text-hi"
            style={{ fontFamily: "var(--font-display)", fontSize: size }}
            title={`${name} — ${size}`}
          >
            Aa
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────── */
const NAV_ICONS: { name: string; Comp: FC<{ className?: string }> }[] = [
  { name: "StudioIcon", Comp: StudioIcon },
  { name: "CapabilitiesIcon", Comp: CapabilitiesIcon },
  { name: "LabIcon", Comp: LabIcon },
  { name: "SignalIcon", Comp: SignalIcon },
  { name: "UserIcon", Comp: UserIcon },
  { name: "TvConsoleIcon", Comp: TvConsoleIcon },
  { name: "StatsWaveIcon", Comp: StatsWaveIcon },
  { name: "SynthMusicIcon", Comp: SynthMusicIcon },
  { name: "ChipSettingsIcon", Comp: ChipSettingsIcon },
  { name: "ControlSlidersIcon", Comp: ControlSlidersIcon },
  { name: "SunCoreIcon", Comp: SunCoreIcon },
  { name: "MoonCrescentIcon", Comp: MoonCrescentIcon },
  { name: "StellarOrbitIcon", Comp: StellarOrbitIcon },
  { name: "ContactIcon", Comp: ContactIcon },
];

function NavIconGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
      {NAV_ICONS.map(({ name, Comp }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-text-mid"
        >
          <Comp className="h-6 w-6" />
          <span className="text-center text-[9px] text-text-faint">{name.replace("Icon", "")}</span>
        </div>
      ))}
    </div>
  );
}

function TechIconGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {techStack.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.name}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <Icon size={28} style={{ color: t.color, filter: `drop-shadow(0 0 6px ${t.color}55)` }} />
            <span className="text-center text-[11px] text-text-low">{t.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Props metadata ─────────────────────────────────────────────────── */
const P = {
  glassButton: [
    { name: "variant", type: '"primary" | "secondary"', default: '"primary"', description: "Surface treatment." },
    { name: "disabled", type: "boolean", default: "false", description: "Dims, removes hover/press/animated border." },
    { name: "children", type: "ReactNode", description: "Button label." },
    { name: "…rest", type: "ButtonHTMLAttributes", description: "All native <button> props (onClick, type…)." },
  ],
  glassCard: [
    { name: "variant", type: '"light" | "medium" | "heavy"', default: '"medium"', description: "Neumorphic elevation depth." },
    { name: "interactive", type: "boolean", default: "true", description: "Hover lift + 3D tilt + cursor spotlight." },
    { name: "className", type: "string", description: "Extra classes on the surface." },
    { name: "children", type: "ReactNode", description: "Card content." },
  ],
  glassPanel: [
    { name: "variant", type: '"light" | "medium" | "heavy"', default: '"heavy"', description: "Elevation depth. No hover behavior." },
    { name: "…rest", type: "HTMLAttributes<div>", description: "Native div props." },
  ],
  animatedBorder: [
    { name: "variant", type: '"sweep" | "pulse" | "trace"', default: '"sweep"', description: "Conic sweep, soft glow, or (todo) draw-on-scroll." },
    { name: "radius", type: "number", default: "24", description: "Border radius (must match the inner element)." },
    { name: "duration", type: "number (ms)", default: "8000", description: "Sweep rotation duration." },
    { name: "paused", type: "boolean", default: "false", description: "Freeze animation (reduced-motion fallback)." },
  ],
  orbitalCard: [
    { name: "depth", type: '"front" | "mid" | "back"', default: '"mid"', description: "Scale + opacity to fake parallax depth." },
    { name: "delay", type: "string", default: '"0s"', description: "Drift offset so cards never sync." },
    { name: "duration", type: "string", default: '"16s"', description: "Drift cycle length." },
  ],
  projectCard: [
    { name: "project", type: "ClientProject", description: "Project data (name, description, tags, url)." },
    { name: "accent", type: "string (CSS color)", default: "var(--accent-1)", description: "Hover line, glow, and link color." },
    { name: "onClick", type: "() => void", description: "Typically opens the detail modal." },
  ],
  glassInput: [
    { name: "label", type: "string", description: "Optional field label." },
    { name: "error", type: "string", description: "Error message; renders below in red." },
    { name: "…rest", type: "InputHTMLAttributes", description: "All native <input> props." },
  ],
  badge: [
    { name: "tone", type: '"neutral" | "accent" | "success" | "warning" | "danger"', default: '"neutral"', description: "Semantic color." },
    { name: "dot", type: "boolean", default: "false", description: "Leading status dot." },
    { name: "pulse", type: "boolean", default: "false", description: "Animate the dot (implies dot)." },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Scale." },
  ],
  tag: [
    { name: "tone", type: '"neutral" | "accent"', default: '"neutral"', description: "Neutral glass or accent-tinted." },
    { name: "accentColor", type: "string (CSS color)", default: "var(--accent-1)", description: "Tint color when tone='accent'." },
    { name: "shape", type: '"pill" | "square"', default: '"pill"', description: "Rounded-full vs rounded-lg." },
    { name: "size", type: '"xs" | "sm" | "md"', default: '"sm"', description: "Micro chip → standalone strip." },
  ],
  eyebrow: [
    { name: "tone", type: '"low" | "mid" | "accent"', default: '"low"', description: "Text color." },
    { name: "as", type: '"p" | "span" | "div"', default: '"p"', description: "Rendered element." },
  ],
  electricTitle: [
    { name: "text", type: "string", default: '"YantraCore"', description: "Title text (also drives the scan layers)." },
    { name: "size", type: '"xs" … "5xl"', description: "Size preset (clamp-based at larger sizes)." },
    { name: "fontSize", type: "string", description: "Custom CSS font-size override." },
    { name: "as", type: '"h1" … "span"', default: '"span"', description: "Rendered element." },
  ],
  reveal: [
    { name: "delay", type: "number (ms)", default: "0", description: "Delay before entrance." },
    { name: "duration", type: "number (ms)", default: "1100", description: "Fade/translate duration." },
    { name: "y", type: "number", default: "24", description: "Initial Y offset in px." },
    { name: "once", type: "boolean", default: "true", description: "Trigger only the first time in view." },
    { name: "threshold", type: "number", default: "0.15", description: "Intersection ratio to fire." },
  ],
  marquee: [
    { name: "speed", type: "number", default: "1", description: "Higher = faster." },
    { name: "direction", type: '"left" | "right"', default: '"left"', description: "Scroll direction." },
    { name: "gap", type: "number (px)", default: "48", description: "Gap between items." },
    { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause on hover." },
  ],
  countUp: [
    { name: "to", type: "number", description: "Target value (required)." },
    { name: "duration", type: "number (ms)", default: "2000", description: "Count duration." },
    { name: "decimals", type: "number", default: "0", description: "Decimal places." },
    { name: "prefix / suffix", type: "string", description: 'e.g. "$" / "%", "+".' },
    { name: "triggerOnView", type: "boolean", default: "true", description: "Start when scrolled into view." },
  ],
  jelly: [
    { name: "duration", type: "number (ms)", default: "1500", description: "Spin + wobble settle time." },
    { name: "spins", type: "number", default: "1", description: "Full rotations per click." },
  ],
  background: [
    { name: "className", type: "string", description: "Positioning/extra classes. Renders as an absolute inset-0 layer." },
  ],
  colorfulLogo: [
    { name: "size", type: "number (px)", default: "24", description: "Height; width auto." },
    { name: "animate", type: "boolean", default: "true", description: "Gradient flow + chroma drift." },
    { name: "className / style", type: "string / CSSProperties", description: "Forwarded to the wrapper." },
  ],
} satisfies Record<string, PropDef[]>;

/* ── Page ───────────────────────────────────────────────────────────── */
export default function ComponentsPage() {
  return (
    <div className="relative min-h-screen bg-ink-0">
      <CategoryNav categories={CATEGORIES} />

      <main className="lg:pl-72">
        <div className="mx-auto max-w-4xl px-5 pb-32 pt-24 lg:px-10 lg:pt-20">
          {/* Header */}
          <header className="mb-4">
            <Badge tone="success" pulse>
              Living source of truth
            </Badge>
            <h1
              className="mt-5 text-4xl font-semibold tracking-tight text-text-hi md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Component library
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-mid">
              Every reusable UI primitive the site is built from — buttons, cards,
              badges, tags, icons, typography, and motion. Each entry shows live
              variants, its import path, and its props. If it isn&apos;t here, it
              isn&apos;t a shared component yet.
            </p>
          </header>

          <div className="space-y-4">
            {/* ── Foundations ── */}
            <CategorySection
              id="foundations"
              eyebrow="01 — Foundations"
              title="Foundations"
              intro="The design tokens everything else is composed from. Accent colors update live with the palette switcher."
            >
              <ComponentEntry
                id="colors"
                name="Color & tokens"
                description="CSS custom properties bridged to Tailwind classes (e.g. text-text-mid, bg-ink-1, border-ink-edge)."
              >
                <ColorTokens />
              </ComponentEntry>
              <ComponentEntry
                id="type-scale"
                name="Type scale"
                description="Three families — display, body, mono — and the display size ladder."
              >
                <TypeScale />
              </ComponentEntry>
            </CategorySection>

            {/* ── Actions ── */}
            <CategorySection
              id="actions"
              eyebrow="02 — Actions"
              title="Actions"
              intro="Controls the user clicks. Hover lifts the whole assembly; click fires the diagonal press-shine."
            >
              <ComponentEntry
                id="glassbutton"
                name="GlassButton"
                description="Pill-shaped glass control. Primary and secondary surfaces, plus a disabled state."
                importCode='import { GlassButton } from "@/components/glass/GlassButton";'
                props={P.glassButton}
              >
                <div className="flex flex-wrap items-center gap-5">
                  <GlassButton variant="primary">Begin the Tour</GlassButton>
                  <GlassButton variant="secondary">Start a Project</GlassButton>
                  <GlassButton variant="primary" disabled>
                    Disabled
                  </GlassButton>
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Surfaces & Cards ── */}
            <CategorySection
              id="surfaces"
              eyebrow="03 — Surfaces & Cards"
              title="Surfaces & Cards"
              intro="The glass surfaces that hold content. GlassCard is the most-used component on the site."
            >
              <ComponentEntry
                id="glasscard"
                name="GlassCard"
                description="Interactive glass surface with signature hover: lift, 3D tilt toward cursor, accent glow, and a cursor spotlight."
                importCode='import { GlassCard } from "@/components/glass/GlassCard";'
                props={P.glassCard}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {(["light", "medium", "heavy"] as const).map((v) => (
                    <GlassCard key={v} variant={v}>
                      <VariantLabel>{v}</VariantLabel>
                      <p className="text-text-mid">
                        Hover me — the surface lifts and tilts toward the cursor.
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </ComponentEntry>

              <ComponentEntry
                id="glasspanel"
                name="GlassPanel"
                description="Non-interactive glass surface for nav bars, banners, and modals. Same recipe, no hover."
                importCode='import { GlassPanel } from "@/components/glass/GlassPanel";'
                props={P.glassPanel}
              >
                <GlassPanel className="flex items-center justify-between gap-4 p-6">
                  <p className="text-text-hi">A static surface that doesn&apos;t react to the cursor.</p>
                  <GlassButton variant="secondary">Acknowledged</GlassButton>
                </GlassPanel>
              </ComponentEntry>

              <ComponentEntry
                id="animatedborder"
                name="AnimatedBorder"
                description="Wrap any element to draw an animated border. The conic sweep is the site's visual fingerprint."
                importCode='import { AnimatedBorder } from "@/components/glass/AnimatedBorder";'
                props={P.animatedBorder}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <AnimatedBorder variant="sweep" radius={24}>
                    <div className="glass-medium rounded-3xl p-6">
                      <VariantLabel>sweep</VariantLabel>
                      <p className="text-text-mid">Conic gradient rotating around the perimeter.</p>
                    </div>
                  </AnimatedBorder>
                  <AnimatedBorder variant="pulse" radius={24}>
                    <div className="glass-medium rounded-3xl p-6">
                      <VariantLabel>pulse</VariantLabel>
                      <p className="text-text-mid">Soft accent glow — quieter emphasis.</p>
                    </div>
                  </AnimatedBorder>
                </div>
              </ComponentEntry>

              <ComponentEntry
                id="orbitalcard"
                name="OrbitalCard"
                description="The floating glass tile that drifts around the hero logo. Normally absolutely positioned; shown static here."
                importCode='import { OrbitalCard } from "@/components/sections/01-arrival/OrbitalCard";'
                props={P.orbitalCard}
              >
                <div className="flex justify-center">
                  <OrbitalCard depth="front" className="!static !block">
                    <VariantLabel>depth: front</VariantLabel>
                    <p className="text-text-mid">
                      A weightless tile that drifts on a slow, de-synced loop.
                    </p>
                  </OrbitalCard>
                </div>
              </ComponentEntry>

              <ComponentEntry
                id="projectcard"
                name="ProjectCard"
                description="The Client Work tile. Presentational — the parent owns data, accent color, and the click handler."
                importCode='import { ProjectCard } from "@/components/work/ProjectCard";'
                props={P.projectCard}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <ProjectCard project={clientProjects[0]} accent="var(--accent-1)" />
                  <ProjectCard project={clientProjects[4]} accent="var(--accent-2)" />
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Inputs ── */}
            <CategorySection
              id="inputs"
              eyebrow="04 — Inputs"
              title="Inputs"
              intro="Form controls. Focus fires the accent-glow border signature."
            >
              <ComponentEntry
                id="glassinput"
                name="GlassInput"
                description="Labeled text input on a glass surface, with an optional error state."
                importCode='import { GlassInput } from "@/components/glass/GlassInput";'
                props={P.glassInput}
              >
                <div className="grid max-w-md gap-5">
                  <GlassInput label="Your email" name="demo-email" type="email" placeholder="you@company.com" />
                  <GlassInput label="With an error" name="demo-err" placeholder="Try focusing" error="This field has an error message" />
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Badges & Tags ── */}
            <CategorySection
              id="badges"
              eyebrow="05 — Badges & Tags"
              title="Badges & Tags"
              intro="Badge signals state; Tag labels metadata. Both adopted across Work and Capabilities."
            >
              <ComponentEntry
                id="badge"
                name="Badge"
                description="A status indicator with an optional (optionally pulsing) dot — for states like Live, New, or Beta."
                importCode='import { Badge } from "@/components/ui/Badge";'
                props={P.badge}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="success" pulse>Live</Badge>
                  <Badge tone="accent" dot>New</Badge>
                  <Badge tone="warning" dot>Beta</Badge>
                  <Badge tone="danger" dot>Deprecated</Badge>
                  <Badge tone="neutral">v0.1.0</Badge>
                  <Badge tone="accent" size="sm">sm</Badge>
                </div>
              </ComponentEntry>

              <ComponentEntry
                id="tag"
                name="Tag"
                description="The mono-uppercase chip for tech labels, categories, and metadata. Pill or square; neutral or accent-tinted."
                importCode='import { Tag } from "@/components/ui/Tag";'
                props={P.tag}
              >
                <div className="space-y-5">
                  <div>
                    <VariantLabel>neutral · pill · xs / sm / md</VariantLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag size="xs">Next.js</Tag>
                      <Tag size="sm">TypeScript</Tag>
                      <Tag size="md">GraphQL</Tag>
                    </div>
                  </div>
                  <div>
                    <VariantLabel>accent · pill</VariantLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone="accent" accentColor="var(--accent-1)">Web App</Tag>
                      <Tag tone="accent" accentColor="var(--accent-2)">AI</Tag>
                      <Tag tone="accent" accentColor="var(--accent-warm)">E-commerce</Tag>
                    </div>
                  </div>
                  <div>
                    <VariantLabel>accent · square (stack chips)</VariantLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone="accent" shape="square" accentColor="var(--accent-2)">React</Tag>
                      <Tag tone="accent" shape="square" accentColor="var(--accent-2)">Node</Tag>
                      <Tag tone="accent" shape="square" accentColor="var(--accent-2)">Postgres</Tag>
                    </div>
                  </div>
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Typography ── */}
            <CategorySection
              id="typography"
              eyebrow="06 — Typography"
              title="Typography"
              intro="Text components used as scene markers and headlines."
            >
              <ComponentEntry
                id="eyebrow"
                name="Eyebrow"
                description="The small mono-uppercase label — the '01 — Section' pattern used throughout the site."
                importCode='import { Eyebrow } from "@/components/typography/Eyebrow";'
                props={P.eyebrow}
              >
                <div className="space-y-2">
                  <Eyebrow tone="low">01 — Tone low (default)</Eyebrow>
                  <Eyebrow tone="mid">02 — Tone mid</Eyebrow>
                  <Eyebrow tone="accent">03 — Tone accent</Eyebrow>
                </div>
              </ComponentEntry>

              <ComponentEntry
                id="electrictitle"
                name="YantraElectricTitle"
                description="The electric gradient + scan-line + flicker title. Drop in at any scale via size presets."
                importCode='import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";'
                props={P.electricTitle}
              >
                <div className="flex flex-col items-start gap-5">
                  <YantraElectricTitle text="YantraCore" size="3xl" as="div" />
                  <div className="flex flex-wrap items-end gap-6">
                    <YantraElectricTitle text="Lab" size="xl" as="span" />
                    <YantraElectricTitle text="System" size="lg" as="span" />
                    <YantraElectricTitle text="UI" size="md" as="span" />
                  </div>
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Icons ── */}
            <CategorySection
              id="icons"
              eyebrow="07 — Icons"
              title="Icons"
              intro="Two icon families: the bespoke 16×16 nav set (theme-aware, currentColor) and the third-party tech-stack marks."
            >
              <ComponentEntry
                id="navicons"
                name="Nav icon set"
                description="Custom SVG icons for navigation. stroke=currentColor — they adapt to the active theme and accent."
                importCode='import { StudioIcon, LabIcon, … } from "@/components/chrome/NavIcons";'
              >
                <NavIconGrid />
              </ComponentEntry>

              <ComponentEntry
                id="techicons"
                name="Tech stack icons"
                description="The technologies that orbit the homepage star system, rendered as a static grid. Sourced from the shared tech-stack module."
                importCode='import { techStack } from "@/lib/content/tech-stack";'
              >
                <TechIconGrid />
              </ComponentEntry>
            </CategorySection>

            {/* ── Motion & Effects ── */}
            <CategorySection
              id="motion"
              eyebrow="08 — Motion & Effects"
              title="Motion & Effects"
              intro="Reusable motion primitives. Use the replay buttons to re-trigger the view-based ones."
            >
              <ComponentEntry
                id="reveal"
                name="Reveal"
                description="Fade + translate entrance when an element scrolls into view. The most-used motion primitive on the site."
                importCode='import { Reveal } from "@/components/motion/Reveal";'
                props={P.reveal}
              >
                <Replayable>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {[0, 150, 300].map((d) => (
                      <Reveal key={d} delay={d}>
                        <GlassCard variant="medium" interactive={false}>
                          <VariantLabel>delay {d}ms</VariantLabel>
                          <p className="text-sm text-text-mid">Staggered fade-up.</p>
                        </GlassCard>
                      </Reveal>
                    ))}
                  </div>
                </Replayable>
              </ComponentEntry>

              <ComponentEntry
                id="marquee"
                name="MarqueeRow"
                description="Infinite, seamless horizontal scroll. Children are rendered twice for the loop. Pauses on hover."
                importCode='import { MarqueeRow } from "@/components/motion/MarqueeRow";'
                props={P.marquee}
              >
                <MarqueeRow gap={40} speed={0.8}>
                  {["Next.js", "React", "TypeScript", "Node.js", "Tailwind", "Framer", "Prisma", "Vercel"].map((t) => (
                    <Tag key={t} size="md">{t}</Tag>
                  ))}
                </MarqueeRow>
              </ComponentEntry>

              <ComponentEntry
                id="countup"
                name="CountUp"
                description="Animates a number from 0 to the target when it enters the viewport, with eased deceleration."
                importCode='import { CountUp } from "@/components/motion/CountUp";'
                props={P.countUp}
              >
                <Replayable>
                  <div className="flex flex-wrap gap-12">
                    <div>
                      <CountUp to={98} suffix="%" className="text-4xl font-semibold text-text-hi" />
                      <p className="mt-1 text-xs text-text-low">uptime</p>
                    </div>
                    <div>
                      <CountUp to={1200} prefix="$" className="text-4xl font-semibold text-text-hi" />
                      <p className="mt-1 text-xs text-text-low">saved / mo</p>
                    </div>
                  </div>
                </Replayable>
              </ComponentEntry>

              <ComponentEntry
                id="jelly"
                name="JellyRotateWrapper"
                description="Click any child to make it spin with a decaying jelly wobble. Direction follows where you click."
                importCode='import { JellyRotateWrapper } from "@/components/motion/JellyRotateWrapper";'
                props={P.jelly}
              >
                <div className="flex items-center gap-8">
                  <JellyRotateWrapper>
                    <ColorfulLogo size={56} />
                  </JellyRotateWrapper>
                  <span className="text-sm text-text-low">← click the logo</span>
                </div>
              </ComponentEntry>
            </CategorySection>

            {/* ── Backgrounds ── */}
            <CategorySection
              id="backgrounds"
              eyebrow="09 — Backgrounds & Textures"
              title="Backgrounds & Textures"
              intro="GPU-cheap atmosphere layers. Each renders as an absolute inset-0 fill behind a section."
            >
              {([
                ["meshgradient", "MeshGradient", "Slow flowing color blobs. Hero + AI sections.", <MeshGradient key="m" />],
                ["dotfield", "DotField", "Drifting dot grid with an edge mask. Capabilities.", <DotField key="d" />],
                ["lineweave", "LineWeave", "Animated SVG lines drifting vertically. Lab Notes.", <LineWeave key="l" />],
                ["noiseaura", "NoiseAura", "Soft color wash + film grain. Beneath glass-heavy sections.", <NoiseAura key="n" />],
              ] as const).map(([id, name, desc, node]) => (
                <ComponentEntry
                  key={id}
                  id={id}
                  name={name}
                  description={desc}
                  importCode={`import { ${name} } from "@/components/backgrounds/${name}";`}
                  props={P.background}
                  stagePadded={false}
                  stageClassName="h-56"
                >
                  {node}
                </ComponentEntry>
              ))}
            </CategorySection>

            {/* ── Brand ── */}
            <CategorySection
              id="brand"
              eyebrow="10 — Brand"
              title="Brand"
              intro="The reusable brand mark."
            >
              <ComponentEntry
                id="colorfullogo"
                name="ColorfulLogo"
                description="Compact prismatic brand mark — gradient-masked SVG with chromatic-aberration ghost layers."
                importCode='import { ColorfulLogo } from "@/components/brand/ColorfulLogo";'
                props={P.colorfulLogo}
              >
                <div className="flex items-end gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <ColorfulLogo size={64} />
                    <span className="text-[11px] text-text-faint">animate</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ColorfulLogo size={40} />
                    <span className="text-[11px] text-text-faint">40px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ColorfulLogo size={28} animate={false} />
                    <span className="text-[11px] text-text-faint">static</span>
                  </div>
                </div>
              </ComponentEntry>
            </CategorySection>
          </div>

          <footer className="mt-24 border-t border-ink-edge pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-faint">
              END — Component library
            </p>
            <p className="mt-3 text-sm text-text-mid">
              Add a shared primitive? Add it here so it stays the single source of truth.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
