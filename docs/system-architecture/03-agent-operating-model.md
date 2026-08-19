# Agent Operating Model

## Principle

**One agent = one primary responsibility + an explicit boundary of authority.**

| Agent | Responsibility | Authority |
|---|---|---|
| fde-master | orchestration and state | routes the work |
| fde-qualifier | fit and qualification | recommends GO/NO-GO |
| fde-assessor | discovery | recommends use cases |
| fde-capacity-planner | WBS/PERT | blocks unrealistic commitments |
| fde-context-engineer | RAG/context | recommends context architecture |
| fde-data-engineer | enterprise data | recommends data architecture |
| fde-architect | solution architecture | proposes architecture |
| fde-ai-model-specialist | benchmarking/routing | recommends models |
| fde-solution-composer | solution composition | produces the solution spec |
| fde-builder | implementation scaffold | no writes to production |
| fde-evaluator | evaluation runs | produces evidence |
| fde-guardrails | policy/security | security veto |
| fde-qa | independent QA | quality veto |
| fde-release-manager | readiness | recommends release |
| fde-incident | incident diagnosis | recommends remediation |
| fde-scale-ops | operations/value | recommends optimisation |

> Note: this is the full system's target topology. The agent team already operating in [`.claude/agents/`](../../.claude/agents) is a deliberately leaner subset (9 agents) calibrated for solo operation — see [`specs/agent-roster.md`](../../specs/agent-roster.md).

## Handoff Contract

```yaml
handoff:
  from: fde-assessor
  to: fde-architect
  engagement_id: eng-001
  produced: [requirement_set:v3, process_blueprint:v2]
  blockers: ["API rate limit not confirmed"]
  confidence: 0.87
```

## Rules

1. Read persisted state before delegating.
2. Send the minimum context necessary.
3. Persist typed output.
4. QA and security vetoes cannot be worked around.
5. Failed validation returns to the responsible agent.
6. High-impact actions require human approval.
