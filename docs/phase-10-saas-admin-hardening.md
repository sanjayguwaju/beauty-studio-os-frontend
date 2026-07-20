# Phase 10 — SaaS Admin Panel & Hardening

**Deliverable:** Ready to onboard paying studio customers self-serve. This is the phase that turns StudioOS from "a system running your studios" into an actual multi-tenant SaaS product.

---

## 1. Context

Depends on the full stack from Phases 0–9 being stable. This phase is largely infrastructure/business-operations work rather than new domain features.

## 2. Scope

**In scope:**
- Tenant management: self-service studio signup, subscription plan selection (Starter/Professional/Enterprise per the pricing tiers in the original plan).
- Billing: Stripe integration + local gateway (eSewa/Khalti) for Nepal-based customers.
- Multi-branch/multi-brand scoping polish (confirm Phase 0's tenant/branch model holds up under a chain with many branches and a franchise-style parent brand).
- API access for integrations (REST, and webhooks for key events — appointment completed, certificate issued, invoice paid).
- SSO/OAuth for larger customers, IP whitelisting, daily automated backups.
- Impersonate-tenant capability for support, with audit logging (per the original plan's guidance — this is a support necessity but a security-sensitive feature).

**Out of scope:**
- Feature-by-feature enterprise customization beyond what's described here — treat true custom-development requests as out-of-product, handled as a services engagement, not a platform feature.

## 3. Data Model

```
subscription_plans {
  _id, name: "starter" | "professional" | "enterprise"
  price_monthly, included_features: [string]
  max_branches, max_staff
}

tenant_subscriptions {
  _id, tenant_id → tenants
  plan_id → subscription_plans
  status: "trial" | "active" | "past_due" | "cancelled"
  billing_provider: "stripe" | "esewa" | "khalti"
  current_period_end
}

impersonation_log {
  _id, support_person_id, tenant_id
  started_at, ended_at
  reason
}
```

## 4. Backend Tasks

- [ ] Self-service tenant signup flow (creates tenant, first branch, first owner-role person, and a trial subscription).
- [ ] Stripe integration for international/card billing; eSewa/Khalti integration for local Nepal billing.
- [ ] Feature-flagging tied to `subscription_plans.included_features` (gate Academy module, AI layer, etc. behind the correct tier).
- [ ] REST API + webhook dispatch for key domain events, with API key management per tenant.
- [ ] SSO/OAuth support for Enterprise-tier tenants; IP whitelist enforcement at the auth layer.
- [ ] Automated daily backup job (database + R2 assets).
- [ ] Impersonation flow: support staff can act as a tenant admin, with every action logged to `impersonation_log`.

## 5. Frontend Tasks

- [ ] Public signup/pricing page.
- [ ] SaaS admin panel (Anthropic-internal-style super-admin view): tenant list, subscription status, support tools, usage analytics.
- [ ] Tenant-facing billing/subscription management screen (upgrade/downgrade, payment method, invoices).
- [ ] API key management screen for tenants using the API/webhooks.

## 6. Constraints

- Feature flags must be enforced server-side, not just hidden in the UI — a Starter-tier tenant hitting an Academy endpoint directly should be rejected.
- Impersonation must be fully audit-logged; this is a support tool, not a backdoor, and should be treated with the same care as any privileged access feature.

## 7. Acceptance Criteria

- [ ] A new studio can sign up, select a plan, and start a trial without manual intervention.
- [ ] Billing works end-to-end through at least one provider (Stripe or eSewa/Khalti) for a real test transaction.
- [ ] A Starter-tier tenant is blocked server-side from accessing Academy-module or AI-layer endpoints.
- [ ] A webhook fires correctly for at least one key event (e.g. appointment completed) to a test endpoint.
- [ ] Impersonating a tenant as support is possible and every action taken during impersonation is logged with start/end time and reason.
- [ ] A daily backup job runs successfully and a restore has been tested at least once in staging.
