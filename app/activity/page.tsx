import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { EntryportGlobe } from "@/components/entryport/EntryportGlobe";
import { TvFrame } from "@/components/layout/TvFrame";

/**
 * Live Activity ( /activity ) — interactive 3D globe of YantraCore's activity.
 *
 * Renamed from /entryport (a redirect preserves the old URL). Kept as a
 * "channel" page (its own TV frame) rather than folded into the orbital group:
 * the globe is its own centerpiece, so it doesn't share the logo-at-centre Sun.
 */
export const metadata: Metadata = {
  title: "Live Activity",
  description:
    "A live, interactive 3D globe of YantraCore's activity and reach across the world.",
};

export default function ActivityPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <EntryportGlobe />
      </TvFrame>
    </>
  );
}
