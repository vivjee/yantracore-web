import { HomeOrbital } from "@/components/home/HomeOrbital";

/**
 * Home ( / ) — the orbital navigation hub.
 *
 * A Server Component (server-rendered for SEO) that renders the interactive
 * hub. The persistent Sun + TV shell come from the orbital layout; this page
 * only declares Home's satellites. Title/description inherit the strong brand
 * default from the root layout, which is exactly right for the index.
 */
export default function HomePage() {
  return <HomeOrbital />;
}
