import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { ReachGlobe } from "@/components/reach/ReachGlobe";
import { TvFrame } from "@/components/layout/TvFrame";

/**
 * Reach ( /reach ) — interactive 3D globe of YantraCore's live activity, framed
 * on Nepal with the whole connected world arcing around it.
 *
 * Renamed from /activity (itself renamed from /entryport — both redirect here).
 * Kept as a "channel" page with its own TV frame rather than folded into the
 * orbital group: the globe is its own centerpiece, so it doesn't share the
 * logo-at-centre Sun.
 */
export const metadata: Metadata = {
  title: "Reach",
  description:
    "A live, interactive 3D globe of YantraCore's activity and reach — Nepal at the centre, the whole world connected.",
};

export default function ReachPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <ReachGlobe />
      </TvFrame>
    </>
  );
}
