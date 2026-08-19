---
name: golden-set-builder
description: Builds and validates the golden set of reference questions used to measure recall and quality of the RAG pipeline (Phase 2) and to run regression tests before production (Phase 3). Use it when configuring a new context pipeline or before approving any prompt or model change.
---

# Skill: Building and Validating the Golden Set

## When to use it

- In Phase 2, when configuring the ingestion/RAG pipeline (`fde-context-engineer`).
- In Phase 3, before any go-live or prompt/model change (`fde-qa`, regression testing).

## Steps — Building

1. Gather 20-30 real questions the system must answer correctly (for high-risk sectors — legal, healthcare, financial — use 50+).
2. For each question record: the question, the expected answer, and the source document the answer should come from.
3. Favour questions that cover: common cases (high volume), edge cases, and questions the system **should refuse to answer** (out of scope, data unavailable) — this tests whether the system avoids hallucinating when grounding is missing.
4. Save it to `harness/engagements/<client>/02-context/golden-set.md`.

## Steps — Validating

1. Run each question against the system (or against the documented design, if it is not implemented yet).
2. Record: the answer received, correct or incorrect, and whether the source was cited correctly.
3. Calculate recall = (correct answers with the correct source) / (total questions).
4. Compare it against the defined threshold (default 85%; high-risk sectors ≥ 95%).
5. If it falls below the threshold, do not approve the Go/No-Go — return it to `fde-context-engineer` to adjust chunking, embedding or source quality.

## Common mistakes to avoid

- A golden set made only of easy questions — it hides real retrieval problems.
- Leaving out questions the system should refuse — hallucination-by-omission goes untested.
- Running validation once and never again after prompt or model changes (regression testing is mandatory).
