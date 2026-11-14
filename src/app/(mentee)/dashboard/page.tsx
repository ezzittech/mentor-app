"use client";

import { TrendingUp, CheckSquare, Calendar, Target, Clock, Star, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const { direction } = useI18n();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const card = (
    <div className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {href && (
          <ArrowIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm font-medium text-foreground mb-0.5">{label}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  desc,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {label}
        </div>
        <div className="text-xs text-muted mt-0.5">{desc}</div>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, desc, action }: {
  icon: string;
  title: string;
  desc: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-xs">{desc}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 px-5 py-2 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useI18n();
  const { profile } = useAuthStore();

  const name = profile?.displayName || profile?.fullName || "";
  const greeting = name
    ? t("dashboard.welcome", { name })
    : "أهلاً بك في مسار منتورز";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-primary-600 to-violet-700 rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 50%, white 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">مرحباً مجدداً 👋</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{greeting}</h2>
          <p className="text-white/70 text-sm">
            تابع رحلتك التطويرية وحقق أهدافك اليوم
          </p>
        </div>

        {/* Decorative */}
        <div className="absolute -end-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -end-4 -bottom-6 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Stats grid */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          {t("dashboard.overview")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label={t("dashboard.progress")}
            value="0%"
            sub="لم تبدأ بعد"
            color="bg-primary"
            href="/plan"
          />
          <StatCard
            icon={CheckSquare}
            label={t("dashboard.pendingTasks")}
            value={0}
            sub="لا مهام حالياً"
            color="bg-warning"
            href="/tasks"
          />
          <StatCard
            icon={Calendar}
            label={t("dashboard.upcomingSession")}
            value="—"
            sub="لا جلسات مجدولة"
            color="bg-success"
            href="/sessions"
          />
          <StatCard
            icon={Target}
            label={t("dashboard.completedGoals")}
            value={0}
            sub="من أهدافك"
            color="bg-violet-500"
            href="/plan"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">{t("dashboard.myPlan")}</h3>
            <Link
              href="/plan"
              className="text-xs text-primary font-medium hover:text-primary-hover transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          <EmptyState
            icon="📋"
            title="لم تُنشأ خطتك بعد"
            desc="أكمل التقييم الأولي وسيقوم مرشدك بإنشاء خطة تطوير مخصصة لك"
            action={{ label: "إكمال التقييم", href: "/assessment" }}
          />
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">إجراءات سريعة</h3>
          <QuickAction
            icon={Star}
            label="إكمال التقييم"
            desc="حدد أهدافك ومستواك الحالي"
            href="/assessment"
            color="bg-primary"
          />
          <QuickAction
            icon={Clock}
            label="البحث عن مرشد"
            desc="استعرض المرشدين المتاحين"
            href="/mentors"
            color="bg-violet-500"
          />
          <QuickAction
            icon={Calendar}
            label="جدولة جلسة"
            desc="احجز جلستك القادمة"
            href="/sessions/new"
            color="bg-success"
          />
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">النشاط الأخير</h3>
        </div>
        <EmptyState
          icon="📭"
          title="لا يوجد نشاط بعد"
          desc="ستظهر هنا آخر التحديثات والتغييرات في خطتك وجلساتك"
        />
      </div>
    </div>
  );
}
