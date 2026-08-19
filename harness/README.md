# Operational Harness for the FDE Agent Team

This directory is the **execution** layer of the FDE OS delivery method — how a solo FDE actually runs the agent team day to day, inside Claude Code.

For the methodology itself, see [`../PLAYBOOK.md`](../PLAYBOOK.md). For the agents, see [`../.claude/agents/`](../.claude/agents) and [`../specs/agent-roster.md`](../specs/agent-roster.md).

## How the agents become available

The files in `.claude/agents/*.md` and `.claude/skills/*/SKILL.md` follow Claude Code's native subagent and skill formats. Two ways to use them:

1. **Directly in this repository:** open Claude Code at the repo root — the agents are available automatically.
2. **In a client repository:** copy the `.claude/agents/` and `.claude/skills/` folders into the client project's repository (or reference this repo as a submodule or internal package), keeping the relative paths to `PLAYBOOK.md`, `templates/`, `checklists/` and `docs/` in this methodology repository.

## Per-Engagement Folder Convention

Each active client has its own folder at `harness/engagements/<client-slug>/`, created from the skeleton in [`engagement-template/`](engagement-template). **This folder does not go into the framework's version control** (see `.gitignore`) — each engagement is confidential and must live in its own repository or in the FDE's private area.

```
harness/engagements/<client>/
├── state.md                  # current phase, Go/No-Go decisions, next steps
├── 00-qualification/
│   ├── fit-score.md
│   ├── proposal-one-pager.md
│   ├── effort-estimate.md     # fde-capacity-planner (Phase 1 WBS+PERT, before agreeing the proposal)
│   └── capacity-plan.md       # fde-capacity-planner
├── 01-assessment/
│   ├── blueprint.md
│   ├── roi-calculation.md
│   ├── effort-estimate.md     # fde-capacity-planner (Phase 2 WBS+PERT, at the Go)
│   ├── capacity-plan.md       # fde-capacity-planner
│   └── handoff.md
├── 02-context/
│   ├── pipeline-design.md
│   ├── golden-set.md
│   ├── connectors.md
│   ├── effort-estimate.md     # fde-capacity-planner (Phase 3 WBS+PERT)
│   ├── capacity-plan.md       # fde-capacity-planner
│   └── handoff.md
├── 03-engineering/
│   ├── architecture.md            # fde-architect
│   ├── autonomy-matrix.md         # fde-guardrails
│   ├── guardrails.md              # fde-guardrails
│   ├── data-protection-review.md  # fde-guardrails
│   ├── qa-report.md               # fde-qa
│   └── handoff.md
└── 04-scale/
    ├── weekly-reports/
    ├── monthly-roi-reports/
    ├── effort-estimate.md     # fde-capacity-planner — re-run at every scope or retainer change
    ├── capacity-plan.md       # fde-capacity-planner
    └── incident-runbook.md
```

`effort-estimate.md` and `capacity-plan.md` (templates in `templates/`) are re-run **whenever scope changes**, not once per phase — the most recent version is the one that governs the current proposal and price.

## Command Cheatsheet

| Situation | What to do |
| --- | --- |
| Start a new client | Ask `fde-master` to start an engagement; it copies `engagement-template/` to `engagements/<client>/` |
| Resume a client in a new session | Ask `fde-master` to resume `<client>`; it reads `state.md` and delegates to the current phase's agent |
| Jump straight to a specialist | Call the agent directly (for example `fde-context-engineer`) when you already know exactly what you need — useful for targeted rework inside a phase already underway |
| Validate before advancing a phase | Ask `fde-qa` to run the current phase's Go/No-Go checklist |
| Close the month on an active retainer | Ask `fde-scale-ops` to produce the monthly ROI report |
| Agree a phase timeline or price (new or renegotiated) | Ask `fde-capacity-planner` to run the estimate (WBS+PERT) and the capacity plan **before** committing to a timeline or price |
| Scope changed mid-phase | Ask `fde-capacity-planner` to re-run the estimate — never reuse the old one |

## Tool / MCP Matrix per Agent

| Agent | Native tools | Useful external MCP (optional) |
| --- | --- | --- |
| `fde-master` | Read, Write, Edit, Bash, Grep, Glob, Agent | — |
| `fde-qualifier` | Read, Write, Edit, WebSearch, WebFetch | The FDE's CRM (if any), public company data |
| `fde-capacity-planner` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Spreadsheet or project management tool (if the FDE already uses one), market rate benchmarks |
| `fde-assessor` | Read, Write, Edit, Bash, WebSearch | Meeting recorder or transcription (to consolidate shadowing), client data spreadsheet |
| `fde-context-engineer` | Read, Write, Edit, Bash, Grep, Glob | Connector for the chosen VectorDB, MCP for the client's legacy systems (CRM/ERP) |
| `fde-architect` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Documentation for the chosen LLM and orchestration provider |
| `fde-guardrails` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Structured guardrail tooling (for example schema validation), data-protection reference |
| `fde-qa` | Read, Write, Edit, Bash, Grep, Glob | Load-testing tool, if more than the basics is needed |
| `fde-scale-ops` | Read, Write, Edit, Bash, WebSearch | Observability and tracing platform (Langfuse or equivalent), token cost dashboard |

No external MCP is required for the framework to work — the agents operate with Claude Code's native tools. The MCPs listed are per-phase accelerators, to be added according to the client's real stack (see `docs/reference-stack.md`).

## Harness Rules

1. **State in files, not in conversation memory.** Any new session must be able to resume an engagement by reading `state.md` — never depend on the context of a previous conversation.
2. **One `state.md` per client.** Never mix the state of two engagements in the same file.
3. **Confidential by default.** Real client data is never committed to this methodology repository — it lives in `harness/engagements/` (gitignored) or in the engagement's own repository.
