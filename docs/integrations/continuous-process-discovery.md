# Integration — Continuous Process Discovery as a Phase 1 Source

> **Skeleton.** An initial document for teams that already run instrumented
> process capture and want to feed it into Phase 1 instead of relying on manual
> shadowing alone. Extend it as a real pilot produces evidence.

## The thesis

Phase 1 currently depends on manual shadowing: 3+ sessions observing operators
to estimate average time per run and monthly volume — the two direct inputs to
the ROI calculation (`templates/roi-calculation.md`). When shadowing has not
happened yet, `fde-assessor` falls back to market benchmarks as a placeholder,
labelled explicitly as an illustrative scenario.

A process discovery tool replaces estimation with measurement. Instead of
observing 3 sessions and extrapolating, event capture records **every** run in
the period, and discovery computes average time, volume and variants directly
from the data — not from a sample, not from a benchmark.

This does not retire shadowing as a technique — it retires the need to use it
as the only source when instrumented capture exists. Both remain valid; the
choice between them is about what is available at the client, not about which
is better in the abstract.

## Mapping — Phase 1 × discovered process

| Phase 1 deliverable | Manual source (today) | Discovery source |
|---|---|---|
| Average time per run | Timed during shadowing | Average process duration |
| Monthly volume | Observed / extrapolated count | Instance count over the captured period |
| Systems involved | Operator interview | Application signature (the discovered process's application sequence) |
| Rigid/Cognitive/Decision-making classification | The assessor's judgement on what was reported | Risk level and automation potential as a starting signal — **confirm with human judgement, do not replace it** |
| Prioritisation between processes (ICE) | Estimated Impact/Confidence/Ease | Instance count × average duration gives Impact from real data; Confidence rises once the process has a generated playbook with a confidence score |
| Variants and dominant path | Exceptions as reported by the operator | Every observed variant, not only the one the operator remembered to mention |

## What this changes in `roi-calculation.md`

Add a third data source alongside "Real shadowing" and "Market benchmark":
**Continuous discovery**. The "Inputs" fields stop being filled in by hand —
they come from the discovery tool's process API:

```
Current average time per run (min)  ← average process duration
Monthly run volume                  ← instance count (normalised to the capture period)
Current error / rework rate (%)     ← share of variants off the dominant path
```

The hourly cost of the person involved still comes from an interview — a
behavioural capture tool has no access to payroll, and should not have.

## What this changes in `blueprint.md`

- **Section 1 (Process Context)** — frequency, average time and systems
  involved come from the discovered process, not from what was reported.
- **Section 3 (Flow Diagram)** — the canonical step sequence already exists in
  order; the assessor formats it rather than rebuilding it from scratch.
- **Section 4 (Integration Systems)** — the application signature lists the
  systems touched; access type (read/write) still requires human confirmation,
  because capture alone cannot tell which action is a write to production.

## The credibility bridge: validating against an existing audit

When the client **has already been audited** in another engagement (or by
another consultancy), comparing discovery output against that audit answers one
concrete question before anything is presented to the client: **does automatic
discovery reproduce what the manual audit documented?**

Method: sequence alignment between the audit's steps (business language) and
the discovered steps (application plus UI action) — the two vocabularies differ
by nature, so the comparison is not string equality. Set a match threshold
before running it (70% is a reasonable starting gate) and record the result.

This is not an optional courtesy step — it is what lets `fde-assessor` present
a discovery-generated blueprint with the same credibility as one built from
manual shadowing, without redoing the shadowing to prove discovery invented
nothing.

## What stays manual, always

- **Final classification** on the Qualification Matrix — an automation-potential
  score is a starting signal, not a verdict. A process with low efficiency and
  high repetition can be cognitive by nature (a credit decision, for example),
  not merely a rigid process executed badly.
- **Risks and dependencies** (blueprint Section 5) — event capture cannot see
  organisational context, internal policy or the history of previous automation
  attempts.
- **Executive approval** — no data, from any source, replaces the sponsor's
  signature in Section 8.
- **Hourly cost and root-cause error rate** — payroll or financial audit data,
  outside the scope of behavioural capture.

## Technical handoff — step by step

1. Confirm the NDA is signed (unchanged rule from `fde-assessor.md`).
2. Instrument capture with the client's ingestion key.
3. Run discovery after a minimum capture period (recommended: 2 to 4 weeks,
   calibrated to the process volume).
4. If a previous audit of the same process exists, compare discovery output
   against it — attach the report to the blueprint as validation evidence.
5. Fill in `templates/blueprint.md` and `templates/roi-calculation.md` from the
   mapping above, with the manual fields (risks, hourly cost, approval) filled
   in by interview, not by assumption.
6. Follow the `checklists/go-nogo-phase1.md` checklist as usual — where the data
   came from does not change the Go/No-Go criterion.

## Open — to be extended

- A script to export the discovery API's process record directly into the format
  of `blueprint.md` and `roi-calculation.md` (today it is filled in by hand from
  the mapping above).
- An objective criterion for deciding "enough capture" before running
  discovery (today it is a calendar heuristic, not a statistical volume one).
- How a high automation-potential score should feed the ICE score more directly
  than as a starting signal — today that remains a manual step for the assessor.
