import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "b3289946.smushcdn.com" },
      { protocol: "https", hostname: "yantracore.com" },
    ],
  },
};

export default nextConfig;
