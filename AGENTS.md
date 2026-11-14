# MasarMentors — AGENTS.md

This file is the authoritative guide for AI agents and developers working on this repository.

---

## 1. The Reference Document

**`MASTER_IMPLEMENTATION_PLAN_V2.md`** is the primary functional specification.
Read it in full before writing any code. The architectural exceptions below override specific sections.

---

## 2. Architectural Exceptions (GitHub Pages Deployment)

| Concern | MASTER_PLAN says | THIS PROJECT DOES |
|---|---|---|
| Hosting | Next.js Runtime / Vercel | Static Export → GitHub Pages |
| Rendering | SSR + Server Components | CSR (Client-Side Rendering) only |
| Auth | `@supabase/ssr` + cookies | `@supabase/supabase-js` browser client |
| Session | Server-side cookie sessions | `localStorage` via Supabase PKCE flow |
| Security | Server checks + RLS | **Supabase RLS is the SOLE backend guard** |

**Consequence:** Every page is a Client Component (`"use client"`). No `server.ts` supabase client. No middleware. No Route Handlers. No Server Actions.

---

## 3. Project Commands

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Type check
npx tsc --noEmit

# Build for static export (outputs to /out directory)
npm run build

# Preview the static export locally
npx serve out
```

---

## 4. Tech Stack (Pinned Versions)

| Library | Version | Purpose |
|---|---|---|
| next | 16.4.6 | Framework (SPA/static export mode) |
| react | 19.3.0 | UI |
| typescript | ^5 | Type safety |
| tailwindcss | 4.3.3 | Styling |
| @supabase/supabase-js | latest | DB + Auth + Storage |
| zustand | latest | UI state only |
| motion | latest | Transitions |
| lucide-react | latest | Icons |
| zod | latest | Input validation |
| react-hook-form | latest | Complex forms |
| date-fns + date-fns-tz | latest | Dates + timezones |

---

## 5. Directory Structure

```
src/
  app/
    (public)/     ← Public pages (homepage, mentors listing, etc.)
    (auth)/       ← Login, Register, Forgot Password
    (mentee)/     ← Mentee dashboard and sub-pages
    (mentor)/     ← Mentor dashboard
    (supervisor)/ ← Supervisor dashboard
    (admin)/      ← Admin dashboard
  components/
    ui/           ← Reusable primitive UI components (Button, Card, etc.)
    layout/       ← Navbar, Footer, DashboardShell
    forms/        ← Form components
    data-display/ ← Tables, charts, stat cards
  features/       ← Domain logic per feature (mentors, plans, tasks...)
  lib/
    supabase/     ← client.ts (browser Supabase client only)
    auth/         ← Auth helpers
    permissions/  ← Role-based access checks
    validation/   ← Zod schemas
    dates/        ← Timezone utilities
    utils/        ← General utilities
  stores/         ← Zustand stores (authStore, uiStore...)
  hooks/          ← Custom React hooks
  types/          ← TypeScript types (database.ts, index.ts)
  i18n/           ← Translation provider + locale JSON files
supabase/
  migrations/     ← SQL migration files (versioned, reviewed before apply)
  functions/      ← Edge Functions for sensitive operations
docs/             ← Architecture, data model, permissions, decisions
```

---

## 6. Coding Rules

### Security
- **NEVER** put `service_role` or admin keys in `NEXT_PUBLIC_*` variables.
- **NEVER** trust client-side role/user data alone for access decisions — Supabase RLS is the enforcer.
- Write and test RLS policies before shipping any feature.
- Do not build SQL queries from raw user input.

### Auth Pattern
```typescript
// ✅ Correct — browser client
import { supabase } from "@/lib/supabase/client";

// ❌ Wrong — no server client for static export
import { createServerClient } from "@supabase/ssr"; // DO NOT USE
```

### State Management
- Supabase is the **source of truth** for all persistent data.
- Zustand is for **UI state only** (sidebar open, temporary filters, etc.).
- Do NOT cache DB data in Zustand or localStorage.

### i18n
- All UI strings live in `src/i18n/locales/{ar,en}/common.json`.
- Use `const { t } = useI18n()` for all translated strings.
- Always test RTL layout for every new component.
- Use `ps-*` / `pe-*` / `start-` / `end-` Tailwind utilities (not `pl-` / `pr-` / `left-` / `right-`).

### Component Pattern
```typescript
// Always "use client" for components that use hooks or browser APIs
"use client";

import { useI18n } from "@/i18n";
import { useAuthStore } from "@/stores/authStore";
```

### Forms
- Use `react-hook-form` + `zod` for complex forms.
- Validate on the client, but Supabase RLS is the real security guard.
- Always show loading, success, error, and empty states.

---

## 7. Business Rules (Phase 0 Decisions)

| Decision | Answer |
|---|---|
| Platform name | MasarMentors (مسار منتورز) |
| Supervisor assigned by | Admin (not by mentee) |
| Can mentor also be supervisor? | Yes, if policy allows |
| Mentee must approve plan | Yes — plan requires mentee approval before activation |
| Initial MVP languages | Arabic (default) + English |
| Auth flow type | PKCE (Supabase recommended for SPAs) |

---

## 8. Phased Development

Work one phase at a time. Do not start Phase N+1 before Phase N passes its acceptance criteria.

| Phase | Focus | Status |
|---|---|---|
| 0 | Discovery, Docs, Architecture | ✅ Done |
| 1 | Project foundation, Auth, i18n, Layout | ✅ Done |
| 2 | Mentor profiles & search | 🔜 Next |
| 3 | Mentorship requests & relationships | ⏳ |
| 4 | Assessment & development plans | ⏳ |
| 5 | Tasks & supervision | ⏳ |
| 6 | Sessions & messaging | ⏳ |
| 7 | Learning resources | ⏳ |
| 8 | Payments & commissions | ⏳ |
| 9 | Admin & reports | ⏳ |
| 10 | Testing & launch | ⏳ |

---

## 9. Definition of Done

A feature is NOT complete unless:
- [ ] Business logic and rules are documented
- [ ] All inputs validated (client-side, with Zod)
- [ ] RLS policies written and manually tested
- [ ] Loading / success / error / empty states implemented
- [ ] RTL layout tested
- [ ] No hardcoded strings — all text in i18n files
- [ ] No fake/mock data in production paths
- [ ] TypeScript errors: 0

---

## 10. What NOT to Do

- Do not add `@supabase/ssr` — this is a static export project
- Do not use `next/headers` or `cookies()` — not available in static export
- Do not add `getServerSideProps` or `getStaticProps` patterns — App Router only
- Do not implement Zoom / Google Meet / Udemy Business integrations before verifying API access and commercial terms
- Do not store secrets in the repository
- Do not delete existing files without understanding their impact
