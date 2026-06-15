import type { Metadata } from "next";

/**
 * Metadata carrier for the (client) Technologies page. Server layout so
 * /technologies stays server-rendered for SEO while the StarSystem stays a
 * client component.
 */
export const metadata: Metadata = {
  title: "Technologies",
  description:
    "The YantraCore technology stack as a living star system — frameworks, languages, cloud, and tools orbiting the core.",
};

export default function TechnologiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
