import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { Showcase } from "@/components/sections/01-arrival/Showcase";
import { TvFrame } from "@/components/layout/TvFrame";

/**
 * Projects ( /projects ) — the live product constellation.
 *
 * This is the former homepage scene (the "solar system" with the running
 * Jimbo / Restroverse / Shramdan mini-apps), relocated here so the new Home can
 * be a calm hub. For now it renders as a standalone "channel" route with its
 * own TV frame; in Phase 2 it folds into the orbital group (sharing the
 * persistent Sun) and gains the client-work showcase + testimonials.
 */
export const metadata: Metadata = {
  title: "Projects",
  description:
    "The products and platforms YantraCore has built — Jimbo, Restroverse, Shramdan, and client work.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <Showcase inTv />
      </TvFrame>
    </>
  );
}
