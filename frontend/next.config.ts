import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
  images: {
    qualities: [100, 75],
  },
};

export default nextConfig;
