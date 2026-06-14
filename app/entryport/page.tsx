import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { EntryportGlobe } from "@/components/entryport/EntryportGlobe";

export default function EntryportPage() {
  return (
    <>
      <SiteBackground />
      <main className="relative z-10 h-screen w-full overflow-hidden p-2 md:p-4">
        <EntryportGlobe />
      </main>
    </>
  );
}
