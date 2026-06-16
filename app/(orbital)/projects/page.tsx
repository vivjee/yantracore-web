import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Showcase } from "@/components/sections/01-arrival/Showcase";
import { Work } from "@/components/sections/06-work/Work";
import { Voices } from "@/components/sections/07-voices/Voices";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Projects ( /projects ) — an ORBITAL route, now the home of the WHOLE portfolio.
 *
 * It lives in the (orbital) group, so the persistent Sun + TV frame +
 * SiteBackground come from the shared layout. The TV screen itself never
 * scrolls (`overflow:hidden`), so this page is its own internal scroll region —
 * which lets the page tell the full story as two orbits around the SAME pinned
 * Sun:
 *
 *   • Screen 1  — the solar system (`Showcase`): YC's OWN products (YantraCore,
 *                 Jimbo, Restroverse) + community-led Shramdan. `externalSun`
 *                 drops the local centre logo so the cards orbit the shared one.
 *   • Below     — the CLIENT CONSTELLATION (`Work`): the 12 worlds we've built
 *                 for clients, then `Voices` (testimonials) and a closing CTA.
 *
 * (Client work used to live on a separate /work route; it was folded in here so
 * one page carries "what we run" and "what we've built for others" — /work now
 * 308-redirects here. See docs/03-sitemap.md.)
 *
 * Server Component → server-rendered with its own metadata (SEO preserved).
 */
export const metadata: Metadata = {
  title: "Projects",
  description:
    "The full YantraCore portfolio — our own products (Jimbo, Restroverse), community-led Shramdan, and the client work we've shipped across web, apps, AI, and infrastructure.",
};

export default function ProjectsPage() {
  return (
    <div className="no-scrollbar relative z-10 h-full w-full overflow-y-auto">
      {/* ── Screen 1 — the solar system: YC's own products, orbiting the Sun ── */}
      <div className="relative min-h-full">
        <Showcase inTv externalSun />
      </div>

      {/* ── Below the fold — the client constellation + testimonials ── */}
      <Work />
      <Voices />

      {/* ── Closing CTA ── */}
      <section className="relative px-6 pb-28 pt-4 md:pb-36">
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
                Bring us the problem. We&apos;ll bring the plan, the budget, and the build.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="glass-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-text-hi transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(110,86,255,0.45)]"
                >
                  Start a Project <ArrowRight size={15} />
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
