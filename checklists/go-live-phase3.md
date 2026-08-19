# Go-Live Checklist — End of Phase 3 (Engineering)

This checklist is the security gate before any move to production.

## Guardrails

- [ ] Input guardrails implemented (prompt injection, rate limiting)
- [ ] Output guardrails implemented (schema validation, grounding and citation checks)
- [ ] Circuit breakers configured per external connector

## Autonomy Matrix

- [ ] Every agent action classified as Autonomous / Prior Approval / Blocked
- [ ] Autonomy matrix approved in writing by the executive sponsor
- [ ] HITL flow tested end to end (a low-confidence case routes correctly)

## Testing

- [ ] Regression test against the golden set after the last prompt or model change
- [ ] Basic load test (expected concurrency)
- [ ] Light red-teaming (prompt injection, system-prompt extraction)

## Security and Compliance

- [ ] Data-protection review complete (legal basis, log retention, PII masking)
- [ ] Audit trail live (input/output/decision logs, not editable by the agent)
- [ ] Client IT/Security approval for the read-write access granted
- [ ] Confirmed that no connector uses a service account with broader privilege than the FDE's (inherited permission, see `docs/security-governance.md`)
- [ ] Autonomy matrix reclassified for the production environment (not inherited from sandbox/PoC)

## Infrastructure Capacity

- [ ] Expected volume and concurrency validated against current sizing (storage, compute, LLM provider API limits)
- [ ] Accounted for the agent running continuously and in parallel, unlike a human operator's sequential pace — usage peaks must not blow through rate limits unhandled

## Observability

- [ ] Tracing and observability platform configured
- [ ] Token cost dashboard live
- [ ] Alerts configured for error rate and cost outside expected bounds

## Handoff

- [ ] Incident runbook documented
- [ ] System prompts and architecture documented

**Decision:** [ ] GO-LIVE approved [ ] Open items to resolve: ______________________
