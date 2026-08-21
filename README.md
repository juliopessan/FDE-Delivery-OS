# FDE OS

**Agentic Delivery Operating System for Forward Deployed Engineers**

[![FDE OS — one engagement enters, an Enterprise Report leaves](platform/docs/screenshot-landing-page.png)](https://youtu.be/ZCILaPLkYBU)

**▶ [Watch the 4-minute demo](https://youtu.be/ZCILaPLkYBU)** — an engagement brief goes in, nine agents run, a consolidated Enterprise Report comes out.

**Assessment, discovery and blueprint in three minutes, for under a dollar.** FDE OS drafts the front of an engagement — qualification, capacity, assessment, context, architecture, security, QA, scale and compound intelligence — end to end in model calls, measured across six engagements. It accelerates the FDE team running the engagement; it does not replace them. The dollar buys the first draft of work that otherwise takes days, so the engineers spend theirs on judgment, the client conversation, and the decisions a report can only propose.

FDE OS is a repeatable 4-phase delivery method (Assessment → Context → Engineering → Scale) for mapping, architecting and shipping enterprise agentic automation in short, high-impact cycles, designed so **one** FDE can run it end to end — and equally usable by an FDE team at the client, since the phases are the same whoever staffs them — and **executed by a team of 9 specialist AI agents**, not merely documented. This repository holds both the method plus its execution agents for Claude Code, and a **working web platform** ([`platform/`](platform)) that runs those same 9 agents against an engagement brief and returns a consolidated Enterprise Report — see [`platform/README.md`](platform/README.md) for details.

The framework is **agnostic to company size and sector**: the phases keep their shape and vary only in depth and formality according to the client profile — see [`docs/client-profile-adaptation.md`](docs/client-profile-adaptation.md).

Everything in this repository — documentation, agent prompts, templates and the platform — is in English.

## Core principle

> Automate the repetitive work of delivery, not engineering judgment. Keep the PoC architecture simple enough to prove value quickly, and add agentic complexity only where the business process genuinely demands it.

### What it accelerates, and what it does not do

FDE OS compresses the front of an engagement: **assessment, discovery and
blueprint**. Those are the phases where a delivery team spends weeks producing
documents whose structure barely changes between clients — a fit assessment, an
effort estimate, a target architecture, a guardrails matrix, a value case. The
pipeline drafts all of them in minutes, so the team starts arguing about the
content on day one instead of week three.

It is **not a replacement for a Forward Deployed Engineer or an FDE team**.
Every artifact it produces is a proposal a human owns, corrects and defends in
front of the client. The agents are not in the room where the sponsor
hesitates, the architect pushes back, or the security lead names the constraint
nobody wrote down — and that room is where an engagement is won or lost.
Accelerating the phases is the whole claim; the judgment stays with the people
running them.

## Four layers in this repository

| Layer | What it is | State | Where |
| --- | --- | --- | --- |
| **1. Methodology (reference)** | The "what" and the "why" — playbook, templates, checklists, supporting docs | In use | [`PLAYBOOK.md`](PLAYBOOK.md), [`templates/`](templates), [`checklists/`](checklists), [`docs/`](docs) |
| **2. Agent team (execution in Claude Code)** | The "who" and the "how" — 9 AI agents, reusable skills, task specs and the operating harness that runs them in Claude Code | In use | [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`specs/`](specs), [`harness/`](harness) |
| **3. System architecture (vision)** | The "where to" — a specification for a Delivery OS with persisted state, a pattern library, an evaluation engine and a production control plane | Aspirational — partly implemented (see layer 4) | [`docs/system-architecture/`](docs/system-architecture) |
| **4. Platform (real implementation)** | The same 9 agents running as an actual Next.js app: engagement form with automatic brief extraction (paste or upload .txt/.md/.pdf/.docx), sequential pipeline on Gemini 3.7 Flash with Claude Haiku 4.5 fallback, state in a local SQLite file, light and dark themes, and a consolidated Enterprise Report in HTML with PDF export | In use — runs on localhost by design, no deployment step | [`platform/`](platform) — see [`platform/README.md`](platform/README.md) |

Layer 3 remains largely target-architecture documentation — see the notice in [`docs/system-architecture/README.md`](docs/system-architecture/README.md). Layer 4 is where that vision becomes real code, starting with the "solo FDE" slice (no multi-tenancy, no RBAC yet).

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
| [`docs/system-architecture/`](docs/system-architecture) | FDE OS architecture vision: 20 system documents, 4 ADRs, JSON Schemas for the data contracts, templates and a reference use case |
| [`docs/integrations/`](docs/integrations) | Feeding Phase 1 from instrumented process discovery instead of manual shadowing alone |
| [`platform/`](platform) | The working Next.js app: 9 agents running on Gemini/Haiku, SQLite state, intake form with automatic extraction, rendered Enterprise Report |
| [`templates/`](templates) | Field-ready templates (qualification, blueprint, ROI, SOW, status report) |
| [`checklists/`](checklists) | Per-phase quality checklists (Go/No-Go, go-live) |
| [`.claude/agents/`](.claude/agents) | 9 AI agents — one orchestrator plus one specialist per phase or discipline, ready to use in Claude Code |
| [`.claude/skills/`](.claude/skills) | 7 reusable skills (fit score, ROI calculation, golden set, guardrails matrix, blueprint, status report, effort estimation) invoked by several agents |
| [`specs/`](specs) | `agent-roster.md` (team overview) and `task-specs/` (handoff, shadowing and go-live review protocols) |
| [`harness/`](harness) | How to run the agent team in practice: per-engagement folder convention, tool/MCP matrix, reusable skeleton |
| [`docs/enterprise-report.html`](docs/enterprise-report.html) | Enterprise report in HTML — framework, agents, RACI, KPIs, capacity, governance and pricing in one document, ready to open in a browser or export to PDF |

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

Full detail in [`specs/agent-roster.md`](specs/agent-roster.md). The broader target topology (16 roles) for when the system grows past solo operation is in [`docs/system-architecture/03-agent-operating-model.md`](docs/system-architecture/03-agent-operating-model.md).

## Using it

1. Read [`PLAYBOOK.md`](PLAYBOOK.md) for the full phase flow.
2. Open Claude Code in this repository (or copy `.claude/agents/` and `.claude/skills/` into your client's repository) — the 9 agents become available automatically.
3. Ask `fde-master` to start or resume an engagement. It creates the folder under `harness/engagements/<client>/` from the skeleton and delegates to the right phase specialist.
4. Before closing Phase 0, check [`docs/client-profile-adaptation.md`](docs/client-profile-adaptation.md) to calibrate duration and formality to the client's size and sector.
5. At the end of each phase, `fde-qa` runs the matching Go/No-Go checklist before you move on.
6. Treat `docs/reference-stack.md` as a menu of tools — adapt it to each client's infrastructure reality.
7. To see where the system is heading, and the data contracts, ADRs and roadmap already specified, start at [`docs/system-architecture/README.md`](docs/system-architecture/README.md).

Client engagements live in `harness/engagements/<client>/`, which is gitignored on purpose: client material never reaches the repository. Full command cheatsheet and folder convention in [`harness/README.md`](harness/README.md).

## Installation

### Prerequisites

- **Node.js 18.18 or newer** (`node --version`). Install from [nodejs.org](https://nodejs.org) or via `nvm install 20`.
- **An API key for at least one model provider.** The pipeline calls Gemini first and falls back to Claude automatically, so either one alone is a working setup:
  - Gemini — free tier available at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
  - Claude — [console.anthropic.com](https://console.anthropic.com/settings/keys)

No database to install and nothing to deploy: FDE OS runs on localhost against a SQLite file created for you. Engagement data is client material and stays on your machine.

> **Do not clone into a cloud-synced folder** (iCloud Drive's Desktop & Documents, Dropbox, OneDrive). The sync daemon intercepts file access, and on a tree with `node_modules` and `.git` that surfaces as a dev server hanging at 0% CPU, renames reverting on their own, and duplicate "folder 2" copies — symptoms that look like disk failure and are not.

### 1. Clone and install

```bash
git clone https://github.com/juliopessan/FDE-OS.git
cd FDE-OS/platform
npm install
```

The interface is a Node app; the nine agents and the report renderer are a
Python package next to it. Install that too, or the pipeline will not run:

```bash
cd ../engine
uv sync
cd ../platform
```

`uv sync` builds an isolated environment — nothing lands in your system Python.
If you do not have [uv](https://docs.astral.sh/uv/), install it first; the app
falls back to `uv run` when the environment is missing, so it is the one tool
that has to be there. Why the split, and what the engine can do on its own, is
in [`engine/README.md`](engine/README.md).

`npm install` ends with a vulnerability count and suggests `npm audit fix --force`. **Do not run it.** It upgrades Next, drizzle-orm and drizzle-kit across major versions, and the Next 16 line defaults to Turbopack, which fails against the `webpack` block in `next.config.mjs` — the build breaks. The advisories themselves are covered under [Common problems](#common-problems) below.

### 2. Add your API key

You can do this in the browser: start the app (steps 3 and 4) and the dashboard asks for a key on first run, checks it against the provider, and writes it to `.env.local` for you.

To do it by hand instead:

```bash
cp .env.example .env.local
nano .env.local
```

Fill in `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, or both — either one alone works. Leave `DATABASE_URL` as `file:./local.db`. `.env.local` is gitignored.

Avoid `echo "KEY=..." >> .env.local`: the key lands in your shell history, which is a copy nobody remembers to clean up.

### 3. Create the database

```bash
npm run db:migrate
```

Creates `local.db` with the three tables (`engagements`, `phase_runs`, `reports`). Safe to re-run.

### 4. Start it

```bash
npm run dev
```

Open **http://localhost:3000**.

### 5. Run your first engagement

1. Go to **Start an engagement** (`/dashboard/new`).
2. Paste a client discovery document into the intake box — or upload a `.txt`, `.md`, `.pdf` or `.docx` — and press **Extract brief from this text**. The six fields below fill themselves in; review and correct them, since the agents treat this as the source of truth.
3. Press **Run agent pipeline** on the engagement page. Nine agents run in sequence, each reading everything the previous ones produced.

   Budget **3–5 minutes**, **roughly 200k tokens** and **under $1** per full run (measured across six engagements: ~160k in, ~40k out). The input side dominates because context accumulates — the first agent sees a 1.5k-token prompt and the ninth sees 39k, since it reads all eight artifacts before it. Worth knowing before you point this at a free tier.

   The engagement page reports the exact figures for your own runs under **Pipeline status**. Treat the money as an estimate: it comes from published list rates, ignores prompt-cache discounts, and Gemini 3.7 Flash is on a promotional rate that doubles on 2027-01-01.
4. When it finishes, open **View enterprise report**, and use **Export PDF** in the report header to hand it to a sponsor.

### Verifying your setup

```bash
npm run build        # type-check and production build
npm run test:report  # report sanitiser test suite
```

### Common problems

| Symptom | Cause and fix |
| --- | --- |
| `Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set` | No key configured yet. Open `/dashboard` and the setup dialog will take one, or fill `.env.local` by hand — it belongs in `platform/`, not the repository root. Editing the file by hand needs a dev server restart; the dialog does not. |
| Pipeline fails partway with a timeout | Each model call is capped at 90 seconds. Usually provider rate limiting: wait and press Run again. Completed phases are already persisted. |
| `__webpack_modules__[moduleId] is not a function` | Stale build cache, typically after installing a dependency. `rm -rf .next node_modules/.cache` and restart. |
| Port 3000 already taken | `npm run dev -- --port 3001`. |
| `npm audit` reports 8 vulnerabilities | Expected, and none of them is reachable in this app. Four are dev-only (esbuild's dev server, pulled in by `drizzle-kit`). The others arrive through Next (postcss, sharp) and drizzle-orm, and each needs input this app never gives them: attacker-controlled CSS, user-uploaded images, or table names taken from user input. They are only fixed in Next 16 and drizzle-orm 0.45, which is a migration, not an `audit fix` — see the note in step 1. |
| Dev server hangs without logging anything | Almost always the cloud-sync issue described above. Move the checkout outside the synced folder. |

See [`platform/README.md`](platform/README.md) for architecture, model routing and the maintenance scripts.

## Licence

MIT — use, adapt and redistribute freely, keeping the copyright notice.
