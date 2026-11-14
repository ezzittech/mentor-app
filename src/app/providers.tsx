"use client";

/**
 * Root Providers
 * Wraps the application with all necessary context providers.
 * Order matters: I18nProvider → AuthInitializer → children
 */

import { useEffect } from "react";
import { I18nProvider } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show nothing until auth is initialized to prevent flash of wrong state
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">MasarMentors</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </I18nProvider>
  );
}
