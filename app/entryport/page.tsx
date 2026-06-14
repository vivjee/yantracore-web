import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { EntryportGlobe } from "@/components/entryport/EntryportGlobe";
import { TvFrame } from "@/components/layout/TvFrame";

export default function EntryportPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <EntryportGlobe />
      </TvFrame>
    </>
  );
}
