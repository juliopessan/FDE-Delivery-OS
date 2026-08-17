# FDE OS

**Agentic Delivery Operating System for Forward Deployed Engineers**

![FDE OS — one engagement enters, an Enterprise Report leaves](platform/docs/screenshot-landing-page.png)

FDE OS is the evolution of the framework previously called A.C.E.S.: a repeatable 4-phase methodology (Assessment → Context → Engineering → Scale) for mapping, architecting and shipping enterprise agentic automation in short, high-impact cycles, designed for **solo** operation (a single FDE acting as end-to-end technical consultant) — and **executed by a team of 9 specialist AI agents**, not merely documented. This repository holds both the methodology plus its execution agents for Claude Code, and a **working web platform** ([`platform/`](platform)) that runs those same 9 agents against an engagement brief and returns a consolidated Enterprise Report — see [`platform/README.md`](platform/README.md) for details.

The framework is **agnostic to company size and sector**: the phases keep their shape and vary only in depth and formality according to the client profile — see [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md).

> **A note on language.** This README and the platform are in English. Most documents under [`docs/`](docs), [`templates/`](templates) and [`checklists/`](checklists) are still in Brazilian Portuguese, since they are used directly with Brazilian clients. Filenames stay as they are so existing links keep working.

## Core principle

> Automate the repetitive work of delivery, not engineering judgment. Keep the PoC architecture simple enough to prove value quickly, and add agentic complexity only where the business process genuinely demands it.

## Four layers in this repository

| Layer | What it is | State | Where |
| --- | --- | --- | --- |
| **1. Methodology (reference)** | The "what" and the "why" — playbook, templates, checklists, supporting docs | In use | [`PLAYBOOK.md`](PLAYBOOK.md), [`templates/`](templates), [`checklists/`](checklists), [`docs/`](docs) |
| **2. Agent team (execution in Claude Code)** | The "who" and the "how" — 9 AI agents, reusable skills, task specs and the operating harness that runs them in Claude Code | In use | [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`specs/`](specs), [`harness/`](harness) |
| **3. System architecture (vision)** | The "where to" — a specification for a Delivery OS with persisted state, a pattern library, an evaluation engine and a production control plane | Aspirational — partly implemented (see layer 4) | [`docs/arquitetura-sistema/`](docs/arquitetura-sistema) |
| **4. Platform (real implementation)** | The same 9 agents running as an actual Next.js app: engagement form with automatic brief extraction (paste or upload .txt/.md/.pdf/.docx), sequential pipeline on Gemini 3.7 Flash with Claude Haiku 4.5 fallback, state in SQLite (Turso/libSQL), and a consolidated Enterprise Report in HTML with PDF export | In use (local dev; deployment in progress) | [`platform/`](platform) — see [`platform/README.md`](platform/README.md) |

Layer 3 remains largely target-architecture documentation — see the notice in [`docs/arquitetura-sistema/README.md`](docs/arquitetura-sistema/README.md). Layer 4 is where that vision becomes real code, starting with the "solo FDE" slice (no multi-tenancy, no RBAC yet).

## Target system flow

```
Client ambiguity → Discovery → Opportunity scoring → Architecture → Prototype → Evaluation → Governance → Production readiness → Deploy → Observability → Business value
```

## Product goals (targets, not metrics already achieved)

| Outcome | Target |
|---|---:|
| Discovery → prototype | < 2 business days |
| Architecture bootstrap | < 2 hours |
| Evaluation bootstrap | < 4 hours |
| Repetitive delivery effort | −50% |
| Reusable assets per engagement | ≥ 3 |
| Parallel engagements per FDE | 2× |
| Client time-to-value | −40–60% |

## Repository contents

| Path | Contents |
| --- | --- |
| [`PLAYBOOK.md`](PLAYBOOK.md) | The full methodology playbook — the 4 phases (plus Phase 0), roles, RACI, KPIs and toolkit |
| [`docs/`](docs) | Operational deep dives: pricing model, governance and security, reference stack, adaptation by client profile |
| [`docs/arquitetura-sistema/`](docs/arquitetura-sistema) | FDE OS architecture vision: 20 system documents, 4 ADRs, JSON Schemas for the data contracts, templates and a reference use case |
| [`platform/`](platform) | The working Next.js app: 9 agents running on Gemini/Haiku, SQLite state, intake form with automatic extraction, rendered Enterprise Report |
| [`templates/`](templates) | Field-ready templates (qualification, blueprint, ROI, SOW, status report) |
| [`checklists/`](checklists) | Per-phase quality checklists (Go/No-Go, go-live) |
| [`.claude/agents/`](.claude/agents) | 9 AI agents — one orchestrator plus one specialist per phase or discipline, ready to use in Claude Code |
| [`.claude/skills/`](.claude/skills) | 7 reusable skills (fit score, ROI calculation, golden set, guardrails matrix, blueprint, status report, effort estimation) invoked by several agents |
| [`specs/`](specs) | `agent-roster.md` (team overview) and `task-specs/` (handoff, shadowing and go-live review protocols) |
| [`harness/`](harness) | How to run the agent team in practice: per-engagement folder convention, tool/MCP matrix, reusable skeleton |
| [`docs/relatorio-enterprise.html`](docs/relatorio-enterprise.html) | Enterprise report in HTML — framework, agents, RACI, KPIs, capacity, governance and pricing in one document, ready to open in a browser or export to PDF |

## The agent team

| Agent | Phase | Role |
| --- | --- | --- |
| `fde-master` | All | Orchestrator — routes between specialists and holds engagement state |
| `fde-qualifier` | 0 | Fit score, prospect research, proposal |
| `fde-capacity-planner` | Cross-cutting | Effort estimation (WBS + PERT), hours per phase, solo vs. reinforced |
| `fde-assessor` | 1 | Shadowing, blueprint, estimated ROI |
| `fde-context-engineer` | 2 | RAG pipeline, vector DB, connectors, golden set |
| `fde-architect` | 3 | Agent topology, model routing |
| `fde-guardrails` | 3 | Guardrails, autonomy matrix, data protection, auditing — holds veto over go-live |
| `fde-qa` | Cross-cutting | Validates Go/No-Go checklists, golden set, load and red-team testing |
| `fde-scale-ops` | 4 | Observability, realized ROI, runbook, retainer |

Full detail in [`specs/agent-roster.md`](specs/agent-roster.md). The broader target topology (16 roles) for when the system grows past solo operation is in [`docs/arquitetura-sistema/03-modelo-operacional-de-agentes.md`](docs/arquitetura-sistema/03-modelo-operacional-de-agentes.md).

## Using it

1. Read [`PLAYBOOK.md`](PLAYBOOK.md) for the full phase flow.
2. Open Claude Code in this repository (or copy `.claude/agents/` and `.claude/skills/` into your client's repository) — the 9 agents become available automatically.
3. Ask `fde-master` to start or resume an engagement. It creates the folder under `harness/engagements/<client>/` from the skeleton and delegates to the right phase specialist.
4. Before closing Phase 0, check [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md) to calibrate duration and formality to the client's size and sector.
5. At the end of each phase, `fde-qa` runs the matching Go/No-Go checklist before you move on.
6. Treat `docs/stack-referencia.md` as a menu of tools — adapt it to each client's infrastructure reality.
7. To see where the system is heading, and the data contracts, ADRs and roadmap already specified, start at [`docs/arquitetura-sistema/README.md`](docs/arquitetura-sistema/README.md).

Client engagements live in `harness/engagements/<client>/`, which is gitignored on purpose: client material never reaches the repository. Full command cheatsheet and folder convention in [`harness/README.md`](harness/README.md).

## Running the platform

```bash
cd platform
cp .env.example .env.local     # add GEMINI_API_KEY and/or ANTHROPIC_API_KEY
npm install
npx tsx src/lib/db/migrate.ts  # creates local.db with the schema
npm run dev
```

Then create an engagement at `/dashboard/new` and run its pipeline. See [`platform/README.md`](platform/README.md) for architecture, model routing and deployment.

## Licence

MIT — use, adapt and redistribute freely, keeping the copyright notice.
