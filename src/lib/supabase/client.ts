/**
 * Supabase Browser Client
 *
 * ARCHITECTURAL DECISION (Phase 0 / GitHub Pages SPA):
 * - Uses @supabase/supabase-js directly in the browser (no @supabase/ssr)
 * - Auth is fully client-side; sessions are stored in localStorage
 * - Supabase RLS policies are the SOLE backend security mechanism
 * - NEXT_PUBLIC_ vars are intentionally exposed to the browser (anon key only)
 * - NEVER put service_role or admin keys in NEXT_PUBLIC_ vars
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store sessions in localStorage for SPA / static hosting
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Use PKCE flow for secure auth code exchange (recommended for SPAs)
    flowType: "pkce",
  },
});

export default supabase;
