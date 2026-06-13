import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";

export const metadata: Metadata = {
  title: "Settings — YantraCore",
  description: "Manage your YantraCore workspace preferences and appearance.",
};

export default function SettingsPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <DashboardShell initialSection="settings" />
      </TvFrame>
    </>
  );
}
