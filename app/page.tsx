"use client";

import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { Showcase } from "@/components/sections/01-arrival/Showcase";
import { TvFrame } from "@/components/layout/TvFrame";

export default function Home() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <Showcase inTv={true} />
      </TvFrame>
    </>
  );
}

