# Security and Governance

> See also [`docs/security-governance.md`](../security-governance.md) — the operational guide the agent team already uses today. This document describes the target runtime policy model for when an actual Tool Gateway exists.

## Trust Model

Assume model output can be wrong, that client content can be adversarial, that tools can be malformed and that APIs are mutable. Security is enforced by runtime policy, not by prompt.

## Action Classes

| Class | Example | Default |
|---|---|---|
| Read-only | search a knowledge base | autonomous |
| Reversible write | create a draft | autonomous/review |
| External communication | send an email | human approval |
| Business state change | update the ERP | human approval |
| Financial/destructive | transfer or delete | blocked, absent an explicit workflow |

## Tool Policy

Evaluate principal, engagement, tool/action, resource, data classification, risk class, arguments, environment and approval token.

Decision: `ALLOW` / `ALLOW_WITH_REDACTION` / `REQUIRE_APPROVAL` / `DENY`.

## HITL Approval Token

Bind the approval to actor, tool, action, payload hash, engagement, environment and expiry. Any change to the payload invalidates the approval.
