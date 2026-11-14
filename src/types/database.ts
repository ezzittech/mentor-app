/**
 * Supabase Database Types (Phase 0 — Placeholder)
 *
 * These types will be auto-generated from the Supabase schema after migrations
 * are applied. Run: npx supabase gen types typescript --local > src/types/database.ts
 *
 * For now, a placeholder type is provided to allow TypeScript to compile.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string | null;
          display_name: string | null;
          avatar_url: string | null;
          locale: string;
          timezone: string;
          role: UserRole;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          timezone?: string;
          role?: UserRole;
        };
        Update: {
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          timezone?: string;
          role?: UserRole;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
  };
}

export type UserRole =
  | "guest"
  | "mentee"
  | "mentor"
  | "supervisor"
  | "program_manager"
  | "admin"
  | "support";
