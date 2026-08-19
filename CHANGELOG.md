# Changelog

## [Unreleased]

- **Reframed the project as FDE OS.** The GitHub repository and project were renamed to `FDE-Delivery-OS`. The delivery method remains the system's kernel (phases unchanged); the product name now reflects the larger ambition: an agentic delivery operating system, not just a documented methodology.
- Added **Layer 3 — System Architecture** (`docs/system-architecture/`): 20 target-architecture documents (product vision, system architecture, extended agent operating model, engagement brain, pattern library, evaluation engine, production control plane, security and governance, observability and FinOps, incident operations, value realization, data contracts, end-to-end flows, delivery dashboard, roadmap, implementation guide, test strategy, multi-tenant isolation, API and event contracts, definition of done), 4 foundational ADRs, 3 JSON Schemas for data contracts (`EngagementState`, `PatternManifest`, `ReleaseManifest`), templates (ADR, engagement one-pager, production readiness checklist) and a reference use case (`examples/supplier-invoice-automation/`). This layer is **aspirational** — it describes where the system could go if the solo operation moves from methodology plus agents to software with persisted state; nothing in it is implemented, and the current execution layer (`.claude/agents/`, `.claude/skills/`, `harness/`) is unchanged.

- Added the **market benchmarking** fallback to the ROI calculation (`.claude/skills/roi-calculator/SKILL.md`, `templates/roi-calculation.md`, `fde-assessor`): when real shadowing has not happened yet, ROI can be pre-filled with cited public benchmarks (by function or process, never by named company), always labelled as an illustrative scenario in ranges (conservative/medium/optimistic) and replaced with real numbers as soon as shadowing occurs.

- Added `docs/enterprise-report.html`: a consolidated enterprise report in plain HTML (no Markdown), with natively formatted tables — framework (5 phases), agent team, RACI, KPIs, effort and capacity estimation, governance, pricing and client-profile adaptation, with light/dark theme support and PDF printing.

- Added the `fde-capacity-planner` agent (`.claude/agents/fde-capacity-planner.md`): effort estimation per phase (WBS + three-point/PERT estimation), how many people are needed, how many hours per week, and the solo vs. reinforcement decision. Called before committing to any phase timeline or price, and at every scope change.
- Added the `effort-estimation` skill (`.claude/skills/effort-estimation/SKILL.md`) with the WBS+PERT methodology and per-phase duration anchors.
- Added the `templates/effort-estimate.md` and `templates/capacity-plan.md` templates.
- Updated `fde-master` routing, the roster (`specs/agent-roster.md`), the harness (`harness/README.md` and `engagement-template/`) and the pricing model (`docs/pricing-model.md`) to reflect that every fixed fee derives from an estimate, not from guesswork.

- Refined security governance after benchmarking against public documentation of AI agents operating enterprise platforms: the inherited-permission principle (the agent never holds broader access than the FDE, with no separate service account), an environment-sensitive autonomy matrix (sandbox vs. production), and an infrastructure capacity item on the go-live checklist (`docs/security-governance.md`, `.claude/agents/fde-guardrails.md`, `checklists/go-live-phase3.md`).

- Added the **execution agent team** (`.claude/agents/`): 8 agents — `fde-master` (orchestrator), `fde-qualifier`, `fde-assessor`, `fde-context-engineer`, `fde-architect`, `fde-guardrails`, `fde-qa`, `fde-scale-ops` — each mapped to a phase or discipline of the FDE OS delivery method.
- Added 6 reusable skills (`.claude/skills/`): fit-score, roi-calculator, golden-set-builder, guardrail-matrix, blueprint-writer, status-report.
- Added specs (`specs/`): `agent-roster.md` (team overview) and `task-specs/` (handoff protocols between phases, operational shadowing, go-live review).
- Added the operational harness (`harness/`): per-engagement folder convention (`engagement-template/`), tool/MCP matrix per agent, command cheatsheet.

- Added `docs/client-profile-adaptation.md`: a guide to calibrating the framework by size (SMB/mid-market/enterprise) and sector (healthcare, financial, legal, retail, industrial, public sector), making explicit that the methodology is agnostic to company type.

## [0.1.0] - 2026-07-21

- Initial repository structure with the FDE OS delivery method.
- Added Phase 0 (Qualification) to the original 4-phase framework.
- Added RACI, success KPIs and antipatterns to the playbook.
- Added field templates: fit score, blueprint, ROI calculation, SOW, weekly status report.
- Added Go/No-Go checklists per phase (1, 2) and production go-live (3).
- Added supporting docs: pricing model, governance and security, reference stack.
