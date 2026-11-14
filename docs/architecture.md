# MasarMentors — Architecture Document

**Version:** 1.0 (Phase 0–1)
**Updated:** 2026-11-14

---

## 1. Deployment Architecture

```
GitHub Repository (main branch)
         │
         │  GitHub Actions CI
         ▼
   npm run build          ← next build (output: 'export')
         │
         ▼
      /out/               ← Static HTML/CSS/JS files
         │
         ▼
  GitHub Pages            ← masarmentors.github.io
         │
         │  Browser requests
         ▼
  Client Browser          ← Full SPA, React 19 CSR
         │
         │  Supabase JS SDK (HTTPS)
         ▼
  Supabase Cloud
  ├── PostgreSQL (RLS enforced)
  ├── Supabase Auth (PKCE flow)
  └── Supabase Storage (private buckets)
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.4.6 |
| UI Library | React | 19.3.0 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4.3.3 |
| Backend | Supabase (PostgreSQL + Auth + Storage) | Cloud |
| Client SDK | @supabase/supabase-js | latest |
| State | Zustand | latest |
| Animation | Motion | latest |
| Icons | Lucide React | latest |
| Validation | Zod | latest |
| Forms | React Hook Form | latest |
| Dates | date-fns + date-fns-tz | latest |
| Hosting | GitHub Pages | Static export |

---

## 3. Auth Architecture

### Why Client-Side Auth?

GitHub Pages only serves static files. There is no server to:
- Read/write HTTP cookies
- Run middleware
- Execute server-side session validation

Therefore:
- Auth is handled entirely in the browser via `@supabase/supabase-js`
- Supabase uses **PKCE flow** (Proof Key for Code Exchange) — secure for SPAs
- Sessions are stored in `localStorage` by Supabase automatically
- **Supabase RLS policies are the ONLY real security boundary**

### Auth Flow

```
User submits login form
       │
       ▼
supabase.auth.signInWithPassword()
       │
       ▼
Supabase validates credentials
       │
       ▼
Returns JWT + refresh token → stored in localStorage
       │
       ▼
Zustand authStore updates UI state
       │
       ▼
All subsequent DB queries include JWT automatically
       │
       ▼
Supabase RLS checks auth.uid() on every query
```

### Security Model

```
Client              Supabase (PostgreSQL)
  │                        │
  │  SELECT * FROM plans   │
  │  WHERE id = $1  ───────►
  │                        │  RLS Policy:
  │                        │  auth.uid() = mentee_id
  │                        │  OR
  │                        │  auth.uid() = mentor_id
  │                        │  OR
  │                        │  auth.uid() IN (supervisor_ids)
  │  ◄─── Filtered data ───│
```

---

## 4. Data Flow

```
React Component
  │
  ├── useAuthStore (Zustand) ← session, profile, role
  │
  └── supabase.from('table').select() ← direct DB queries
              │
              ▼
        PostgreSQL + RLS
              │
              ▼
        Filtered results based on auth.uid()
```

---

## 5. i18n Architecture

- Default locale: Arabic (RTL)
- Supported: Arabic (`ar`), English (`en`)
- Locale stored in `localStorage` key: `masarmentors_locale`
- `<html lang="ar" dir="rtl">` updated dynamically via `useEffect`
- Translations: `src/i18n/locales/{ar,en}/common.json`
- Provider: `I18nProvider` in `src/i18n/index.tsx`
- Hook: `useI18n()` → `{ t, locale, setLocale, direction }`

---

## 6. Routing Structure

```
/ ─────────────── Redirects to /home
/home ─────────── Public homepage (Hero, How It Works, Features, CTA)
/mentors ─────── Browse mentor profiles
/mentors/[id] ── Individual mentor profile
/how-it-works ── Explainer page
/pricing ──────── Pricing & packages
/about ─────────── About page

/login ─────────── Authentication form
/register ──────── Registration form
/forgot-password ── Password reset request

/dashboard ──────── Mentee dashboard
/plan ───────────── Development plan
/tasks ──────────── Task list
/sessions ───────── Session management
/messages ───────── Messaging
/resources ─────── Learning resources
/assessment ─────── Initial assessment
/profile ────────── User profile
/settings ───────── User settings

/mentor/dashboard ── Mentor dashboard
/supervisor/dashboard ── Supervisor dashboard
/admin/ ─────────────── Admin area
```

---

## 7. Supabase Project Setup Checklist

Before connecting the app:

1. Create a Supabase project at https://supabase.com
2. Enable Email auth (Settings > Authentication)
3. Set `Site URL` to your GitHub Pages URL
4. Add `https://your-username.github.io` to Redirect URLs
5. Run migrations in `supabase/migrations/`
6. Enable RLS on all tables
7. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

---

## 8. Known Constraints

| Constraint | Reason | Mitigation |
|---|---|---|
| No SSR | GitHub Pages static hosting | Full CSR, localStorage auth |
| No server-side redirects | Static files only | Client-side router guards |
| No server-side API keys | No backend | Edge Functions for sensitive ops |
| No `next/headers` | Static export | N/A — not needed |
| No middleware | Static export | Client-side auth guard in layouts |
