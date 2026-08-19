# Product Roadmap (vision)

This roadmap describes the build phases **if and when** this project moves from methodology plus agents into an actual Delivery OS product. None of the phases below has started.

## Phase 0 — Foundation

Typed schemas, persistence, state machine, ADR process.

## Phase 1 — Delivery OS MVP

Engagement Brain, discovery, opportunity scoring, Pattern Library, golden-set runner, readiness checklist.

## Phase 2 — Engineering Accelerator

Solution Composer, Builder, model benchmarking, code and infrastructure scaffolds, GitHub integration.

## Phase 3 — Production Control Plane

Policy engine, HITL, release manifests, observability, budget controls, incident agent.

## Phase 4 — Compound Delivery

Pattern promotion, sanitisation checks, maturity model, reuse analytics.

## Phase 5 — Multi-FDE Platform

RBAC, team workspaces, tenant isolation, shared registry and organisational dashboards.

---

## Project Creation Checklist (Phase 0, when it starts)

Suggested bootstrap order for a separate software repository (for example `fde-delivery-os-engine`), from scratch, once Phase 0 above actually begins.

### Foundation
- [ ] Create the repository
- [ ] Python project skeleton
- [ ] Lint and type checking
- [ ] CI
- [ ] Secret scanning
- [ ] ADRs

### Domain
- [ ] `EngagementState`
- [ ] `Risk`
- [ ] `Decision`
- [ ] `Handoff`
- [ ] `EvaluationRun`
- [ ] `ReleaseManifest`
- [ ] `Approval`

### Persistence
- [ ] PostgreSQL adapter
- [ ] Artifact storage
- [ ] Optimistic concurrency
- [ ] Audit event store

### Orchestration
- [ ] `fde-master`
- [ ] Workflow registry
- [ ] Next-best-action engine
- [ ] Retry and idempotency

### Delivery
- [ ] Discovery ingestion
- [ ] Opportunity scoring
- [ ] Solution composer
- [ ] Pattern registry
- [ ] Builder scaffold

### Evaluation
- [ ] Golden-set runner
- [ ] Deterministic metrics
- [ ] Semantic evaluation adapter
- [ ] Regression comparison

### Governance
- [ ] Policy engine
- [ ] Tool gateway
- [ ] Approval token
- [ ] Autonomy matrix

### Production
- [ ] Readiness gate
- [ ] Release manifest
- [ ] Deployment adapter
- [ ] Rollback adapter

### Observability
- [ ] OpenTelemetry
- [ ] Token and cost capture
- [ ] Business metrics
- [ ] Alert hooks

### Incident
- [ ] Incident schema
- [ ] Trace correlation
- [ ] Release diff
- [ ] Postmortem

### Demo
- [ ] Invoice automation
- [ ] Synthetic documents
- [ ] Golden set
- [ ] SAP mock
- [ ] HITL
- [ ] Value dashboard
