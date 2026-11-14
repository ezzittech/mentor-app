"use client";

import Link from "next/link";
import { ArrowLeft, Star, TrendingUp, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection() {
  const { t, direction } = useI18n();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Mesh overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-1/4 start-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full bg-accent-400/10 blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
          <span className="text-sm text-white/90 font-medium">
            منصة الإرشاد المهني الرائدة
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          {t("home.heroTitle")}
          <span className="block mt-2 bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
            بثقة واحترافية
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl sm:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          {t("home.heroSubtitle")}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/register"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg"
          >
            {t("home.heroCta")}
            <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/mentors"
            className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-300 text-lg"
          >
            {t("home.secondaryCta")}
          </Link>
        </div>

        {/* Stats pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-16 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          {[
            { value: "200+", label: t("home.statsMentors"), icon: "👨‍💼" },
            { value: "1,500+", label: t("home.statsMentees"), icon: "🎓" },
            { value: "8,000+", label: t("home.statsGoals"), icon: "🏆" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3"
            >
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-start">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 60C480 40 240 80 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────

function HowItWorksSection() {
  const { t } = useI18n();

  const steps = [
    {
      icon: "📋",
      title: t("home.step1Title"),
      desc: t("home.step1Desc"),
      color: "from-primary-400 to-primary-600",
      num: "01",
    },
    {
      icon: "🤝",
      title: t("home.step2Title"),
      desc: t("home.step2Desc"),
      color: "from-violet-400 to-violet-600",
      num: "02",
    },
    {
      icon: "🚀",
      title: t("home.step3Title"),
      desc: t("home.step3Desc"),
      color: "from-accent-400 to-accent-600",
      num: "03",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            رحلة التطوير
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("home.howItWorksTitle")}
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            ثلاث خطوات بسيطة لبدء رحلتك التطويرية الاحترافية
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative bg-surface rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Number */}
              <div className="absolute top-6 end-6 text-6xl font-black text-border/40 select-none">
                {step.num}
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ───────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    { icon: "🎯", title: "خطة تطوير مخصصة", desc: "خطة فردية بأهداف ومراحل ومهام تناسب احتياجاتك تماماً" },
    { icon: "👥", title: "مرشدون معتمدون", desc: "مرشدون محترفون تم التحقق منهم في مجالات متنوعة" },
    { icon: "📊", title: "متابعة التقدم", desc: "لوحة تحكم ذكية تعرض تقدمك بشكل واضح ومفهوم" },
    { icon: "🔔", title: "إشراف منهجي", desc: "مشرف يتابع التزامك ويتدخل عند الحاجة لإعادتك للمسار" },
    { icon: "📚", title: "موارد تعلم", desc: "مصادر تعليمية مرتبطة بأهدافك ومهامك مباشرة" },
    { icon: "🌍", title: "دعم ثنائي اللغة", desc: "منصة متكاملة بالعربية والإنجليزية مع دعم RTL/LTR" },
  ];

  return (
    <section className="py-24 gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white text-primary rounded-full px-4 py-2 text-sm font-medium mb-4 shadow-sm border border-border">
            <CheckCircle className="w-4 h-4" />
            ما يميزنا
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            كل ما تحتاجه في مكان واحد
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            منصة متكاملة صممت خصيصاً لرحلة التطوير المهني من البداية حتى النهاية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-border/40 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                {f.icon}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  const { t, direction } = useI18n();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative bg-gradient-to-br from-primary-600 to-violet-700 rounded-3xl px-8 py-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 0%, transparent 50%),
                                radial-gradient(circle at 80% 50%, white 0%, transparent 50%)`,
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              ابدأ رحلتك اليوم
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              انضم إلى آلاف المحترفين الذين غيّروا مساراتهم المهنية مع مرشد متخصص
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-3 px-8 py-4 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 transition-all duration-300 shadow-xl"
              >
                {t("home.heroCta")}
                <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/mentors"
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl border border-white/30 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                {t("home.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
