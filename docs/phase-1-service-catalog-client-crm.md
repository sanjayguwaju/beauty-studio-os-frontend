# Phase 1 — Service Catalog & Client CRM (Salon Side, CRUD Only)

**Deliverable:** CRUD-complete salon CRM and service catalog. No booking engine yet — this phase is purely about the records the booking engine will operate on in Phase 3.

---

## 1. Context

Builds on Phase 0's `persons`/`role_assignments` model. Any `person` with an active `client` role_assignment gets a client profile record in this phase. Reuse Palata's existing document-upload (R2) setup and its existing search implementation rather than introducing new infra for either.

## 2. Scope

**In scope:**
- Service catalog: categories (Hair, Skin/Facial, Nails, Spa), individual services with duration, solo price, and supervised price (the discounted rate for student-performed services — needed later for booking/billing, defined now).
- Client profile: contact info (pulled from `persons`), visit history placeholder, preferences, allergy/patch-test notes.
- Staff profile: stylist skills/specialties, working hours, branch assignment (staff = person with `stylist` or `branch_manager` role_assignment).
- Search across clients (name/phone) and services (name/category) — extend Palata's existing search rather than adding a new search stack (e.g. if Palata uses Mongo text indexes or Atlas Search, reuse that).
- Role-based access: Receptionist can view/edit client profiles; Stylist can view but not edit pricing; Branch Manager can edit the service catalog.

**Out of scope:**
- Appointments/bookings (Phase 3).
- Billing/invoicing (Phase 5).
- Client self-service (Phase 6).

## 3. Data Model

```
service_catalog {
  _id, tenant_id, branch_id (nullable = all branches)
  category: "hair" | "facial" | "nails" | "spa"
  name, description
  duration_minutes
  price_solo
  price_supervised   // discounted rate when performed by a student
  active: boolean
}

client_profiles {
  _id, person_id → persons, tenant_id
  preferences: [string]
  allergy_notes: string
  patch_test_on_file: boolean
  patch_test_date
}

staff_profiles {
  _id, person_id → persons, tenant_id, branch_id
  specialties: [service_category]
  working_hours: [{ day, start, end }]
}
```

## 4. Backend Tasks

- [ ] CRUD endpoints for `service_catalog`, `client_profiles`, `staff_profiles`.
- [ ] Validation: `price_supervised` must be ≤ `price_solo` if both are set.
- [ ] Search endpoints: client search by name/phone, service search by name/category — extend existing Palata search implementation.
- [ ] CASL rules: Receptionist (client CRUD, no service pricing edit), Stylist (read client, read own staff profile), Branch Manager (full CRUD in-branch).

## 5. Frontend Tasks

- [ ] Service catalog management screen (list, add, edit, category filter).
- [ ] Client list + client detail screen (profile, preferences, allergy notes — visit history section left as a placeholder for Phase 3).
- [ ] Staff directory screen (specialties, working hours, branch).
- [ ] Search bar wired to the new search endpoints.

## 6. Constraints

- Reuse existing R2 upload config for any client document attachments (add a `studioos/clients/` prefix rather than a new bucket).
- Do not build a booking calendar in this phase, even as a stub — keep the boundary clean for Phase 3.

## 7. Acceptance Criteria

- [ ] A service can be created with both solo and supervised pricing, and the validation rule is enforced.
- [ ] A client profile can be created, edited, and searched by phone number.
- [ ] A staff profile is correctly linked to an existing `person` with a `stylist` role_assignment.
- [ ] Receptionist role cannot edit service pricing; Branch Manager can.
