# Phase 8 — Analytics & Reporting

**Deliverable:** Owner-level visibility across both business lines — the decision-support layer.

---

## 1. Context

This phase is read-only reporting over data already captured in Phases 1–5 (services/clients, courses/enrollments, appointments/sessions, certifications, billing/inventory). No new domain writes — pure aggregation and presentation.

## 2. Scope

**In scope:**
- Dashboard KPIs: revenue split (salon vs. academy, using Phase 5's separate ledgers), branch occupancy (appointments booked vs. available slots), staff utilization (stylist booked-hours vs. working-hours from Phase 1), enrollment funnel (enrolled → active → completed → certified), certification pass rate.
- Export: Excel/PDF/CSV for any report view.
- Report filtering by date range, branch, and course/service category.

**Out of scope:**
- A fully generic report-builder for arbitrary queries — start with the specific KPIs above; if more ad-hoc reporting is needed later, build a generic filter+export engine rather than hand-coding each one (per the original plan's guidance on avoiding a bottomless report backlog).

## 3. Data Model

No new core entities — this is an aggregation layer. Consider materialized/precomputed daily rollups if raw aggregation queries become slow at scale:

```
daily_kpi_rollups {
  _id, tenant_id, branch_id, date
  salon_revenue, academy_revenue
  appointments_booked, appointments_available_slots
  new_enrollments, active_students, certifications_issued
}
```

## 4. Backend Tasks

- [ ] Aggregation endpoints for each KPI, filterable by date range/branch/category.
- [ ] Optional: nightly job to precompute `daily_kpi_rollups` if live aggregation is too slow on larger tenants.
- [ ] Export endpoints (Excel/PDF/CSV) for each report view — reuse existing xlsx/pdf generation patterns already used elsewhere in your stack.

## 5. Frontend Tasks

- [ ] Owner/Branch Manager dashboard: KPI cards + charts (revenue split, occupancy, utilization, enrollment funnel, cert pass rate).
- [ ] Report filter controls (date range, branch, category).
- [ ] Export buttons on each report view.

## 6. Constraints

- Keep the revenue-split reporting strictly separated per Phase 5's ledger design — don't let salon and academy figures get blended in an aggregation query by accident.
- If raw aggregation becomes slow, precompute rollups rather than optimizing the live query indefinitely.

## 7. Acceptance Criteria

- [ ] Dashboard correctly shows salon revenue and academy revenue as separate figures that sum to total tenant revenue.
- [ ] Staff utilization report accurately reflects booked-hours vs. working-hours from Phase 1 data.
- [ ] Enrollment funnel report matches manual counts from the underlying `enrollments`/`certificates` data for a test batch.
- [ ] Any report view can be exported to at least one of Excel/PDF/CSV.
