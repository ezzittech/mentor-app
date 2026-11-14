/**
 * Shared TypeScript Types — MasarMentors
 */

export type { UserRole } from "./database";

// ─── Locale & i18n ────────────────────────────────────────────────────────────

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

// ─── API / Result types ────────────────────────────────────────────────────────

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── User ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  locale: Locale;
  timezone: string;
  role: import("./database").UserRole;
  createdAt: string;
}

// ─── Mentor ────────────────────────────────────────────────────────────────────

export interface MentorProfile {
  id: string;
  userId: string;
  bio: string | null;
  specializations: string[];
  skills: string[];
  languages: string[];
  timezone: string;
  mentorshipStyle: string | null;
  isPublished: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
}

// ─── Development Plan ─────────────────────────────────────────────────────────

export type PlanStatus =
  | "draft"
  | "pending_approval"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "needs_revision"
  | "completed"
  | "cancelled";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "cancelled";
