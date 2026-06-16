"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { Rise } from "@/components/motion/Rise";

/**
 * Route-segment error boundary. Renders inside the root layout (theme + tokens
 * available), so it can use the design system. Kept deliberately simple — no
 * TvFrame — so it stays robust even when a page subtree fails to render.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced for debugging; real error reporting gets wired with the backend.
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteBackground />
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
        <Rise delay={0.08}>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-3">
            SYS · Fault
          </p>
        </Rise>
        <Rise delay={0.16}>
          <h1
            className="mt-5 font-display text-4xl font-bold tracking-tight text-text-hi md:text-6xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
          >
            A circuit tripped
          </h1>
        </Rise>
        <Rise delay={0.24}>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-mid md:text-base">
            Something on this screen failed to render. You can try again — if it keeps
            happening, head back home and we&rsquo;ll look into it.
          </p>
        </Rise>
        <Rise delay={0.34}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="glass-primary inline-flex cursor-pointer items-center justify-center rounded-xl px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-text-hi transition-transform duration-300 hover:-translate-y-0.5"
            >
              Try again
            </button>
            <Link
              href="/"
              className="glass-medium inline-flex items-center justify-center rounded-xl px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-text-mid transition-colors duration-300 hover:text-text-hi"
            >
              Return home
            </Link>
          </div>
        </Rise>
        {error.digest && (
          <Rise delay={0.42}>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-text-faint">
              ref: {error.digest}
            </p>
          </Rise>
        )}
      </main>
    </>
  );
}
