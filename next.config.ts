import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // product art is already .webp; let Next only resize/convert what is requested
    qualities: [60, 70, 80],
    deviceSizes: [480, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 200, 320, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["motion"] },
  async headers() {
    return [
      {
        source: "/(img|video)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
