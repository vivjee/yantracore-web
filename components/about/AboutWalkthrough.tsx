import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Manifesto } from "@/components/sections/02-manifesto/Manifesto";
import { Capabilities } from "@/components/sections/04-capabilities/Capabilities";
import { Forge } from "@/components/sections/05-forge/Forge";

/**
 * AboutWalkthrough — the /about identity story.
 *
 * A scrollable narrative that reuses the VISION-era section components (built
 * but never assembled into a live page): a custom hero states the thesis, then
 * Manifesto (what we believe) → Capabilities (what we build) → Forge (how we
 * work) → a closing CTA. Client-work proof + testimonials deliberately live on
 * /projects instead, so About stays the "who we are" page.
 *
 * Server Component: the hero/CTA/Manifesto render to static HTML (SEO); only
 * Capabilities + Forge ship client JS. Scrolls internally within the TV screen,
 * like /contact and /book.
 */
export function AboutWalkthrough() {
  return (
    <div className="no-scrollbar relative z-10 h-full min-h-screen w-full overflow-y-auto">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[78vh] items-center px-6 py-20 md:py-28">
        <Container width="default">
          <Reveal>
            <Eyebrow tone="accent">About · The Studio</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="mt-4 max-w-4xl text-fluid-h1 font-bold text-text-hi"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              YantraCore reveals the{" "}
              <span className="bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
                machinery
              </span>{" "}
              that moves modern business.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-mid md:text-lg">
              The name comes from <span className="text-text-hi">yantra</span> (यन्त्र) — Sanskrit for
              instrument, mechanism, machine. We engineer software, AI, and infrastructure for
              ambitious companies, and for the communities we belong to — treating the craft of the
              machine itself as the thing worth selling.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-low">
              <span className="h-px w-8 bg-accent-2" /> Scroll to explore
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Reused chapters ── */}
      <Manifesto />
      <Capabilities />
      <Forge />

      {/* ── Closing CTA ── */}
      <section className="relative px-6 py-24 md:py-36">
        <Container width="default">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl glass-heavy p-10 text-center md:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent-2) 50%, transparent)" }}
              />
              <Eyebrow tone="accent">Start a project</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-text-hi md:text-4xl">
                Have a mechanism worth building?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-mid">
                Tell us what you’re imagining. We’ll shape a plan, an honest budget, and a path to
                ship it.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="glass-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-text-hi transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(110,86,255,0.45)]"
                >
                  Book a Consultation <ArrowRight size={15} />
                </Link>
                <Link
                  href="/contact"
                  className="glass-light inline-flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-text-mid transition-all duration-300 hover:text-text-hi"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
