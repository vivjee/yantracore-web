"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { Showcase } from "@/components/sections/01-arrival/Showcase";
import { TvFrame } from "@/components/layout/TvFrame";
import { SectionDivider } from "@/components/layout/SectionDivider";

// Lazily load brochure sections to ensure light initial load footprint
const Arrival = dynamic(() => import("@/components/sections/01-arrival/Arrival").then(m => m.Arrival), { ssr: false });
const Manifesto = dynamic(() => import("@/components/sections/02-manifesto/Manifesto").then(m => m.Manifesto), { ssr: false });
const Studio = dynamic(() => import("@/components/sections/03-studio/Studio").then(m => m.Studio), { ssr: false });
const BrandVisual = dynamic(() => import("@/components/sections/03-studio/BrandVisual").then(m => m.BrandVisual), { ssr: false });
const Capabilities = dynamic(() => import("@/components/sections/04-capabilities/Capabilities").then(m => m.Capabilities), { ssr: false });
const Forge = dynamic(() => import("@/components/sections/05-forge/Forge").then(m => m.Forge), { ssr: false });
const Work = dynamic(() => import("@/components/sections/06-work/Work").then(m => m.Work), { ssr: false });
const Voices = dynamic(() => import("@/components/sections/07-voices/Voices").then(m => m.Voices), { ssr: false });
const Lab = dynamic(() => import("@/components/sections/08-lab/Lab").then(m => m.Lab), { ssr: false });
const Signal = dynamic(() => import("@/components/sections/09-signal/Signal").then(m => m.Signal), { ssr: false });

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 120) {
        document.body.classList.remove("app-mode-active");
        document.body.classList.add("brochure-mode-active");
      } else {
        document.body.classList.add("app-mode-active");
        document.body.classList.remove("brochure-mode-active");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial sync

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("app-mode-active");
      document.body.classList.remove("brochure-mode-active");
    };
  }, []);

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <Showcase inTv={true} />
      </TvFrame>

      {/* Brochure Content */}
      <main className="relative z-10">
        <Arrival />
        <SectionDivider />
        <Showcase />
        <SectionDivider />
        <Manifesto />
        <SectionDivider />
        <Studio />
        <SectionDivider />
        <BrandVisual />
        <SectionDivider />
        <Capabilities />
        <SectionDivider />
        <Forge />
        <SectionDivider />
        <Work />
        <SectionDivider />
        <Voices />
        <SectionDivider />
        <Lab />
        <SectionDivider />
        <Signal />
      </main>
    </>
  );
}
