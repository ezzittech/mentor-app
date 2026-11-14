"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const { t, locale, setLocale, direction } = useI18n();
  const { user, profile, signOut } = useAuthStore();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/mentors", label: t("nav.mentors") },
    { href: "/how-it-works", label: t("nav.howItWorks") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/about", label: t("nav.about") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-border/50"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <span
                className={[
                  "font-bold text-lg transition-colors",
                  isScrolled ? "text-foreground" : "text-white",
                ].join(" ")}
              >
                {t("common.platformName")}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? isScrolled
                        ? "bg-primary-50 text-primary"
                        : "bg-white/15 text-white"
                      : isScrolled
                      ? "text-muted hover:text-foreground hover:bg-surface"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isScrolled
                    ? "text-muted hover:text-foreground hover:bg-surface border border-border"
                    : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20",
                ].join(" ")}
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span>{locale === "ar" ? "EN" : "عر"}</span>
              </button>

              {user ? (
                /* Authenticated user menu */
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={[
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isScrolled
                        ? "bg-surface border border-border hover:border-primary/30 hover:bg-primary-50"
                        : "bg-white/10 border border-white/20 hover:bg-white/20 text-white",
                    ].join(" ")}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {(profile?.displayName || profile?.fullName || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block max-w-24 truncate">
                      {profile?.displayName || profile?.fullName || "User"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div
                      className={[
                        "absolute top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border/60 py-1.5 animate-scale-in",
                        direction === "rtl" ? "right-0" : "left-0",
                      ].join(" ")}
                    >
                      <div className="px-4 py-3 border-b border-border-subtle">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {profile?.fullName || "User"}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {profile?.role ? t(`roles.${profile.role}`) : ""}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted" />
                        {t("nav.dashboard")}
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface transition-colors"
                      >
                        <User className="w-4 h-4 text-muted" />
                        {t("nav.profile")}
                      </Link>
                      <div className="border-t border-border-subtle mt-1 pt-1">
                        <button
                          onClick={signOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-bg transition-colors w-full text-start"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("nav.logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest actions */
                <>
                  <Link
                    href="/login"
                    className={[
                      "hidden sm:flex px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isScrolled
                        ? "text-foreground hover:bg-surface border border-border"
                        : "text-white/90 hover:text-white hover:bg-white/10 border border-white/20",
                    ].join(" ")}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    className="flex px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={[
                  "md:hidden p-2 rounded-xl transition-colors",
                  isScrolled ? "text-foreground hover:bg-surface" : "text-white hover:bg-white/10",
                ].join(" ")}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-white/95 backdrop-blur-xl animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "flex px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary-50 text-primary"
                      : "text-foreground hover:bg-surface",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  className="flex px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface transition-colors"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
}
