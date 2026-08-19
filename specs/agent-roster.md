# Spec — FDE Agent Team Roster

Overview of every agent that operates the FDE OS delivery method. Executable definitions live in [`.claude/agents/`](../.claude/agents).

| Agent | Phase | Mission | Tools | Enters when | Hands off to |
| --- | --- | --- | --- | --- | --- |
| [`fde-master`](../.claude/agents/fde-master.md) | All | Orchestrates, routes, keeps engagement state | Read, Write, Edit, Bash, Grep, Glob, Agent | Start or resumption of any session | Every specialist |
| [`fde-qualifier`](../.claude/agents/fde-qualifier.md) | 0 | Fit score, prospect research, proposal one-pager | Read, Write, Edit, WebSearch, WebFetch | New prospect, no contract | `fde-assessor` (on GO) |
| [`fde-capacity-planner`](../.claude/agents/fde-capacity-planner.md) | Cross-cutting | WBS + PERT, hours per role and phase, how many engineers, solo vs. reinforcement | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Before agreeing any phase timeline or price; at every scope change | `fde-master` (price impact) |
| [`fde-assessor`](../.claude/agents/fde-assessor.md) | 1 | Shadowing, qualification matrix, ICE, blueprint, estimated ROI | Read, Write, Edit, Bash, WebSearch | Phase 0 Go | `fde-context-engineer` (on GO) |
| [`fde-context-engineer`](../.claude/agents/fde-context-engineer.md) | 2 | RAG pipeline, VectorDB, connectors, golden set | Read, Write, Edit, Bash, Grep, Glob | Phase 1 Go | `fde-architect` (on GO) |
| [`fde-architect`](../.claude/agents/fde-architect.md) | 3 (architecture) | Agent topology, model routing | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Phase 2 Go | `fde-qa` |
| [`fde-guardrails`](../.claude/agents/fde-guardrails.md) | 3 (security) | I/O guardrails, autonomy matrix, data protection, auditing | Read, Write, Edit, Bash, Grep, Glob, WebSearch | In parallel with `fde-architect` | `fde-qa` |
| [`fde-qa`](../.claude/agents/fde-qa.md) | Cross-cutting | Validates Go/No-Go checklists, golden set, load and red-team tests | Read, Write, Edit, Bash, Grep, Glob | End of each phase | `fde-master` (with a verdict) |
| [`fde-scale-ops`](../.claude/agents/fde-scale-ops.md) | 4 | Observability, realized ROI, runbook, retainer | Read, Write, Edit, Bash, WebSearch | System in production | `fde-master` (new use case → back to Phase 0) |

## Roster Design Principles

1. **One agent, one phase, one primary responsibility.** It avoids the do-everything agent — the same principle the agents apply to client architectures (see `PLAYBOOK.md`, Phase 3).
2. **`fde-qa` never owns a solution.** It is the only agent that can block a phase from advancing without proposing the fix itself — the fix returns to the responsible specialist.
3. **`fde-guardrails` holds a veto over go-live.** No other agent can approve the move to production without its explicit sign-off.
4. **Every handoff goes through files**, under `harness/engagements/<client>/<phase>/`, never through conversation context alone — that is what allows another session to resume without losing state.
5. **Skills (`.claude/skills/`) are shared between agents** — reusable procedures (fit score, ROI, golden set, autonomy matrix, blueprint, status report, effort estimation) that more than one agent invokes, avoiding duplicated logic across the personas.
6. **`fde-capacity-planner` is the realism gate ahead of the security gate.** Where `fde-guardrails` vetoes go-live on technical or compliance risk, `fde-capacity-planner` vetoes timeline and price commitments on infeasible effort — no proposal closes without passing through it.

## Invocation Model

In a Claude Code session inside this repository (or inside a client repository that references this framework), the agents are available automatically via `.claude/agents/`. The recommended flow:

```
User → fde-master → decides phase/agent → delegates via the Agent tool → specialist agent executes → writes artifacts → fde-master updates state.md
```

See [`harness/README.md`](../harness/README.md) for the per-engagement folder convention and the command cheatsheet.
