"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const { t, direction } = useI18n();
  const { signUp, isLoading } = useAuthStore();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t("auth.errors.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordMismatch"));
      return;
    }

    const result = await signUp(email, password, fullName);
    if (result.error) {
      if (result.error.includes("already")) {
        setError(t("auth.errors.emailAlreadyUsed"));
      } else {
        setError(t("auth.errors.genericError"));
      }
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
              <span className="text-3xl">✉️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("auth.checkEmail")}</h2>
            <p className="text-muted text-sm leading-relaxed mb-6">{t("auth.resetLinkSent")}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary-hover transition-colors"
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">م</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("auth.register")}
            </h1>
            <p className="text-muted text-sm mt-2">
              انضم إلى مجتمع مسار منتورز المهني
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error-bg border border-error/20 text-error rounded-xl px-4 py-3 text-sm mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.fullName")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  autoComplete="name"
                  required
                  className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  autoComplete="new-password"
                  required
                  className="w-full ps-10 pe-10 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        password.length >= level * 2
                          ? password.length >= 12
                            ? "bg-success"
                            : password.length >= 8
                            ? "bg-warning"
                            : "bg-error"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className={[
                    "w-full ps-10 pe-4 py-3 rounded-xl border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm",
                    confirmPassword && confirmPassword !== password
                      ? "border-error/60 focus:ring-error/20"
                      : "border-border",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted text-center">
              بالتسجيل، أوافق على{" "}
              <Link href="/terms" className="text-primary hover:underline">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                سياسة الخصوصية
              </Link>
            </p>

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
                  {t("auth.registerButton")}
                  <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-muted-foreground">{t("common.or")}</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-primary-hover transition-colors"
            >
              {t("auth.loginHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
