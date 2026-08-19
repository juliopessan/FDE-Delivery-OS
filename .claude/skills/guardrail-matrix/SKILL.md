---
name: guardrail-matrix
description: Builds the action autonomy matrix (Autonomous / Prior Approval / Blocked) for an agentic system, classifying every action the agent can perform. Use it in Phase 3 before any go-live, and whenever a new tool or connector is added to a system already in production.
---

# Skill: Action Autonomy Matrix

## When to use it

- In Phase 3, as part of `fde-guardrails`' work, before approving go-live.
- In Phase 4, whenever a new tool or connector is proposed for a system already in production (`fde-scale-ops` raises it, `fde-guardrails` reclassifies).

## Steps

1. List every action the agents can perform (one row per action, not per connector — a single connector can carry several actions with different risk).
2. Classify each action:
   - **Autonomous**: reversible, low impact, no sensitive data involved.
   - **Prior Approval**: irreversible or medium-to-high impact — a human confirms before execution.
   - **Blocked**: financial actions, data deletion, critical configuration changes — never automated.
3. Adjust by sector (see `docs/client-profile-adaptation.md`):
   - Healthcare: no action with clinical impact is Autonomous.
   - Financial: every write to a transactional system passes through compliance before it can be Prior Approval.
   - Legal: every output must cite a source; without a citation, treat it as Prior Approval at minimum.
4. The conservative default: when in doubt between two classes, choose the more restrictive one.
5. Submit the complete matrix for written approval by the client's executive sponsor.
6. Save it to `harness/engagements/<client>/03-engineering/autonomy-matrix.md`.

## Common mistakes to avoid

- Classifying whole connectors instead of individual actions — a CRM connector can mix reads (Autonomous) and writes (Prior Approval).
- Approving the matrix without the sponsor's explicit sign-off — without it there is no cover if an incident happens.
- Letting the matrix go stale when a new tool is added in production (Phase 4) — every new tool requires reclassification and does not inherit the permissiveness of existing ones.
