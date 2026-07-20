# Phase 4 — Certification & Progress

**Deliverable:** A student can graduate with an auditable, data-backed certificate. Reads the progress data Phase 3 started writing.

---

## 1. Context

Depends on Phase 3's `curriculum_progress_credits` being populated by real supervised sessions. Certification requirement rules vary a lot by course and regulatory body (flagged as a risk in the original plan) — build a configurable rules engine, not hardcoded thresholds like "10 haircuts."

## 2. Scope

**In scope:**
- Configurable certification requirement rules per course (e.g. "N supervised sessions of type X" + "M solo sessions" + "written exam pass" + "attendance ≥ P%").
- Progress dashboards: student view (own progress against requirements) and instructor view (all students in a batch, at a glance).
- Certificate generation: PDF templating on requirement completion (reuse existing docx/pdf skill patterns already used elsewhere in your work).
- Manual override path: instructor can mark a requirement as satisfied outside the automatic counter (e.g. for an exception or a session logged before this system existed).

**Out of scope:**
- Anything related to booking/session logging itself (Phase 3, already done).
- Payment for course fees (Phase 5).

## 3. Data Model

```
certification_requirements {
  _id, course_id → courses
  rule_type: "supervised_count" | "solo_count" | "exam_pass" | "attendance_percentage"
  target_curriculum_item_id (nullable, for count-based rules)
  threshold_value
}

certification_status {
  _id, student_person_id → persons, course_id → courses
  requirement_id → certification_requirements
  current_value
  satisfied: boolean
  satisfied_at (nullable)
  override_by_person_id (nullable, if manually satisfied)
}

certificates {
  _id, student_person_id → persons, course_id → courses
  issued_at
  pdf_url  // R2
  certificate_number
}
```

## 4. Backend Tasks

- [ ] CRUD for `certification_requirements` (course setup screen for Branch Manager/Academy Admin).
- [ ] Recalculation job: on each new `curriculum_progress_credit` (from Phase 3) or attendance update (from Phase 2), recheck the relevant `certification_status` rows for that student/course and update `current_value`/`satisfied`.
- [ ] Endpoint to trigger certificate PDF generation once all requirements for a course are satisfied (or manually triggered by an instructor with override justification logged).
- [ ] Certificate numbering scheme (unique, sequential per tenant) for auditability.

## 5. Frontend Tasks

- [ ] Certification requirement builder (per course): add/edit rules without touching code.
- [ ] Student progress dashboard: visual checklist against all active requirements.
- [ ] Instructor batch dashboard: all students' progress at a glance, sortable by "closest to completion."
- [ ] Certificate preview + download once issued.

## 6. Constraints

- Requirement rules must be data-driven (stored, editable) — do not hardcode any course's specific thresholds in application code.
- Manual overrides must log who performed them and why, for audit purposes.
- Reuse existing PDF generation approach (docx/pdf skill patterns) rather than introducing a new PDF library.

## 7. Acceptance Criteria

- [ ] A new certification requirement can be added to a course without a deploy.
- [ ] A student's `certification_status` updates automatically when a new supervised session is credited in Phase 3's flow.
- [ ] Once all requirements for a student/course are satisfied, a certificate can be generated with a unique certificate number and downloadable PDF.
- [ ] A manual override is possible and is recorded with the overriding instructor's identity and timestamp.
