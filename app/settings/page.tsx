"use client";

import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { SettingsShell } from "@/components/dashboard/SettingsShell";

export default function PublicSettingsPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="w-full h-full overflow-y-auto no-scrollbar relative z-10 p-4 md:p-6 text-text-hi font-body">
          <SettingsShell inTv={true} />
        </div>
      </TvFrame>
    </>
  );
}
