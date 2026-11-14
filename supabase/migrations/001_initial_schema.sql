-- MasarMentors — Initial Database Migration
-- Phase 1: Core user/profile tables with RLS
-- Run via: Supabase Dashboard > SQL Editor, or supabase db push

-- ─── Extensions ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'guest',
  'mentee',
  'mentor',
  'supervisor',
  'program_manager',
  'admin',
  'support'
);

CREATE TYPE plan_status AS ENUM (
  'draft',
  'pending_approval',
  'active',
  'paused',
  'completed',
  'cancelled'
);

CREATE TYPE task_status AS ENUM (
  'not_started',
  'in_progress',
  'submitted',
  'needs_revision',
  'completed',
  'cancelled'
);

CREATE TYPE request_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'cancelled'
);

CREATE TYPE relationship_status AS ENUM (
  'pending_setup',
  'active',
  'paused',
  'completed',
  'cancelled'
);

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- Extends auth.users. Created automatically via trigger on signup.

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name     TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  locale        TEXT NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  timezone      TEXT NOT NULL DEFAULT 'UTC',
  role          user_role NOT NULL DEFAULT 'mentee',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  deleted_at    TIMESTAMPTZ -- Soft delete
);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── Auto-create profile on signup ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, locale)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'ar')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── RLS — Profiles ───────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_read_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles_admin_read_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─── Audit Log ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id    UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  table_name  TEXT,
  record_id   TEXT,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  user_agent  TEXT
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_logs_admin_only"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- System/trusted functions can insert (no direct user inserts)
-- INSERT via SECURITY DEFINER functions only

-- ─── System Settings ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.system_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  UUID REFERENCES auth.users(id)
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "system_settings_admin_only"
  ON public.system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ─── Seed: Default system settings ───────────────────────────────────────────

INSERT INTO public.system_settings (key, value) VALUES
  ('learning_providers_enabled', 'false'),
  ('zoom_integration_enabled', 'false'),
  ('google_meet_integration_enabled', 'false'),
  ('payment_enabled', 'false'),
  ('mentor_verification_required', 'true')
ON CONFLICT (key) DO NOTHING;
