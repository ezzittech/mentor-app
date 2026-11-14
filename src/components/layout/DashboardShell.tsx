"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, ClipboardList, CheckSquare, Calendar,
  MessageSquare, BookOpen, Settings, LogOut, Menu, X, Bell,
  ChevronDown, TrendingUp, Users,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelKey: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { href: "/profile", icon: User, labelKey: "nav.profile" },
  { href: "/plan", icon: ClipboardList, labelKey: "dashboard.myPlan" },
  { href: "/tasks", icon: CheckSquare, labelKey: "dashboard.myTasks" },
  { href: "/sessions", icon: Calendar, labelKey: "dashboard.mySessions" },
  { href: "/messages", icon: MessageSquare, labelKey: "nav.dashboard" },
  { href: "/resources", icon: BookOpen, labelKey: "mentors.specializations" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
];

export function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { profile, signOut } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-bold text-sm">م</span>
        </div>
        <span className="font-bold text-foreground text-base">MasarMentors</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-primary-50 text-primary shadow-sm"
                  : "text-muted hover:text-foreground hover:bg-surface",
              ].join(" ")}
            >
              <Icon
                className={[
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                ].join(" ")}
              />
              <span className="truncate">{t(item.labelKey)}</span>
              {item.badge ? (
                <span className="ms-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {item.badge}
                </span>
              ) : null}
              {active && (
                <div className="ms-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile + Signout */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {(profile?.displayName || profile?.fullName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.displayName || profile?.fullName || "User"}
            </p>
            <p className="text-xs text-muted truncate">
              {profile?.role ? t(`roles.${profile.role}`) : ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-bg w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-white border-e border-border h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="lg:hidden fixed inset-y-0 start-0 z-50 w-72 bg-white shadow-2xl animate-slide-in-left flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 rounded-lg text-muted hover:bg-surface"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

export function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t, locale, setLocale } = useI18n();
  const { profile } = useAuthStore();
  const pathname = usePathname();

  // Derive page title from path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return t("nav.dashboard");
    if (pathname.startsWith("/plan")) return t("dashboard.myPlan");
    if (pathname.startsWith("/tasks")) return t("dashboard.myTasks");
    if (pathname.startsWith("/sessions")) return t("dashboard.mySessions");
    if (pathname.startsWith("/profile")) return t("nav.profile");
    if (pathname.startsWith("/settings")) return t("nav.settings");
    return "MasarMentors";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-border flex items-center justify-between gap-4 px-4 md:px-6 h-16">
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-muted hover:bg-surface transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-foreground">{getPageTitle()}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface border border-border transition-all"
        >
          <span>{locale === "ar" ? "EN" : "عر"}</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">
            {(profile?.displayName || profile?.fullName || "U").charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
