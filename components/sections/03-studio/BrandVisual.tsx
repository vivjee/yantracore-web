"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { GlassCard } from "@/components/glass/GlassCard";
import { MarqueeRow } from "@/components/motion/MarqueeRow";

/* ── Data ───────────────────────────────────────────────────── */

const metrics = [
  { to: 50,  suffix: "+", label: "Projects",   sublabel: "Delivered",           accent: "var(--accent-1)" },
  { to: 10,  suffix: "+", label: "Years",       sublabel: "Combined Experience",  accent: "var(--accent-2)" },
  { to: 8,   suffix: "+", label: "Tech",        sublabel: "Core Capabilities",   accent: "var(--accent-3)" },
  { to: 25,  suffix: "+", label: "Enterprise",  sublabel: "Clients Served",      accent: "var(--accent-warm)" },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "Tailwind CSS",
  "OpenAI",
  "Prisma",
  "tRPC",
  "Docker",
  "Vercel",
  "AWS",
  "Figma",
  "GraphQL",
  "Stripe",
];

/* ── Sub-component: Metric tile ─────────────────────────────── */

function MetricTile({
  to,
  suffix,
  label,
  sublabel,
  accent,
  index,
}: {
  to: number;
  suffix: string;
  label: string;
  sublabel: string;
  accent: string;
  index: number;
}) {
  return (
    <Reveal delay={200 + index * 80}>
      <div
        className="relative flex flex-col items-center text-center px-6 py-8 rounded-2xl border border-white/[0.06] overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
        style={{
          background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 6%, rgba(10,12,22,0.7)) 0%, rgba(10,12,22,0.4) 100%)`,
        }}
      >
        {/* Glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, color-mix(in srgb, ${accent} 20%, transparent) 0%, transparent 70%)`,
          }}
        />

        {/* Large value */}
        <p
          className="relative font-bold leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            background: `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 60%, var(--text-hi)) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <CountUp to={to} suffix={suffix} duration={2000} />
        </p>

        {/* Label */}
        <p
          className="relative mt-2 text-base font-semibold text-text-hi"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </p>
        <p
          className="relative mt-0.5 text-xs text-text-low uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {sublabel}
        </p>
      </div>
    </Reveal>
  );
}

/* ── Sub-component: Tech marquee pill ───────────────────────── */

function TechPill({ name }: { name: string }) {
  return (
    <span
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono text-text-mid border border-white/[0.08] whitespace-nowrap"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      {/* Dot indicator */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: "var(--accent-1)", opacity: 0.7 }}
        aria-hidden
      />
      {name}
    </span>
  );
}

/* ── Main export ────────────────────────────────────────────── */

export function BrandVisual() {
  return (
    <section
      id="brand-visual"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      {/* ── Subtle grid pattern ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Accent radial washes ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 75% 40%, rgba(0, 224, 203, 0.10) 0%, transparent 55%), radial-gradient(ellipse at 15% 70%, rgba(110, 86, 255, 0.10) 0%, transparent 55%)",
        }}
      />

      <Container width="default" className="relative z-10">
        {/* ── Header ── */}
        <Reveal>
          <Eyebrow>By the numbers</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            The numbers{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--accent-2), var(--accent-1))",
              }}
            >
              speak for themselves.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 text-lg text-text-mid max-w-2xl leading-relaxed">
            A track record built project by project — across industries,
            timezones, and tech stacks.
          </p>
        </Reveal>

        {/* ── Two-column layout: metrics + visual ── */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px] gap-10 xl:gap-16 items-center">
          {/* Left: 2×2 metric grid */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <MetricTile key={m.label} {...m} index={i} />
            ))}
          </div>

          {/* Right: Brand visual glass card */}
          <Reveal delay={300}>
            <div className="relative">
              {/* Outer halo */}
              <div
                aria-hidden
                className="absolute -inset-10 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(0, 224, 203, 0.15) 0%, transparent 65%)",
                }}
              />

              <GlassCard variant="heavy" className="overflow-hidden p-0">
                {/* Image wrapper */}
                <div
                  className="relative w-full rounded-3xl overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  {/* Dark ink overlay — neutralises the white bg */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,7,13,0.30) 0%, rgba(6,7,13,0.60) 100%)",
                      mixBlendMode: "multiply",
                    }}
                  />

                  {/* Colour wash */}
                  <div
                    aria-hidden
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 40% 30%, rgba(0,224,203,0.22) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(110,86,255,0.20) 0%, transparent 55%)",
                    }}
                  />

                  <Image
                    src="/images/brand/hero-dashboard.png"
                    alt="YantraCore connectivity dashboard illustration"
                    fill
                    className="object-contain mix-blend-luminosity"
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority={false}
                  />
                </div>

                {/* Card footer */}
                <div className="px-6 py-5 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "var(--accent-2)" }}
                      aria-hidden
                    />
                    <p
                      className="text-xs text-text-low uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Global connectivity · Active across 12+ countries
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>

        {/* ── Tech marquee ── */}
        <Reveal delay={500}>
          <div className="mt-20">
            <p
              className="text-center text-xs font-mono uppercase tracking-widest text-text-faint mb-6"
            >
              Tech we build with
            </p>
            <MarqueeRow speed={0.7} gap={16} pauseOnHover>
              {techStack.map((name) => (
                <TechPill key={name} name={name} />
              ))}
            </MarqueeRow>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
