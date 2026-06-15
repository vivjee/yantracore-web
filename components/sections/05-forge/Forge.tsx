"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Paintbrush, Code2, Rocket, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

/* ── Data ────────────────────────────────────────────────────── */

const steps = [
  {
    index: "01",
    icon: Search,
    title: "Discover",
    body: "We start by understanding the real problem — not just the stated one. Stakeholder sessions, technical audits, competitive analysis. We make sure we're building the right thing before we build anything.",
    duration: "1–2 weeks",
    accent: "var(--accent-1)",
    bullets: [
      "Stakeholder workshops & user interviews",
      "Technical audit of existing systems",
      "Competitive landscape mapping",
    ],
  },
  {
    index: "02",
    icon: Paintbrush,
    title: "Design",
    body: "Wireframes evolve into high-fidelity designs, a component library, and interactive prototypes. You review at every step. Nothing moves to code without your sign-off.",
    duration: "2–4 weeks",
    accent: "var(--accent-2)",
    bullets: [
      "Information architecture & wireframes",
      "High-fidelity UI in Figma",
      "Interactive prototype sign-off",
    ],
  },
  {
    index: "03",
    icon: Code2,
    title: "Build",
    body: "Iterative development in short cycles. A staging environment you can always access. Weekly demos. No black boxes — you see the work in progress, not just the finished product.",
    duration: "4–12 weeks",
    accent: "var(--accent-3)",
    bullets: [
      "Two-week sprint cycles with demos",
      "CI/CD pipeline from day one",
      "Staging environment always accessible",
    ],
  },
  {
    index: "04",
    icon: Rocket,
    title: "Ship",
    body: "Production deployment with thorough QA, performance audits, and cross-browser testing. Handover includes documentation, source code, and a 30-day support window.",
    duration: "1 week",
    accent: "var(--accent-warm)",
    bullets: [
      "Full QA + performance audits",
      "Zero-downtime production deploy",
      "30-day post-launch support",
    ],
  },
] as const;

/* ── Section ─────────────────────────────────────────────────── */

export function Forge() {
  return (
    <section id="forge" className="relative py-32 md:py-48 overflow-hidden">
      {/* Subtle violet radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(110, 86, 255, 0.08) 0%, transparent 60%)",
        }}
      />

      <Container width="default" className="relative z-10">
        {/* Section header */}
        <Reveal>
          <Eyebrow>05 — The Forge</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            How we work.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 text-lg text-text-mid max-w-2xl leading-relaxed">
            No surprises. No black boxes. A repeatable process refined across
            dozens of projects — you always know where things stand.
          </p>
        </Reveal>

        {/* Main layout: timeline left, visual right */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Left: Vertical timeline ── */}
          <div className="relative">
            {/* Continuous connector line with animated fill */}
            <div
              aria-hidden
              className="absolute left-[23px] top-8 bottom-8 w-px hidden md:block overflow-hidden"
            >
              {/* Static base line */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, var(--accent-1) 0%, var(--accent-2) 33%, var(--accent-3) 66%, var(--accent-warm) 100%)",
                  opacity: 0.15,
                }}
              />
              {/* Traveling bright light */}
              <div
                className="absolute inset-x-0"
                style={{
                  height: "30%",
                  background: "linear-gradient(180deg, transparent, rgba(110,86,255,0.9), rgba(0,224,203,0.7), transparent)",
                  animation: "forge-line-travel 4s ease-in-out infinite",
                }}
              />
            </div>

            <div className="flex flex-col gap-0">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.index} delay={200 + i * 100}>
                    <div className="flex gap-6 pb-16 last:pb-0 relative group">
                      {/* Step indicator */}
                      <div className="relative flex-shrink-0">
                        {/* Outer glow ring — expands on hover */}
                        <div
                          aria-hidden
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            boxShadow: `0 0 30px 8px color-mix(in srgb, ${step.accent} 50%, transparent)`,
                          }}
                        />
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: `color-mix(in srgb, ${step.accent} 15%, rgba(10, 12, 22, 0.9))`,
                            border: `1px solid color-mix(in srgb, ${step.accent} 35%, transparent)`,
                            boxShadow: `0 0 20px color-mix(in srgb, ${step.accent} 20%, transparent)`,
                          }}
                        >
                          <Icon
                            size={18}
                            style={{ color: step.accent }}
                            aria-hidden
                          />
                        </div>
                        {/* Index badge */}
                        <span
                          className="absolute -top-2 -right-2 text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: step.accent,
                            color: "var(--ink-0)",
                          }}
                        >
                          {i + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 pt-0.5 rounded-2xl p-4 -mt-1 transition-all duration-500 group-hover:bg-white/[0.03]"
                        style={{
                          border: "1px solid transparent",
                          transition: "border-color 0.4s ease, background 0.4s ease",
                        }}
                      >
                        {/* Scanline sweep across the step on hover */}
                        <div
                          aria-hidden
                          className="absolute inset-x-0 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
                            animation: "cap-scanline-sweep 2s ease-in-out infinite",
                          }}
                        />
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-text-hi">{step.title}</h3>
                          <span
                            className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border"
                            style={{
                              color: step.accent,
                              borderColor: `color-mix(in srgb, ${step.accent} 35%, transparent)`,
                              backgroundColor: `color-mix(in srgb, ${step.accent} 10%, transparent)`,
                            }}
                          >
                            {step.duration}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-text-mid leading-relaxed">{step.body}</p>
                        <ul className="mt-3 space-y-1.5">
                          {step.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-xs text-text-low">
                              <CheckCircle2
                                size={12}
                                className="mt-0.5 shrink-0"
                                style={{ color: step.accent }}
                                aria-hidden
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* CTA */}
            <Reveal delay={600}>
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <p className="text-text-mid text-sm mb-4">
                  Ready to see this process in action?
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 text-sm font-medium text-text-hi glass-primary px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(110,86,255,0.5)] group"
                >
                  Start a project
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* ── Right: Brand visual ── */}
          <Reveal delay={150} className="lg:sticky lg:top-32">
            <div className="relative">
              {/* Glow behind image */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(110, 86, 255, 0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  transform: "scale(0.85)",
                }}
              />
              {/* Glass card with the brand image */}
              <div
                className="glass-medium rounded-3xl p-4 md:p-6 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(110,86,255,0.12) 0%, rgba(0,224,203,0.06) 100%), rgba(255,255,255,0.04)",
                }}
              >
                {/* Top accent line */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--accent-1), var(--accent-2), transparent)",
                    opacity: 0.6,
                  }}
                />
                <Image
                  src="/images/brand/group-794-phone.png"
                  alt="YantraCore technology stack illustration — robot arm building with Next.js, React, CSS, and JavaScript"
                  width={623}
                  height={904}
                  className="w-full h-auto object-contain rounded-2xl"
                  style={{
                    filter:
                      "drop-shadow(0 20px 40px rgba(0,0,0,0.4)) drop-shadow(0 0 30px rgba(110,86,255,0.2))",
                  }}
                  priority={false}
                />
                {/* Subtle overlay to integrate image with dark theme */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 60%, rgba(6,7,13,0.5) 100%)",
                  }}
                />

                {/* Caption */}
                <div className="relative mt-4 text-center">
                  <p className="text-xs text-text-faint font-mono uppercase tracking-widest">
                    Full-stack engineering · AI integration · Cloud deployment
                  </p>
                </div>
              </div>

              {/* Floating tech chips */}
              <div
                className="absolute -top-4 -right-4 glass-medium rounded-xl px-3 py-2 hidden lg:flex items-center gap-2"
                style={{
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(110,86,255,0.2)",
                }}
              >
                <span className="text-[10px] font-mono text-accent-2">
                  Next.js
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-accent-1">
                  React
                </span>
              </div>
              <div
                className="absolute -bottom-4 -left-4 glass-medium rounded-xl px-3 py-2 hidden lg:flex items-center gap-2"
                style={{
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,224,203,0.2)",
                }}
              >
                <span className="text-[10px] font-mono text-accent-warm">
                  CI/CD
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-accent-2">
                  Cloud
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
