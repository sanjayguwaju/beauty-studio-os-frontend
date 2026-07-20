# Phase 5 — POS, Inventory & Billing

**Deliverable:** Money is tracked correctly across both business lines (salon services and academy fees) without conflating them.

---

## 1. Context

Depends on Phase 3's session logs (which service was performed, by whom, and what products were used) and Phase 2's enrollments (which course fees are owed). The commission-vs-no-commission distinction flagged as a risk in the original plan must be resolved here — solo services performed by a Stylist earn commission; supervised services performed by a Student do not (the instructor and the academy earn the training fee/margin instead, not a per-service commission).

## 2. Scope

**In scope:**
- Point-of-sale/checkout flow for completed salon appointments (Phase 3 session_logs → invoice).
- Inventory: product stock levels, per-service usage deduction (using the `products_used` data already captured in `session_logs`).
- Client-side invoicing (service billing, using `price_solo` or `price_supervised` from the Phase 1 service catalog depending on `practitioner_role`).
- Academy-side invoicing (course fees, separate ledger from salon revenue).
- Staff commission calculation: solo services → commission to the Stylist; supervised services → no per-service commission (goes to a training-revenue line instead).

**Out of scope:**
- Stripe/online payment gateway integration (deferred to Phase 10's SaaS billing, unless the studio itself wants to charge clients online — treat that as a stretch goal, not required for this phase's deliverable).
- Payroll/attendance-based pay (explicitly deferred per the original plan — lower priority, MVP-deferrable).

## 3. Data Model

```
products {
  _id, tenant_id, branch_id
  name, unit, current_stock, reorder_threshold
}

product_usage_deductions {
  _id, session_log_id → session_logs, product_id → products
  quantity_used
  deducted_at
}

invoices {
  _id, tenant_id, branch_id
  type: "service" | "course_fee"
  client_or_student_person_id → persons
  line_items: [{ description, amount }]
  total_amount
  status: "unpaid" | "paid" | "partial"
  issued_at
}

commissions {
  _id, staff_person_id → persons, appointment_id → appointments
  amount
  basis: "solo_service"   // supervised services never generate a row here
  paid: boolean
}
```

## 4. Backend Tasks

- [ ] Checkout endpoint: on appointment completion (from Phase 3), generate a service invoice using the correct price tier (`price_solo` vs `price_supervised`) based on `practitioner_role`.
- [ ] Inventory deduction: on session completion, deduct `product_usage_deductions` from `products.current_stock`; flag low-stock when below `reorder_threshold`.
- [ ] Commission calculation: only generate a `commissions` row when `practitioner_role = "stylist"`; explicitly skip for `"student"`.
- [ ] Course fee invoicing endpoint, tied to `enrollments` from Phase 2 (separate from the service invoice flow — do not merge the two ledgers).
- [ ] Reporting endpoint: revenue split by business line (salon vs. academy) for use in Phase 8's dashboards.

## 5. Frontend Tasks

- [ ] Checkout screen at appointment completion (auto-filled from session log, editable line items for add-ons).
- [ ] Inventory management screen (stock levels, low-stock alerts, manual restock entry).
- [ ] Invoice list/detail screens, filterable by type (service vs. course fee).
- [ ] Commission report screen for staff/payroll reference.

## 6. Constraints

- Service and course-fee invoices must remain on clearly separate ledgers even if displayed in one combined "billing" screen — Phase 8's revenue-split reporting depends on this.
- Commission logic must be unambiguous per the original plan's risk note — write a unit test that explicitly verifies a supervised service never produces a commission row.

## 7. Acceptance Criteria

- [ ] Completing a solo-service appointment generates a client invoice at `price_solo` and a commission row for the stylist.
- [ ] Completing a supervised-service appointment generates a client invoice at `price_supervised` and **no** commission row.
- [ ] Product stock is correctly deducted based on session log's products-used data, and a low-stock flag appears when threshold is crossed.
- [ ] A course fee invoice can be generated independently of any service invoice, and the two never appear merged in the underlying ledger.
