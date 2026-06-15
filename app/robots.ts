import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yantracore.com";

/**
 * robots.txt — allow the public marketing surface; keep the app/console,
 * auth, and internal lab tools out of the index. Note: the blog (/lab and
 * /lab/[slug]) IS public, so we disallow only the internal lab tools by exact
 * path, not the whole /lab subtree.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/login",
        "/signup",
        "/settings",
        "/lab/components",
        "/lab/playground",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
