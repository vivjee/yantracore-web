import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Work } from "@/components/sections/06-work/Work";
import { Voices } from "@/components/sections/07-voices/Voices";

/**
 * WorkWalkthrough — the /work page: client work + testimonials.
 *
 * YantraCore's OWN products live on /projects (the orbital constellation);
 * this page is the counterpart — what we've built for clients, plus what they
 * say about it. It reuses the VISION Work (project grid + modal) and Voices
 * (testimonials) sections, with a custom hero and a closing CTA. A scrollable
 * "channel" page (own TV frame, internal scroll).
 *
 * Server Component: hero + CTA + Voices render to static HTML; only Work ships
 * client JS (the project modal).
 */
export function WorkWalkthrough() {
  return (
    <div className="no-scrollbar relative z-10 h-full min-h-screen w-full overflow-y-auto">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[60vh] items-center px-6 py-20 md:py-24">
        <Container width="default">
          <Reveal>
            <Eyebrow tone="accent">Client Work</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1
              className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-text-hi md:text-6xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              Mechanisms we’ve built{" "}
              <span className="bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
                for others
              </span>
              .
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-mid md:text-lg">
              Selected work across web, apps, AI, and infrastructure — for partners who needed it
              shipped, not just promised. For our own products, see{" "}
              <Link href="/projects" className="text-accent-2 underline-offset-4 hover:underline">
                Projects
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Reused chapters ── */}
      <Work />
      <Voices />

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
                Want to be the next one?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-text-mid">
                Bring us the problem. We’ll bring the plan, the budget, and the build.
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
