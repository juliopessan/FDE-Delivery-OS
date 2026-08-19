---
name: blueprint-writer
description: Structures the Phase 1 AI Architecture Blueprint from shadowing data — process classification, flow diagram, integration systems, risks and PoC scope. Use it when a client's operational shadowing is complete.
---

# Skill: Writing the AI Architecture Blueprint

## When to use it

At the end of operational shadowing in Phase 1 (`fde-assessor`), before the ROI calculation and the Phase 1 Go/No-Go.

## Steps

1. Open `templates/blueprint.md`.
2. Fill in the process context: as-is description, monthly frequency and volume, current average time per run, people and systems involved — all from what was observed during shadowing, not from unconfirmed manager accounts.
3. Classify the process on the Qualification Matrix:
   - Rigid and repetitive → simple RPA/webhooks (flag that Gen AI may not be the right answer).
   - Cognitive/Contextual → Gen AI (RAG/LLM).
   - Decision-making/Multi-step → autonomous agents/MCP.
4. Describe the flow diagram (text or ASCII) covering input → steps → human decision points → output.
5. List every integration system required, with access type (read/write) and approval status — this feeds Phase 2 directly.
6. Document risks and dependencies explicitly — never leave them implied.
7. Bound the PoC scope: what is in, what is explicitly out, and the objective success criterion.
8. Submit it for executive sponsor approval before treating Phase 1 as complete.

## Common mistakes to avoid

- Classifying the process as Decision-making/Multi-step by default when it is really Cognitive/Contextual — that inflates Phase 3 complexity for nothing.
- Leaving "Out of scope" empty or vague — it is the main protection against scope creep in later phases.
- Requesting write access to systems in the Phase 1 blueprint — write access is decided in Phase 3, by `fde-guardrails`.
