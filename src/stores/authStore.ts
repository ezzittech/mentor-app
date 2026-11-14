"use client";

/**
 * Auth Store — Zustand
 *
 * Manages the authenticated user's session state client-side.
 * Uses Supabase browser client (no SSR cookies).
 * 
 * SECURITY: Supabase RLS policies enforce all data access rules.
 * Never trust client-side role/user data alone for access decisions.
 */

import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    
    // Get current session from localStorage (Supabase persists it)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await loadProfile(session.user, set);
    }

    set({ session, user: session?.user ?? null, isLoading: false, isInitialized: true });

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_IN" && newSession?.user) {
        await loadProfile(newSession.user, set);
        set({ session: newSession, user: newSession.user });
      } else if (event === "SIGNED_OUT") {
        set({ session: null, user: null, profile: null });
      } else if (event === "TOKEN_REFRESHED" && newSession) {
        set({ session: newSession });
      }
    });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    return { error: error?.message ?? null };
  },

  signUp: async (email, password, fullName) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    set({ isLoading: false });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: error?.message ?? null };
  },

  refreshProfile: async () => {
    const { user } = get();
    if (user) {
      await loadProfile(user, set);
    }
  },
}));

async function loadProfile(
  user: User,
  set: (partial: Partial<AuthState>) => void
) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = data as any;

  if (profile) {
    set({
      profile: {
        id: profile.id,
        fullName: profile.full_name,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        locale: (profile.locale as "ar" | "en") ?? "ar",
        timezone: profile.timezone ?? "UTC",
        role: profile.role,
        createdAt: profile.created_at,
      },
    });
  }
}
