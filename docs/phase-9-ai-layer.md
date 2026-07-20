# Phase 9 — AI Layer

**Deliverable:** Differentiator features, built last once the data model is stable — sequenced here deliberately, since AI features built on shifting schema get expensive to rebuild.

---

## 1. Context

Depends on Phases 1–8 having real usage data (client visit history, session logs, enrollment/attendance patterns) — this phase's quality is directly gated by how much real data exists, not just how good the AI integration is.

## 2. Scope

**In scope:**
- AI-assisted service recommendations for clients, based on visit history and preferences (Phase 1/3 data) — e.g. suggesting a rebooking interval or a complementary service.
- AI OCR (Claude vision API) for ID/document intake at academy enrollment (Phase 2) — extract name/DOB/ID number from uploaded documents to reduce manual entry.
- Photo-based before/after comparison tagging — lightweight categorization of session_log photos (Phase 3) for portfolio/marketing use, not diagnostic claims.

**Explicitly deferred to a v2.0 backlog (do not build now):**
- Predictive staffing/scheduling optimization.
- Dropout-risk prediction for students.
- Any AI feature making health/skin/medical claims — flag anything that could be read as a facial/skin diagnosis and route it to a human, since this crosses into content that could be read as unlicensed medical/dermatological advice.

## 3. Data Model

```
ai_recommendations {
  _id, tenant_id, client_person_id → persons
  type: "rebooking" | "complementary_service"
  recommended_service_id → service_catalog (nullable)
  generated_at
  dismissed: boolean
}

ocr_extractions {
  _id, tenant_id, source_document_url  // R2
  extracted_fields: { name, dob, id_number, ... }
  confidence_score
  reviewed_by_person_id (nullable — human review before data is trusted)
  reviewed_at
}
```

## 4. Backend Tasks

- [ ] Recommendation job: periodic batch job (or on-demand) generating `ai_recommendations` from client visit history, using the Anthropic API.
- [ ] OCR extraction endpoint: send uploaded enrollment documents through Claude's vision API, store extracted fields with a confidence score, and require human review/confirmation before the data populates the actual `persons`/enrollment record — do not auto-commit unreviewed OCR output.
- [ ] Photo tagging job: lightweight categorization tags on session_log photos (e.g. service type, before/after pairing) for portfolio filtering — not attempting any skin/health assessment.

## 5. Frontend Tasks

- [ ] Recommendation surfacing in the client portal ("you might also like...") and staff booking flow.
- [ ] OCR review screen: staff confirms/corrects extracted fields before they're committed.
- [ ] Portfolio filter UI using the photo tags.

## 6. Constraints

- No AI-generated content should make health, skin-condition, or medical claims — keep recommendations to service/product suggestions and scheduling, not diagnosis.
- OCR output must go through a human review step before becoming authoritative data — this protects against silent data corruption from misreads.
- Sequence this phase last, as planned — don't let AI feature scope creep pull it earlier than Phase 8's stable data model.

## 7. Acceptance Criteria

- [ ] A client with visit history receives a relevant, non-medical service recommendation.
- [ ] An uploaded enrollment document produces extracted fields with a confidence score, and no field is written to the student's actual profile until a staff member reviews and confirms it.
- [ ] Session log photos can be filtered by auto-generated tags in a portfolio view.
- [ ] No AI-generated output in this phase makes a skin/health diagnostic claim (spot-check a sample of generated recommendations against this constraint).
