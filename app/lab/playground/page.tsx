"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { MeshGradient } from "@/components/backgrounds/MeshGradient";
import { DotField } from "@/components/backgrounds/DotField";
import { LineWeave } from "@/components/backgrounds/LineWeave";
import { NoiseAura } from "@/components/backgrounds/NoiseAura";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/AnimationWrappers";

export default function PlaygroundPage() {
  return (
    <main className="relative min-h-screen w-full">
      <MeshGradient className="fixed inset-0" />

      <StaggerContainer
        className="relative mx-auto max-w-[1200px] px-6 md:px-8 py-20 md:py-28"
        delay={100}
        staggerDelay={0.06}
      >
        {/* Header */}
        <StaggerItem>
          <header className="mb-20">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.2em] text-text-low hover:text-text-mid transition-colors"
            >
              ← back home
            </Link>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-text-low">
              00 — Lab / Playground
            </p>
            <h1
              className="mt-4 text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Glass primitives.
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl text-text-mid leading-relaxed">
              The kit of parts every section of the site is built from.
              If these don&apos;t sing here, they won&apos;t sing in production.
            </p>
          </header>
        </StaggerItem>

        {/* Glass cards — three variants */}
        <StaggerItem>
          <Section
            number="01"
            title="Glass cards — three variants"
            note="Hover any card: the signature lift + tilt + glow + cursor spotlight."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard variant="light">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                  Light
                </p>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  For floating
                </h3>
                <p className="text-text-mid leading-relaxed">
                  Blur 16, opacity 4%. Used for cards over busy backgrounds where
                  we want to feel weightless.
                </p>
              </GlassCard>
              <GlassCard variant="medium">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                  Medium
                </p>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  For most things
                </h3>
                <p className="text-text-mid leading-relaxed">
                  Blur 20, opacity 6%. The default card surface. 80% of cards on
                  the site use this.
                </p>
              </GlassCard>
              <GlassCard variant="heavy">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                  Heavy
                </p>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  For nav &amp; modals
                </h3>
                <p className="text-text-mid leading-relaxed">
                  Blur 32, opacity 10%. Surfaces that must obscure what&apos;s
                  behind — navigation bars, modal dialogs, drawers.
                </p>
              </GlassCard>
            </div>
          </Section>
        </StaggerItem>

        {/* Animated borders */}
        <StaggerItem>
          <Section
            number="02"
            title="Animated borders — sweep &amp; pulse"
            note="The signature conic-sweep is the visual fingerprint of the site."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedBorder variant="sweep" radius={24} duration={8000}>
                <div className="glass-medium rounded-3xl p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                    Sweep
                  </p>
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Conic gradient
                  </h3>
                  <p className="text-text-mid leading-relaxed">
                    An angle custom-property rotates the conic gradient around
                    the perimeter. Used on primary CTAs and featured cards.
                  </p>
                </div>
              </AnimatedBorder>
              <AnimatedBorder variant="pulse" radius={24}>
                <div className="glass-medium rounded-3xl p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                    Pulse
                  </p>
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Soft glow
                  </h3>
                  <p className="text-text-mid leading-relaxed">
                    Subtle accent emphasis. Used on focus states and secondary
                    cards where the conic sweep would be too loud.
                  </p>
                </div>
              </AnimatedBorder>
            </div>
          </Section>
        </StaggerItem>

        {/* Glass buttons */}
        <StaggerItem>
          <Section
            number="03"
            title="Glass buttons — primary &amp; secondary"
            note="Hover any button: the whole assembly lifts on a raised halo shadow. Click to feel the press."
          >
            <div className="flex flex-wrap items-center gap-6">
              <GlassButton variant="primary">Begin the Tour</GlassButton>
              <GlassButton variant="secondary">Start a Project</GlassButton>
              <GlassButton variant="primary" disabled>
                Disabled Primary
              </GlassButton>
              <GlassButton variant="secondary" disabled>
                Disabled Secondary
              </GlassButton>
            </div>
          </Section>
        </StaggerItem>

        {/* Glass inputs */}
        <StaggerItem>
          <Section
            number="04"
            title="Glass input — focus state"
            note="Click into the input: animated focus border (the accent glow signature)."
          >
            <div className="max-w-md grid gap-5">
              <GlassInput
                label="Your email"
                name="email"
                type="email"
                placeholder="you@company.com"
              />
              <GlassInput
                label="Project name"
                name="project"
                placeholder="A short description"
              />
              <GlassInput
                label="With an error"
                name="error"
                placeholder="Try focusing"
                error="This field has an error message"
              />
            </div>
          </Section>
        </StaggerItem>

        {/* Glass panel */}
        <StaggerItem>
          <Section
            number="05"
            title="Glass panel — non-interactive surface"
            note="For nav bars, banners, modals — anything that's a surface, not a control."
          >
            <GlassPanel className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-2">
                  Notice
                </p>
                <p className="text-text-hi text-lg leading-relaxed">
                  Same glass recipe, no hover behavior. Use this when a surface
                  shouldn&apos;t respond to the cursor.
                </p>
              </div>
              <GlassButton variant="secondary">Acknowledged</GlassButton>
            </GlassPanel>
          </Section>
        </StaggerItem>

        {/* Background patterns */}
        <StaggerItem>
          <Section
            number="06"
            title="Background patterns — four flavors"
            note="Each one lives behind a section, sets the temperature, and is GPU-cheap."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BackgroundPreview
                name="MeshGradient"
                caption="Slow color blobs. Used in hero + AI sections."
              >
                <MeshGradient />
              </BackgroundPreview>
              <BackgroundPreview
                name="DotField"
                caption="Drifting dot grid with edge mask. Used in capabilities."
              >
                <DotField />
              </BackgroundPreview>
              <BackgroundPreview
                name="LineWeave"
                caption="Animated SVG lines. Used near Lab Notes."
              >
                <LineWeave />
              </BackgroundPreview>
              <BackgroundPreview
                name="NoiseAura"
                caption="Soft wash + film grain. Used beneath glass-heavy sections."
              >
                <NoiseAura />
              </BackgroundPreview>
            </div>
          </Section>
        </StaggerItem>

        {/* Motion & layout primitives */}
        <StaggerItem>
          <Section
            number="07"
            title="Motion &amp; layout — Reveal, Eyebrow, Container, Cursor"
            note="Scroll into the cards below to see Reveal in action. Move your cursor — the custom ring expands on interactive elements."
          >
            <div className="space-y-12">
              {/* Eyebrow demo */}
              <div className="rounded-3xl border border-ink-edge p-6 md:p-8">
                <Eyebrow className="mb-3">Eyebrow — tone:&nbsp;low (default)</Eyebrow>
                <Eyebrow tone="mid" className="mb-3">
                  Eyebrow — tone:&nbsp;mid
                </Eyebrow>
                <Eyebrow tone="accent" className="mb-3">
                  Eyebrow — tone:&nbsp;accent
                </Eyebrow>
                <p className="text-text-mid text-sm">
                  Three tones for the small mono uppercase label pattern.
                </p>
              </div>

              {/* Container demo */}
              <div className="rounded-3xl border border-ink-edge py-6">
                <Eyebrow className="px-6 md:px-8 mb-4">
                  Container — width: default (1200px)
                </Eyebrow>
                <Container className="border border-dashed border-accent-1/30 py-4 rounded-md">
                  <p className="text-text-mid text-sm">
                    This row sits inside <code className="font-mono text-xs">&lt;Container&gt;</code>.
                    Variants: narrow (720) / default (1200) / wide (1440) / full.
                  </p>
                </Container>
                <Container width="narrow" className="border border-dashed border-accent-2/30 py-4 rounded-md mt-4">
                  <p className="text-text-mid text-sm">
                    width=&quot;narrow&quot; — 720px (used for blog posts).
                  </p>
                </Container>
              </div>

              {/* Reveal demo — three cards stagger in on scroll */}
              <div>
                <Eyebrow className="mb-6">
                  Reveal — scroll-triggered fade + translate
                </Eyebrow>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Reveal delay={0}>
                    <GlassCard variant="medium" interactive={false}>
                      <Eyebrow className="mb-3">Card 01</Eyebrow>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        No delay
                      </h3>
                      <p className="text-text-mid text-sm">
                        Fades up immediately when the row enters view.
                      </p>
                    </GlassCard>
                  </Reveal>
                  <Reveal delay={150}>
                    <GlassCard variant="medium" interactive={false}>
                      <Eyebrow className="mb-3">Card 02</Eyebrow>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Delayed 150ms
                      </h3>
                      <p className="text-text-mid text-sm">
                        Staggered behind the first.
                      </p>
                    </GlassCard>
                  </Reveal>
                  <Reveal delay={300}>
                    <GlassCard variant="medium" interactive={false}>
                      <Eyebrow className="mb-3">Card 03</Eyebrow>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Delayed 300ms
                      </h3>
                      <p className="text-text-mid text-sm">
                        Staggered behind the second. Three cards = a wave.
                      </p>
                    </GlassCard>
                  </Reveal>
                </div>
              </div>

              {/* Cursor demo */}
              <div className="rounded-3xl border border-ink-edge p-6 md:p-8">
                <Eyebrow className="mb-4">Cursor — site-wide</Eyebrow>
                <p className="text-text-mid mb-6">
                  Move your mouse anywhere on the page. A small dot tracks the
                  cursor; a larger ring trails with a lerp. Hover any button or
                  link — the ring expands and tints with the accent color.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span
                    data-cursor="grow"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm text-text-mid"
                  >
                    Hover me (data-cursor=&quot;grow&quot;)
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-text-mid">
                    Plain span (no grow)
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </StaggerItem>

        {/* Type sample */}
        <StaggerItem>
          <Section
            number="08"
            title="Typography — display, body, mono"
            note="The three families. Display is General Sans (Fontshare), body is Inter, mono is JetBrains Mono."
          >
            <GlassCard variant="medium" interactive={false}>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-6">
                Display — General Sans
              </p>
              <h2
                className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-10"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The mechanisms
                <br />
                that move modern business.
              </h2>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                Body — Inter
              </p>
              <p className="text-lg text-text-mid leading-relaxed max-w-2xl mb-10">
                YantraCore engineers software, AI, and infrastructure for
                ambitious companies — and for the communities we belong to. The
                site you&apos;re reading was built by the same hands.
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-3">
                Mono — JetBrains Mono
              </p>
              <p className="font-mono text-sm text-text-mid">
                const yantra = () =&gt; software.beautiful.mechanical;
              </p>
            </GlassCard>
          </Section>
        </StaggerItem>

        {/* Footer note */}
        <StaggerItem>
          <footer className="mt-32 pt-12 border-t border-ink-edge">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low">
              END — Lab / Playground
            </p>
            <p className="mt-4 text-text-mid">
              If these primitives sing here, they&apos;ll sing in the hero.
              Onward to Phase 2.
            </p>
          </footer>
        </StaggerItem>
      </StaggerContainer>
    </main>
  );
}

function Section({
  number,
  title,
  note,
  children,
}: {
  number: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-low mb-3">
            {number}
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        {note && (
          <p className="text-sm text-text-mid md:max-w-sm md:text-right">
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function BackgroundPreview({
  name,
  caption,
  children,
}: {
  name: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-64 rounded-3xl overflow-hidden border border-ink-edge bg-ink-1">
      {children}
      <div className="relative h-full flex flex-col justify-end p-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-low mb-2">
          {name}
        </p>
        <p className="text-text-mid text-sm">{caption}</p>
      </div>
    </div>
  );
}
