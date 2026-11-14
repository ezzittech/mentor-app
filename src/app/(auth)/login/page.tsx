"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const { t, direction } = useI18n();
  const { signIn, isLoading } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t("auth.errors.invalidCredentials"));
      return;
    }

    const result = await signIn(email, password);
    if (result.error) {
      setError(t("auth.errors.invalidCredentials"));
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 gradient-primary" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">م</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("auth.login")}
            </h1>
            <p className="text-muted text-sm mt-2">
              مرحباً بعودتك إلى مسار منتورز
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-error-bg border border-error/20 text-error rounded-xl px-4 py-3 text-sm mb-6 animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  {t("auth.password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary-hover transition-colors"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full ps-10 pe-10 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-3 py-3.5 px-6 gradient-primary text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t("auth.loginButton")}
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-muted-foreground">
                {t("common.or")}
              </span>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-muted">
            {t("auth.noAccount")}{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              {t("auth.registerHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
