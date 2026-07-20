# Phase 0 — Foundation

**Duration:** 1–2 weeks
**Deliverable:** Palata MMS running under the StudioOS name/branding, auth-gated, with the `persons`/role-assignment model in place and the schema delta applied. No booking, curriculum, or academy modules yet.

---

## 1. Context (paste into the Claude Code session)

- Current Palata MMS stack: React 19 + Vite frontend, Express.js + Mongoose + MongoDB backend, CASL for RBAC, JWT dual-token auth, Auth0 Google social login (recently integrated), Socket.IO, Bull/Redis, Cloudflare R2.
- Current domain model: municipality → wards/offices → departments → users (one role per user) → citizens/applications.
- Target domain model: tenant (studio brand) → branches → **persons** (who can hold multiple simultaneous role-assignments: client, student, staff, instructor) → services/courses (added in later phases).

Paste the actual current `User`, `Ward`/`Office`, and `Department` Mongoose schemas here before starting the session, alongside this target shape, so Claude Code can see the real delta rather than guessing at Palata's current field names.

---

## 2. Scope

**In scope:**
- Fork/branch the Palata MMS repo as the StudioOS base (no new scaffold, no new monorepo).
- Generalize "municipality/ward" → "tenant/branch" terminology wherever it's hardcoded (models, route names, UI copy) — as a reversible migration, not a destructive rewrite.
- Design and implement the `persons` + `role_assignments` collections (see §3 below) — this is the one piece with no Palata equivalent.
- Extend the existing CASL ability rules to cover the new roles: Owner, Branch Manager, Stylist, Instructor, Student, Receptionist, Client.
- Extend the existing auth/invite flow for studio-style staff onboarding (unchanged Auth0 Google flow for staff).
- Add a lightweight OTP (phone-based) login path for the client-facing side — separate from the staff Auth0 flow, since salon clients in Nepal are far more likely to have a phone than a Google account habit for this kind of app.
- Stand up a separate Coolify staging environment for StudioOS, same CI/GitHub Actions pattern already used for Reliance Paints.

**Out of scope (do not build yet):**
- Any booking, service catalog, course, or curriculum logic.
- POS, billing, inventory.
- Client/student self-service portals (Phase 6).

---

## 3. Data Model — the one genuinely new piece

```
persons {
  _id
  tenant_id
  full_name
  phone
  email (optional)
  auth_provider: "auth0" | "otp"
  created_at
}

role_assignments {
  _id
  person_id → persons
  tenant_id
  branch_id
  role: "owner" | "branch_manager" | "stylist" | "instructor" | "student" | "receptionist" | "client"
  status: "active" | "inactive"
  started_at
  ended_at (nullable)
}
```

Design notes to enforce in this phase:
- A single `person` can have multiple `role_assignments` active at once (e.g. Student + Client). Do not model roles as an enum field on the person record — this is the mistake that would need a costly retrofit later.
- `role_assignments` should be branch-scoped, since a person could be Staff at Branch A and a Client at Branch B in a multi-branch chain.
- CASL abilities should be derived from the **union of active role_assignments** for the current tenant/branch context, not from a single role field.

---

## 4. Backend Tasks

- [ ] Migration script: existing Palata `User` documents → `persons` + one `role_assignments` row each (map existing single-role field to the new structure).
- [ ] New Mongoose models: `Person`, `RoleAssignment`, `Tenant` (rename of Municipality if not already generic), `Branch` (rename of Ward/Office if not already generic).
- [ ] CASL ability builder updated to accept multiple role_assignments and union their permissions.
- [ ] Auth middleware updated to attach the person's active role_assignments (for current tenant/branch) to the request context.
- [ ] New OTP auth endpoints: request-OTP, verify-OTP, issue JWT (reuse existing dual-token issuance logic).
- [ ] Tenant/branch CRUD endpoints, generalized from existing municipality/ward endpoints.

## 5. Frontend Tasks

- [ ] Rename pass: municipality/ward copy → tenant/branch copy across the existing UI shell (nav, breadcrumbs, settings pages).
- [ ] New client-facing login screen (phone + OTP).
- [ ] Staff onboarding/invite flow updated for the new role list.
- [ ] Branch switcher component (if a staff member has role_assignments across multiple branches).

## 6. Constraints

- Follow existing Palata MMS folder structure, CASL ability pattern, and Mongoose schema conventions — do not introduce a second pattern for "the new stuff."
- Migration must be reversible (keep old fields until the new model is verified in staging).
- Reuse the existing Coolify + GitHub Actions deploy pattern; do not hand-roll a new CI pipeline.

## 7. Acceptance Criteria

- [ ] A single `person` can hold two simultaneous `role_assignments` (e.g. client + student) and both are visible in the admin UI.
- [ ] CASL correctly grants the union of permissions for a person with multiple active roles.
- [ ] Existing staff can still log in via Auth0 Google exactly as before.
- [ ] A new client can register and log in via phone OTP.
- [ ] Tenant/branch structure is confirmed working with at least 2 branches under 1 tenant in staging.
- [ ] StudioOS staging environment is live on Coolify, deployed via the same GitHub Actions workflow pattern.
