# Phase 6 — Portals (Client & Student Self-Service)

**Deliverable:** External-facing access without exposing the admin surface. Clients and students get self-service views built as route groups under the shared app, not separate apps.

---

## 1. Context

Depends on the Phase 0 OTP client login, Phase 1 client profiles, Phase 2 enrollments/attendance, Phase 3 appointments/session logs, Phase 4 certification progress, and Phase 5 invoices all existing already. This phase is primarily a **read/self-service UI layer** over data that already exists — very little new backend logic beyond permission scoping.

## 2. Scope

**In scope:**
- Client portal: view upcoming/past appointments, book a new appointment (self-service booking, constrained to available slots/practitioners), view visit history and invoices, download invoices.
- Student portal: view class schedule, attendance record, curriculum progress dashboard (same data as Phase 4's instructor view, scoped to self), download certificate once issued, view portfolio (before/after photos from sessions where they were the practitioner).
- Role-based middleware restricting each portal strictly to the logged-in person's own records (no cross-client/cross-student visibility).
- Build as route groups (e.g. `/portal/client/...`, `/portal/student/...`) under the existing Next.js/React app, not standalone apps.

**Out of scope:**
- Any admin/staff-facing functionality (already built in prior phases).
- Payment processing in the portal (invoices are viewable/downloadable, not payable online, unless Stripe is prioritized ahead of schedule from Phase 10).

## 3. Data Model

No new core entities — this phase is additive UI/permissions work on top of existing models from Phases 0–5. If needed:

```
portal_preferences {
  _id, person_id → persons
  notification_opt_ins: [string]
  preferred_language
}
```

## 4. Backend Tasks

- [ ] Scoped read endpoints for client portal: `GET /portal/client/appointments`, `GET /portal/client/invoices` — filtered strictly to the authenticated person's `client_person_id`.
- [ ] Self-service booking endpoint: reuses Phase 3's appointment creation logic, but constrained (client cannot assign a specific practitioner beyond what's offered as available; cannot override the supervising-instructor requirement).
- [ ] Scoped read endpoints for student portal: schedule, attendance, curriculum progress, certificate download link.
- [ ] Middleware audit: verify no endpoint in this phase can be used to query another person's records by ID manipulation (a straightforward but important pass, since this is the first phase exposing data outside the staff-only admin surface).

## 5. Frontend Tasks

- [ ] Client portal: appointment list, booking flow, invoice list/download.
- [ ] Student portal: schedule view, attendance summary, progress dashboard (reuse Phase 4's dashboard component, scoped), portfolio gallery, certificate download.
- [ ] Shared portal shell (nav, branding) distinct from the staff admin shell, but same codebase/route-group approach.

## 6. Constraints

- Do not build separate frontend apps — route groups with role-based middleware in the existing app, as specified in the original plan.
- This phase is where the persons/role_assignments model's security boundary gets tested for real — prioritize the middleware audit over new features if time is short.

## 7. Acceptance Criteria

- [ ] A client can log in via OTP and see only their own appointments and invoices.
- [ ] A client can self-book an appointment within the allowed constraints.
- [ ] A student can log in and see only their own schedule, attendance, and curriculum progress.
- [ ] A student can download their certificate once issued (from Phase 4).
- [ ] Attempting to access another person's records via direct API/URL manipulation is rejected at the middleware level.
