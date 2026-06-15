import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "b3289946.smushcdn.com" },
      { protocol: "https", hostname: "yantracore.com" },
    ],
  },
  async redirects() {
    return [
      // The reach globe was /entryport → /activity → /reach. Preserve both old URLs.
      { source: "/entryport", destination: "/reach", permanent: true },
      { source: "/activity", destination: "/reach", permanent: true },
    ];
  },
};

export default nextConfig;
