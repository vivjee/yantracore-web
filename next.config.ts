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
      // /entryport was renamed to /activity in the orbital makeover.
      { source: "/entryport", destination: "/activity", permanent: true },
    ];
  },
};

export default nextConfig;
