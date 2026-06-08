/**
 * Next.js Configuration
 * Static export for GitHub Pages / standalone deployment
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: "/devvault-pro",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
