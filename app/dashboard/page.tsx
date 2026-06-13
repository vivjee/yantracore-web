"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";

export default function DashboardPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <DashboardShell />
      </TvFrame>
    </>
  );
}
