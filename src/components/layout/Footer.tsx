"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <span className="font-bold text-lg text-white">
                {t("common.platformName")}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              {t("common.platformTagline")}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              المنصة
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/mentors", label: t("nav.mentors") },
                { href: "/how-it-works", label: t("nav.howItWorks") },
                { href: "/pricing", label: t("nav.pricing") },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              الشركة
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: t("nav.about") },
                { href: "/terms", label: "الشروط والأحكام" },
                { href: "/privacy", label: "سياسة الخصوصية" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              الدعم
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/faq", label: "الأسئلة الشائعة" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} MasarMentors. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40">🇸🇦 العربية / English 🌍</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
