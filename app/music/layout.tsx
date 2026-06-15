import type { Metadata } from "next";

/**
 * Metadata carrier for the (client) Music page. Server layout so /music gets a
 * real title/description for SEO while the Web-Audio player stays client-side.
 */
export const metadata: Metadata = {
  title: "Music",
  description:
    "An ambient music player and live audio-visualizer lab, built on the Web Audio API.",
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
