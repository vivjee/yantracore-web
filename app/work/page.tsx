import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { WorkWalkthrough } from "@/components/work/WorkWalkthrough";

/**
 * Client Work ( /work ) — client projects + testimonials.
 *
 * The counterpart to /projects (YantraCore's own products): a "channel" page
 * (own TV frame, internal scroll), server-rendered for SEO.
 */
export const metadata: Metadata = {
  title: "Client Work",
  description:
    "Selected client work by YantraCore across web, apps, AI, and infrastructure — plus what partners say about shipping with us.",
};

export default function WorkPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <WorkWalkthrough />
      </TvFrame>
    </>
  );
}
