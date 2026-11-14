import type { NextConfig } from "next";

/**
 * MasarMentors - Next.js Configuration
 * 
 * ARCHITECTURAL DECISION (Phase 0):
 * - output: 'export' enables Static Site Generation (SSG) for GitHub Pages hosting
 * - All auth is handled client-side via Supabase browser client
 * - No SSR, no @supabase/ssr, no server-side cookie sessions
 * - Supabase RLS is the primary data security layer
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Note: cacheComponents and partialPrefetching are disabled for static export
  // PPR (Partial Prerendering) is incompatible with output: 'export'
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
