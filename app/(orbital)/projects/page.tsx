import type { Metadata } from "next";
import { Showcase } from "@/components/sections/01-arrival/Showcase";

/**
 * Projects ( /projects ) — now an ORBITAL route.
 *
 * It lives in the (orbital) group, so the persistent Sun + TV frame +
 * SiteBackground come from the shared layout and are NOT re-created here.
 * Navigating Home ⇄ Projects is therefore a seamless soft transition: the Sun
 * holds dead centre while only the satellites swap (Home's wayfinding nodes →
 * the live product cards). `externalSun` tells Showcase to drop its own centre
 * logo and orbit the shared one.
 *
 * Server Component → server-rendered with its own metadata (SEO preserved).
 */
export const metadata: Metadata = {
  title: "Projects",
  description:
    "The products and platforms YantraCore has built — Jimbo, Restroverse, Shramdan, and client work.",
};

export default function ProjectsPage() {
  return <Showcase inTv externalSun />;
}
