import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { AboutWalkthrough } from "@/components/about/AboutWalkthrough";

/**
 * About ( /about ) — the studio's identity walkthrough.
 *
 * A "channel" page (own TV frame, internal scroll). Server-rendered for SEO;
 * the narrative is assembled from the existing VISION section components.
 */
export const metadata: Metadata = {
  title: "About",
  description:
    "YantraCore reveals the machinery that moves modern business — a studio engineering software, AI, and infrastructure for ambitious companies and the communities we belong to.",
};

export default function AboutPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <AboutWalkthrough />
      </TvFrame>
    </>
  );
}
