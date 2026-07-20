# Phase 7 — Notifications & Comms

**Deliverable:** Reduced no-shows and better retention on both sides, via queue-driven notifications and a basic communication center.

---

## 1. Context

Reuse Palata's existing Bull/Redis queue infrastructure — this phase is mostly new job types and templates on an already-proven queue, not new infra. WhatsApp Business API approval has real lead time (flagged as a risk in the original plan) — start that application process before this phase's development work, since it gates part of the scope.

## 2. Scope

**In scope:**
- Appointment reminders (SMS/WhatsApp/Email) — triggered ahead of Phase 3 appointments.
- Class schedule alerts for students (new session, rescheduled session, attendance follow-up if absent).
- Certificate-ready notifications (triggered by Phase 4's certificate issuance).
- Low-stock alerts to Branch Manager (triggered by Phase 5's inventory deduction).
- Basic communication center: template management + bulk send for promotions (to clients) and enrollment drives (prospective students).

**Out of scope:**
- Marketing automation/drip campaigns (beyond simple template + bulk send).
- AI-personalized messaging (Phase 9).

## 3. Data Model

```
notification_templates {
  _id, tenant_id
  channel: "sms" | "whatsapp" | "email"
  trigger_type: "appointment_reminder" | "class_alert" | "certificate_ready" | "low_stock" | "promo"
  subject (email only), body_template
}

notification_log {
  _id, tenant_id, person_id → persons (nullable for internal alerts like low-stock)
  template_id → notification_templates
  channel, status: "queued" | "sent" | "failed"
  sent_at
}
```

## 4. Backend Tasks

- [ ] Bull/Redis job types for each trigger: appointment-reminder (scheduled relative to `appointments.scheduled_start`), class-alert (on batch/session changes), certificate-ready (on `certificates` creation), low-stock (on `products.current_stock` crossing threshold).
- [ ] Template rendering engine (variable substitution: client name, appointment time, etc.).
- [ ] WhatsApp Business API integration (pending approval — build against a sandbox/mock first if approval is still in progress, so development isn't blocked).
- [ ] Bulk-send endpoint for the communication center (promo/enrollment-drive sends), rate-limited to avoid provider throttling.

## 5. Frontend Tasks

- [ ] Template management screen (create/edit templates per trigger type and channel).
- [ ] Communication center: audience selection (all clients, all prospective students, custom filter), template pick, send/schedule.
- [ ] Notification log viewer (sent/failed status, useful for support troubleshooting).

## 6. Constraints

- Reuse existing Bull/Redis queue setup; do not stand up a second queue system.
- Do not block this phase's entire scope on WhatsApp approval — build SMS/Email paths fully functional first, add WhatsApp once approved.

## 7. Acceptance Criteria

- [ ] An appointment reminder is queued and sent ahead of a scheduled appointment via at least one channel (SMS or Email, WhatsApp if approved by this point).
- [ ] A student receives a class-alert notification when their batch schedule changes.
- [ ] A certificate-ready notification fires automatically when Phase 4 issues a certificate.
- [ ] A low-stock alert reaches the Branch Manager when a product crosses its reorder threshold.
- [ ] A bulk promo message can be sent to a filtered audience from the communication center.
