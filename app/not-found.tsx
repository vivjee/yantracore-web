import type { Metadata } from "next";
import Link from "next/link";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Rise } from "@/components/motion/Rise";

/**
 * 404 — "signal lost." A route that doesn't exist. Rendered inside the root
 * layout (so the theme, fonts, cursor, and providers are all available) and
 * wrapped in the TV shell so the visitor keeps the full nav to escape with.
 * On-brand for the orbital theme: you've drifted out of range.
 */
export const metadata: Metadata = {
  title: "Signal lost (404)",
  description:
    "This orbit is empty — the page you were looking for drifted out of range.",
};

export default function NotFound() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="relative z-10 flex min-h-[80vh] w-full flex-col items-center justify-center px-6 text-center">
          <Rise delay={0.08}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">
              ERR · 404 — Signal lost
            </p>
          </Rise>
          <Rise delay={0.16}>
            <h1
              className="mt-5 font-display text-5xl font-bold tracking-tight text-text-hi md:text-7xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Lost in orbit
            </h1>
          </Rise>
          <Rise delay={0.24}>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-mid md:text-base">
              The page you&rsquo;re after has drifted out of range — wrong coordinates, or
              it was never charted. Let&rsquo;s get you back to a known star.
            </p>
          </Rise>
          <Rise delay={0.34}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="glass-primary inline-flex items-center justify-center rounded-xl px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-text-hi transition-transform duration-300 hover:-translate-y-0.5"
              >
                Return home
              </Link>
              <Link
                href="/contact"
                className="glass-medium inline-flex items-center justify-center rounded-xl px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-text-mid transition-colors duration-300 hover:text-text-hi"
              >
                Send a signal
              </Link>
            </div>
          </Rise>
        </div>
      </TvFrame>
    </>
  );
}
