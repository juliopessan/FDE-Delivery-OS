---
name: deliverable-review
description: Use when reviewing an artifact a pipeline agent produced, or immediately after finding a defect in a rendered Enterprise Report. Owns the standard a client-facing artifact is held to, and the record of every defect the agents have actually produced.
---

# Skill: Deliverable Review

The Enterprise Report is a document a client pays for and reads. This skill owns
the standard its artifacts are held to, and — in
[references/examples.md](references/examples.md) — the growing record of the
defects the agents have really produced, so the same one is not diagnosed from
scratch twice.

It is guidance, not a checklist to run top to bottom.

## The one test

For every passage ask: **could the client, knowing nothing about how this report
was produced, resolve every reference in it and verify every claim?**

If no, the passage is written from the pipeline's vantage rather than the
reader's, and it does not belong in the deliverable. Agent names, phase numbers,
confidence scores, instructions to a later agent, and citations to artifacts only
the pipeline can see all fail this test. So does a figure with no stated source.

A citation the client *can* resolve — "per Discovery Intake Section 12" — passes,
because the client has the intake.

## A defect fixed only in the renderer is not fixed

This is the rule the skill exists for.

When a malformed artifact reaches the report, the fast repair is downstream: a
sanitiser in `platform/src/lib/report/markdown.ts`, a CSS rule in `render.ts`.
Those are worth having — they are a net under a pipeline that cannot be
re-run for free. But the agent that produced the defect will produce it again on
the next engagement, and the net has to be widened every time.

So a defect is closed when **both** are true:

1. The prompt that produced it is changed, in `platform/src/lib/agents/prompts/`
   or the shared `report-style.ts`.
2. The case is recorded in [references/examples.md](references/examples.md), with
   what appeared, why it fails, and what should have been written.

Record the downstream guard too, when there is one. A future reader needs to know
the renderer already compensates, or they will "fix" it twice and conclude the
prompt change did nothing.

## Preserve the whole claim

Shortening is not the goal. Before cutting a passage, identify what it asserts —
the actor, the condition, the modality (must / may / never), the exception, the
consequence, the source it traces to. Cut adjectives, repetition and narration
only when every one of those survives.

A shorter artifact that dropped a constraint is worse than the long one. The
agents' failure mode is over-structure and repetition, not missing facts; treat a
missing fact as the more serious defect of the two.

## Workflow

1. Read the artifact as the client would — beginning to end, with no knowledge of
   the pipeline. Note every passage that fails the one test.
2. Check [references/examples.md](references/examples.md) before diagnosing.
   Most defects have been seen; the entry names the prompt that owns it.
3. For a defect that is new, find the prompt that produced it and change it there.
   Add a downstream guard only if a stored artifact needs to render correctly
   before the pipeline can be re-run.
4. Record the case in the examples file. Write it as a rule for the next reader,
   not as a story about this engagement — no dates, no engagement names, no
   "we found that".
5. Re-read the analogous passages. A defect that appeared in one phase artifact is
   usually in three, because the nine prompts share `report-style.ts`.

## What this skill does not own

Whether a figure is *correct* — that is the QA agent's gate and the
[fit-score](../fit-score/SKILL.md) and [roi-calculator](../roi-calculator/SKILL.md)
skills. This skill asks whether the artifact can be handed to a client, not
whether its numbers are right.

---

The structure here — a standard whose examples file accumulates every resolved
case, so calibration compounds instead of resetting — is adapted from the
`.agents/skills` convention in [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (MIT).
