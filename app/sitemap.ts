import type { MetadataRoute } from "next";
import { fetchPosts } from "@/lib/api/posts";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yantracore.com";

/**
 * sitemap.xml — the public marketing routes, by priority, plus the blog index
 * and every Lab post. The console, auth, and internal lab tools are
 * intentionally omitted.
 */
const routes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/book", priority: 0.8, changeFrequency: "monthly" },
  { path: "/lab", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/technologies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/reach", priority: 0.6, changeFrequency: "monthly" },
  { path: "/music", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticEntries: MetadataRoute.Sitemap = routes.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );

  const posts = await fetchPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/lab/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
