# Changelog

## [Unreleased]

- **Token consumption and estimated cost per engagement.** The counts were
  already stored on every phase run; nothing surfaced them. The pipeline
  status row now carries input tokens, output tokens and an estimated cost
  beside the runtime — measured at roughly 200k tokens and about $0.28 for a
  full nine-agent run. A run is priced with the rate in effect the day it ran,
  since Gemini 3.7 Flash is on a promotional rate that doubles on 2027-01-01
  and pricing everything at today's rate would re-price the whole history at
  the turn of the year. The figure is deliberately absent from the Enterprise
  Report, which is a client deliverable.

- **Committed to localhost.** Removed `vercel.json`, the deployment section and
  `DATABASE_AUTH_TOKEN`. State lives in a local SQLite file because engagement
  data is client material and stays on the machine that produced it — the same
  reason `harness/engagements/` is gitignored. `@libsql/client` remains, since
  it speaks SQLite over a `file:` URL with no server process to run.
- **The repository is now entirely in English**, contents and filenames.
  `docs/arquitetura-sistema/` became `docs/system-architecture/`, and 41 files
  were renamed alongside it with every cross-reference rewritten. Client
  deliverables under `harness/engagements/` were deliberately left in the
  client's language.
- **FDE OS is the only name.** The old acronym was retired from the method,
  the agent descriptions and the report; phases carry their plain English
  names. The integration document built around a separate product was
  rewritten as continuous process discovery in general terms.
- **The brand typefaces now load.** `globals.css` imported Instrument Serif and
  JetBrains Mono after the `@tailwind` directives, which CSS discards — the
  product had been rendering in Georgia and Courier New. Moved to `next/font`,
  which also self-hosts them. Tailwind's default sans was overriding the body
  face on 193 elements; `sans` now points at the brand stack.
- **Type and contrast are on a scale.** Five type steps replace sixteen
  accumulated sizes and nine `clamp()` definitions; three text weights replace
  thirteen opacity steps. 76 measured WCAG AA failures across the app are now
  zero, in both themes, and the report's own label layer with them.
- **A dark theme**, sharing the existing palette rather than introducing
  colours, plus per-phase timestamps, cycling domain verbs while an agent runs,
  and a single icon set used where a glyph says what a word cannot.
- **Report fixes found on real agent output:** wide tables no longer spill past
  the page margin, diagrams are capped at the width mermaid laid them out at
  instead of being stretched to the column, and truncated model output is
  detected rather than stored as complete.
- Added the demo video to the README hero.

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
