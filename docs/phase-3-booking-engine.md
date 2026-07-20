# Phase 3 — Booking Engine + the Integration Spine

**Deliverable:** This is the core of the product. A booking can be fulfilled by a regular Stylist or by a Student-under-supervision, and completed supervised sessions automatically credit the student's curriculum progress. Do not cut anything in this phase for MVP — this link is the differentiator.

---

## 1. Context

Depends on Phase 1 (service catalog, client profiles) and Phase 2 (courses, enrollments, curriculum items) both being complete. Reuse Palata's existing Socket.IO setup for real-time sync and its existing calendar/scheduling UI if one exists from the department workflow module — extend rather than rebuild.

## 2. Scope

**In scope:**
- Appointment creation: client + service + branch + time slot + assigned practitioner (Stylist **or** Student).
- If the assigned practitioner is a Student, a `supervising_instructor` field becomes required — enforce this at the data layer, not just the UI (per the Phase 0 plan's risk note on liability/QC).
- Calendar view with real-time Socket.IO sync: drag/drop reschedule, double-booking conflict detection.
- Session log capture on appointment completion: before/after photos (upload to R2), products used (references inventory placeholder, real inventory logic lands in Phase 5), outcome notes.
- **The integration spine:** on session completion, if the practitioner is a student and a curriculum_item is tagged against the service performed, increment that student's progress counter for the relevant `curriculum_items.requires_supervised_count`.

**Out of scope:**
- Certification pass/fail decisions (Phase 4 reads the progress counters this phase writes).
- Billing/commission calculation (Phase 5 — this phase logs the session but doesn't invoice it yet).
- Client-facing booking (self-service is Phase 6; this phase is staff/receptionist-facing only).

## 3. Data Model

```
appointments {
  _id, tenant_id, branch_id
  client_person_id → persons
  service_id → service_catalog
  practitioner_person_id → persons  // stylist or student
  practitioner_role: "stylist" | "student"
  supervising_instructor_person_id → persons  // REQUIRED if practitioner_role = "student"
  scheduled_start, scheduled_end
  status: "booked" | "in_progress" | "completed" | "cancelled" | "no_show"
}

session_logs {
  _id, appointment_id → appointments
  before_photo_url, after_photo_url  // R2
  products_used: [{ product_name, quantity }]  // placeholder until Phase 5 inventory exists
  outcome_notes
  completed_at
}

curriculum_progress_credits {
  _id, student_person_id → persons
  curriculum_item_id → curriculum_items
  session_log_id → session_logs
  credited_at
}
```

## 4. Backend Tasks

- [ ] Appointment CRUD + conflict-detection logic (no double-booking a practitioner or a branch resource in the same slot).
- [ ] Server-side validation: reject appointment creation/update if `practitioner_role = "student"` and `supervising_instructor_person_id` is missing.
- [ ] Session log endpoint on appointment completion, with R2 upload for before/after photos.
- [ ] Progress-credit trigger: on session completion, look up whether the service maps to a `curriculum_item` (needs a `service_id ↔ curriculum_item_id` mapping table — add this as a small addition to Phase 1/2's models if not already present) and write a `curriculum_progress_credits` row.
- [ ] Socket.IO events: appointment created/updated/cancelled broadcast to the branch's calendar view in real time.

## 5. Frontend Tasks

- [ ] Calendar view (day/week) with drag/drop reschedule, per-branch.
- [ ] Appointment creation form: client search, service select, practitioner select (filtered to available Stylists/Students for that time slot), conditional supervising-instructor field.
- [ ] Appointment completion flow: photo upload, products-used entry, outcome notes.
- [ ] Simple progress indicator on the instructor's batch view showing which students just earned credit (confirms the spine is visibly working, not just a background job).

## 6. Constraints

- The supervising-instructor requirement must be enforced server-side — this was flagged as a liability/QC risk in the original plan, so don't rely on frontend form validation alone.
- Reuse existing Socket.IO connection/room pattern from Palata rather than establishing a new real-time channel setup.

## 7. Acceptance Criteria

- [ ] An appointment cannot be saved with `practitioner_role = "student"` and no supervising instructor, even via direct API call.
- [ ] Double-booking the same practitioner in overlapping slots is rejected.
- [ ] Completing a supervised appointment for a mapped service increments the correct student's curriculum progress counter, visible on both the instructor's and student's views.
- [ ] Calendar updates in real time across two open sessions (e.g. receptionist + instructor) via Socket.IO.
- [ ] Before/after photos upload successfully to R2 and display on the session log.
