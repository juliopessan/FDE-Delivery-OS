---
name: status-report
description: Produces the weekly status report (any phase) or the monthly realized-ROI report (Phase 4) for an FDE engagement. Use it at the end of each working week on an active engagement, or monthly during Phase 4.
---

# Skill: Status / ROI Report

## When to use it

- Weekly, in any phase of an active engagement — it keeps the client informed and builds an auditable history.
- Monthly, in Phase 4, specifically for the realized-ROI report (`fde-scale-ops`).

## Steps — Weekly status

1. Open `templates/weekly-status-report.md`.
2. Write the executive summary in 3 lines at most — the client should get the essentials without reading the rest.
3. List the week's planned items with status (done / in progress / blocked).
4. Record blockers and risks explicitly, even small-looking ones — blockers not reported early become phase delays.
5. From Phase 4 onwards, include the weekly metrics (HITL intervention rate, token cost, error rate, volume processed).

## Steps — Monthly ROI report (Phase 4)

1. Pull the original estimated ROI from `harness/engagements/<client>/01-assessment/roi-calculation.md`.
2. Pull the month's real production data (observability telemetry).
3. Compare realized against estimated — where they diverge, explain the cause (adoption, data quality, reduced scope).
4. Highlight trends (for example, a falling HITL intervention rate month over month) as a maturity signal.
5. Close with a clear recommendation: keep, expand or adjust the retainer scope.

## Common mistakes to avoid

- Reporting only good news — an omitted ROI gap is the leading cause of churn once it surfaces.
- Skipping the report in quiet weeks — no report raises more doubt with a client than a short one saying there are no blockers.
