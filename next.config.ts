import type { NextConfig } from "next";

/**
 * MasarMentors - Next.js Configuration
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mentor-app", // 👈 هذا السطر ضروري جداً لكي تعمل الاستضافة على GitHub Pages
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
