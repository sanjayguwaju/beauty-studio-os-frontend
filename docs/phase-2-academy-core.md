# Phase 2 — Academy Core (LMS Side, CRUD Only)

**Deliverable:** CRUD-complete course/student management. No certification logic yet (that's Phase 4) — this phase builds the records the booking engine (Phase 3) will later credit progress against.

---

## 1. Context

Any `person` with an active `student` role_assignment (from Phase 0) gets an enrollment record in this phase. Reuse Palata's existing offline-tolerant attendance/check-in pattern for class attendance — this was already built for department field-staff check-in and should transfer directly.

## 2. Scope

**In scope:**
- Course structure: course → modules → curriculum items (individual skills/lessons within a module).
- Batch/cohort creation (a course runs multiple times a year with different student groups).
- Student enrollment into a batch.
- Instructor assignment per batch.
- Attendance tracking per class session, offline-tolerant.

**Out of scope:**
- Certification requirement rules and pass/fail logic (Phase 4).
- Linking real client sessions to curriculum progress (Phase 3 builds the link; Phase 4 uses it for certification decisions).
- Student portal (Phase 6).

## 3. Data Model

```
courses {
  _id, tenant_id
  name, description
  category: "hair" | "facial" | "nails" | "spa"
  duration_weeks
}

course_modules {
  _id, course_id → courses
  name, sequence_order
}

curriculum_items {
  _id, module_id → course_modules
  name, description
  requires_supervised_count (nullable — filled in properly in Phase 4, stubbed here)
}

batches {
  _id, course_id, tenant_id, branch_id
  name (e.g. "Hair Cutting — Jan 2027 Batch")
  start_date, end_date
  instructor_person_id → persons
}

enrollments {
  _id, batch_id → batches, student_person_id → persons
  status: "active" | "completed" | "dropped"
  enrolled_at
}

attendance_records {
  _id, batch_id, student_person_id, session_date
  status: "present" | "absent" | "excused"
  recorded_offline: boolean
  synced_at
}
```

## 4. Backend Tasks

- [ ] CRUD endpoints for `courses`, `course_modules`, `curriculum_items`, `batches`, `enrollments`.
- [ ] Attendance endpoints, reusing the existing offline sync logic from Palata's field-staff check-in feature (same conflict-resolution approach on reconnect).
- [ ] CASL rules: Instructor (manage own batch's attendance and curriculum notes), Branch Manager (full course/batch CRUD), Student (read own enrollment/attendance only — write access deferred to Phase 6 portal).

## 5. Frontend Tasks

- [ ] Course builder screen (course → modules → curriculum items, drag-to-reorder).
- [ ] Batch management screen (create batch, assign instructor, set dates).
- [ ] Enrollment screen (add students to a batch from the `persons` directory, auto-creating the `student` role_assignment if not already present).
- [ ] Attendance-taking screen for instructors, offline-tolerant (reuse existing offline UI pattern).

## 6. Constraints

- Reuse the existing offline sync mechanism as-is; do not build a second offline strategy for attendance.
- Enrollment should auto-create a `student` role_assignment (Phase 0 model) for the person if one doesn't already exist for this tenant — don't require it to be created manually first.

## 7. Acceptance Criteria

- [ ] A course with modules and curriculum items can be built end-to-end in the UI.
- [ ] A batch can be created, an instructor assigned, and students enrolled.
- [ ] Enrolling a student who has no existing `student` role_assignment automatically creates one.
- [ ] Attendance can be recorded offline at a class session and syncs correctly once back online.
- [ ] Instructor role can only edit attendance for batches they're assigned to.
