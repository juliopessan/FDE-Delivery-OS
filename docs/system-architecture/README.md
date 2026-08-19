# Layer 3 — System Architecture (vision)

This folder is FDE Delivery OS's **vision layer**: where the project goes if the solo FDE operation grows from a single operator with a team of Claude Code agents into an agentic delivery platform with persisted state, continuous evaluation and production control.

Nothing here is implemented as software today. It is specification and target architecture — the what and the why of a possible engineering Phase 2 for this project, kept alongside the methodology so that every future implementation decision is born referencing a principle, a data contract and an ADR.

## How this relates to the repository's other two layers

| Layer | What it is | State |
| --- | --- | --- |
| 1. Methodology (reference) | The what and why of the delivery process — [`PLAYBOOK.md`](../../PLAYBOOK.md), [`templates/`](../../templates), [`checklists/`](../../checklists) | In use |
| 2. Agent team (execution) | 9 Claude Code agents that run the methodology today — [`.claude/agents/`](../../.claude/agents), [`.claude/skills/`](../../.claude/skills), [`harness/`](../../harness) | In use |
| **3. System architecture (vision)** | Specification of a future Delivery OS that persists state, evaluates and controls production | Aspirational — not implemented |

Layer 3 neither replaces nor alters layers 1 and 2. It documents the possible destination if the leverage from agents and templates stops being enough and the operation needs persisted state outside the chat, automated evaluation and a formal production control plane.

## Index

| # | Document | Topic |
| --- | --- | --- |
| 01 | [`01-product-vision.md`](01-product-vision.md) | Thesis, primary user, jobs-to-be-done, design principles, north-star metric |
| 02 | [`02-system-architecture.md`](02-system-architecture.md) | System layers, shared plane vs. client plane |
| 03 | [`03-agent-operating-model.md`](03-agent-operating-model.md) | One agent, one responsibility; handoff contract; rules |
| 04 | [`04-engagement-brain.md`](04-engagement-brain.md) | Entity model, state machine, memory layers |
| 05 | [`05-pattern-library.md`](05-pattern-library.md) | Pattern structure, initial catalogue, promotion flow |
| 06 | [`06-evaluation-engine.md`](06-evaluation-engine.md) | Evaluation dimensions, golden set, regression triggers |
| 07 | [`07-production-control-plane.md`](07-production-control-plane.md) | Readiness domains, gate model, release lifecycle |
| 08 | [`08-security-and-governance.md`](08-security-and-governance.md) | Trust model, action classes, tool policy, approval token |
| 09 | [`09-observability-and-finops.md`](09-observability-and-finops.md) | Trace model, metrics, cost guardrails |
| 10 | [`10-incident-operations.md`](10-incident-operations.md) | Categories, incident response flow |
| 11 | [`11-value-realization.md`](11-value-realization.md) | Baseline, ROI equations, confidence labels, cadence |
| 12 | [`12-data-contracts.md`](12-data-contracts.md) | Canonical objects, requirement example, provenance |
| 13 | [`13-end-to-end-flows.md`](13-end-to-end-flows.md) | New engagement, discovery→prototype, prototype→production, incident, compound engineering |
| 14 | [`14-delivery-dashboard.md`](14-delivery-dashboard.md) | Executive metrics, engagement card, views |
| 15 | [`15-roadmap.md`](15-roadmap.md) | Implementation phases 0-5, project creation checklist |
| 16 | [`16-implementation-guide.md`](16-implementation-guide.md) | Build order, suggested modules, MVP CLI |
| 17 | [`17-test-strategy.md`](17-test-strategy.md) | Test layers, critical invariants |
| 18 | [`18-multi-tenant-isolation.md`](18-multi-tenant-isolation.md) | Namespace per engagement, safe promotion to patterns |
| 19 | [`19-api-and-event-contracts.md`](19-api-and-event-contracts.md) | System commands and events |
| 20 | [`20-definition-of-done.md`](20-definition-of-done.md) | Definition of done for an agent, a pattern and a release |

## Other artifacts in this layer

- [`adrs/`](adrs) — Foundational Architecture Decision Records (state outside the chat, human accountability, versioned patterns, policy before tools)
- [`schemas/`](schemas) — JSON Schemas for the core data contracts (`EngagementState`, `PatternManifest`, `ReleaseManifest`)
- [`templates/`](templates) — ADR template, engagement one-pager and production readiness checklist, in the system's target format
- [`examples/supplier-invoice-automation/`](examples/supplier-invoice-automation) — End-to-end reference use case (discovery → prototype → evaluation → production)

## The central principle of this layer

> Automate the repetitive work of delivery, not engineering judgement.
