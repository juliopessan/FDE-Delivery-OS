---
name: roi-calculator
description: Calculates estimated (Phase 1) or realized (Phase 4) ROI for an FDE engagement, using the standard formula of current monthly cost vs. monthly cost with AI. Use it whenever an ROI projection or result needs producing or updating for a client.
---

# Skill: ROI Calculation

## When to use it

- In Phase 1, to estimate PoC ROI before the Go/No-Go (`templates/roi-calculation.md`).
- In Phase 4, monthly, to compare realized ROI against the estimate (`fde-scale-ops`).

## Formula

```
Current monthly cost = (current_time_min / 60) × monthly_volume × hourly_cost
Monthly cost with AI = [(ai_time_min / 60) × monthly_volume × hourly_cost × %HITL]
                       + (token_cost_per_run × monthly_volume)
                       + fixed_monthly_infrastructure_cost

Monthly saving       = Current monthly cost − Monthly cost with AI
ROI (payback months) = Total engagement investment (Phases 1-3) / Monthly saving
```

## Steps

1. Collect the inputs (average time per run, monthly volume, hourly cost, current error rate) — in Phase 1 they come from shadowing; in Phase 4 from real production telemetry.
2. Estimate (Phase 1) or measure (Phase 4) the time with AI, the share of autonomous vs. HITL runs, and infrastructure and token cost.
3. Apply the formula above.
4. **Always report a range (optimistic/conservative)** in Phase 1 — never a single number. In Phase 4, report the real observed figure, but set it against the original range.
5. **Report released capacity and money as two separate lines**, and never let the first silently become the second. Hours released are a capacity result. They turn into a saving only if headcount changes, or if those hours are redeployed to work that earns — and which of the two is happening is the client's decision, not the calculation's. State the assumption you are making, and name which of the two the client is actually buying.
6. If the realized figure (Phase 4) diverges from the estimate (Phase 1), document the cause — do not omit it.

## Common mistakes to avoid

- Forgetting fixed infrastructure cost (VectorDB, observability) — it inflates ROI artificially.
- Assuming 100% autonomous runs without accounting for the real HITL share set by the autonomy matrix (`fde-guardrails`).
- Presenting a single payback number with no confidence range in Phase 1.
- Converting released hours straight into money at a loaded rate and calling the result a saving — a CFO makes that distinction in the first meeting, and a report that blurs it loses the room.
- Leaving the assumption that dominates the case in a footnote. If an unvalidated labour rate is carrying the business case, it belongs in the open.

## Fallback: market benchmarking (when there is no real shadowing yet)

Before shadowing happens — or when the fit score flags that access to real data is still pending (`fde-qualifier`) — ROI can be pre-filled with **public market benchmarks** to give the proposal an order of magnitude, rather than leaving the calculation empty or, worse, inventing client-specific numbers.

### How to use it

1. For each input in the formula (time per run, hourly cost, conversion or error rate), find an equivalent public benchmark by **function or process** (for example "average time to produce a commercial proposal", "hourly cost of a salaried marketing analyst", "conversion lift from a customer-service chatbot") — never by named company.
2. Prefer benchmarks segmented to the client's closest size and sector (for example, companies under 100 employees, marketing agencies) over generic global averages.
3. When the benchmark found covers a heavier or different process than the real one (for example, a formal RFP as a proxy for an agency's commercial proposal), apply an explicit adjustment factor and document its logic — never use the raw number without justifying the analogy.
4. Cite each benchmark's source (name plus link) in the ROI document — a benchmark without a traceable source is no different from a guess.
5. Label the whole calculation prominently at the top: **"Illustrative scenario based on market benchmarks — not client data."**
6. Present it as **scenarios** (low/medium/high volume, or low/medium/high impact), not as a single number — a benchmark carries more uncertainty than a measurement, so the range should be wider, not narrower.
7. When real shadowing happens, **replace** the benchmark numbers with the real ones — a benchmark-based document is a proposal placeholder, not the final ROI that enters the Phase 1 Go/No-Go.

### Mistakes specific to this fallback

- Presenting a benchmark scenario as though it were validated ROI — it breaks client trust the moment the real number diverges.
- Using the most optimistic statistic found in research as the base case — always prefer the conservative end of the reported range, keeping the optimistic figure only as a ceiling reference.
- Not updating the document when the real data arrives — the benchmark expires the moment shadowing produces a measured number.
