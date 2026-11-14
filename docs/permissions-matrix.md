# MasarMentors — Permissions Matrix

**Phase:** 0–1 (Initial definition — will be enforced via Supabase RLS)

---

## Role Definitions

| Role | Arabic | Description |
|---|---|---|
| `guest` | زائر | Unauthenticated user — public pages only |
| `mentee` | متدرب | Registered learner |
| `mentor` | مرشد | Verified professional mentor |
| `supervisor` | مشرف | Coordinator who monitors mentee progress (assigned by admin) |
| `program_manager` | مدير برنامج | Manages groups/programs |
| `admin` | مسؤول | Full platform administration |
| `support` | دعم | Limited support access |

---

## Table-Level RLS Summary

| Table | Guest | Mentee | Mentor | Supervisor | Admin |
|---|---|---|---|---|---|
| `profiles` | — | Own only | Own only | Own only | All |
| `mentor_profiles` | Published+Verified | Published+Verified | Own | Assigned mentors | All |
| `mentorship_requests` | — | Own | Addressed to them | Assigned | All |
| `mentorship_relationships` | — | Own | Own | Assigned | All |
| `development_plans` | — | Own | Own mentees | Assigned mentees | All |
| `development_plan_goals` | — | Own plan | Own mentees | Assigned mentees | All |
| `development_tasks` | — | Own | Own mentees | Assigned mentees | All |
| `task_submissions` | — | Own | For review | Assigned | All |
| `meetings` | — | Participant | Participant | Assigned | All |
| `conversations` | — | Participant | Participant | — | All |
| `messages` | — | Participant | Participant | — | All |
| `notifications` | — | Own | Own | Own | All |
| `orders` | — | Own | — | — | All |
| `payments` | — | Own (read) | — | — | All |
| `audit_logs` | — | — | — | — | Read-only |
| `system_settings` | — | — | — | — | All |

---

## Key Business Rules

### Supervisor Assignment
- Supervisors are assigned by **Admin only** (not self-selected or by mentee)
- A mentor CAN also be a supervisor if the program policy allows it

### Plan Approval
- Plans require **mentee approval** before becoming `active`
- State machine: `draft → pending_approval → active`
- Mentor/supervisor can create; mentee approves

### Mentor Verification
- Mentor profiles are not visible until `is_published = true AND is_verified = true`
- Verification is done by Admin

### Data Isolation
- Mentors see ONLY their own assigned mentees
- Supervisors see ONLY their assigned mentees
- Messages between mentee and mentor are NOT visible to supervisor by default

---

## RLS Implementation Notes

```sql
-- Pattern: Row-level security using auth.uid()
-- Never trust user_id sent from the client; always use auth.uid()

-- Example: Mentee can only read their own development plan
CREATE POLICY "mentees_read_own_plan"
ON development_plans FOR SELECT
USING (mentee_id = auth.uid());

-- Example: Mentor can read plans for their mentees
CREATE POLICY "mentor_read_assigned_plans"
ON development_plans FOR SELECT
USING (mentor_id = auth.uid());

-- Example: Supervisor can read plans for assigned mentees
CREATE POLICY "supervisor_read_assigned_plans"
ON development_plans FOR SELECT
USING (
  id IN (
    SELECT plan_id FROM supervisor_assignments
    WHERE supervisor_id = auth.uid()
  )
);
```

> ⚠️ All RLS policies must be written and tested before any feature is considered "done".
