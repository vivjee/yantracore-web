import type { ReactNode } from "react";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Rise } from "@/components/motion/Rise";

/**
 * LegalPage — shared scaffold for the /privacy and /terms stub pages.
 *
 * A channel-page layout (own TV frame, internal scroll) with a narrow reading
 * column. The copy these wrap is placeholder pending real legal review — the
 * `updated` line says so plainly — but the routes exist so the Footer's legal
 * links are real, and the swap to final copy is content-only.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar px-6 pb-24 pt-12 md:pt-20">
          <article className="mx-auto max-w-[720px]">
            <Rise delay={0.08}>
              <Eyebrow>Legal</Eyebrow>
            </Rise>
            <Rise delay={0.16}>
              <h1
                className="mt-3 font-display text-4xl font-bold tracking-tight text-text-hi md:text-5xl"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
              >
                {title}
              </h1>
            </Rise>
            <Rise delay={0.24}>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-text-low">
                Placeholder · last updated {updated} · pending legal review
              </p>
            </Rise>
            <Rise delay={0.34}>
              <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-text-mid md:text-base">
                {children}
              </div>
            </Rise>
          </article>
        </div>
      </TvFrame>
    </>
  );
}

/** A titled section inside a legal document. */
export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-text-hi">{heading}</h2>
      {children}
    </section>
  );
}
