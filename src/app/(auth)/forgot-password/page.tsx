"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { resetPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = await resetPassword(email);
    if (result.error) {
      setError(t("auth.errors.genericError"));
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
          <div className="h-1.5 bg-success" />
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("auth.checkEmail")}</h2>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {t("auth.resetLinkSent")}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl transition-all hover:opacity-90"
            >
              {t("auth.loginHere")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
        <div className="h-1.5 gradient-primary" />

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("auth.resetPassword")}
            </h1>
            <p className="text-muted text-sm mt-2">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
            </p>
          </div>

          {error && (
            <div className="bg-error-bg border border-error/20 text-error rounded-xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 gradient-primary text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t("auth.sendResetLink")
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">
              {t("auth.loginHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
