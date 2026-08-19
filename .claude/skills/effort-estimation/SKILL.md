---
name: effort-estimation
description: Methodology for estimating effort in hours per phase of the A.C.E.S. methodology, using a WBS (work breakdown structure) plus three-point (PERT) estimation. Use it when committing to a phase timeline or price, or when revalidating effort after any scope change.
---

# Skill: Effort Estimation (WBS + PERT)

## When to use it

- When closing the proposal for each phase (Phase 0 for Phase 1; at each Go/No-Go for the next phase).
- At every scope revalidation during Phases 2-4 (new tool, new use case, change in client size or regulatory posture).
- Used by `fde-capacity-planner`, but any agent can invoke it on noticing that scope has changed.

## Steps

1. **Break down into a WBS:** list the phase's tasks granularly. Rule of thumb: no task should estimate above roughly 2 days of effort — if it does, decompose further.
2. **Estimate three points per task** (in hours):
   - **Optimistic (O):** everything goes well, no surprises.
   - **Most Likely (M):** realistic scenario, with the usual small adjustments.
   - **Pessimistic (P):** reasonable surprises (delayed access, poor data quality, rework).
3. **Apply the PERT formula:**
   ```
   Estimate (E)          = (O + 4×M + P) / 6
   Standard deviation (SD) = (P − O) / 6
   ```
4. **Total by role** (generalist FDE, integration developer, data engineer, security/compliance) and by phase.
5. **Apply a 15-20% buffer** on the phase total.
6. **Compare against available capacity** (see the `fde-capacity-planner` agent) to decide whether solo delivery holds or whether reinforcement or a timeline extension is needed.

## Anchoring reference (durations from `PLAYBOOK.md`)

| Phase | Reference duration |
| --- | --- |
| 0 — Qualification | 3-5 business days |
| 1 — Assessment | 2-3 weeks |
| 2 — Context | 2-3 weeks |
| 3 — Engineering | 3-4 weeks |
| 4 — Scale | Continuous, 10-15h/week |

Use these durations as an anchor to sanity-check the PERT total — if the WBS sums far above or below the reference, revisit the decomposition before accepting the number.

## Common mistakes to avoid

- Estimating off the top of your head without a WBS — it loses granularity and hides the standard deviation of specific tasks.
- Ignoring the standard deviation — two tasks with the same mean but very different deviations carry very different overrun risk; the wider one deserves an extra buffer or an intermediate checkpoint.
- Not recalculating when scope changes mid-phase — the original estimate becomes fiction.
- Zeroing the buffer to win the commercial proposal — it moves overrun risk into the middle of the engagement, where it costs more to fix.
