# Template — Estimated ROI Calculation (Phase 1)

**Data source:** [ ] Real shadowing [ ] Market benchmark (pre-shadowing) — if benchmark, also fill in the "Market Benchmarks Used" section at the end and label this document clearly as an illustrative scenario, not validated ROI (see the `roi-calculator` skill, "Fallback: market benchmarking").

## Inputs (collected during shadowing)

| Variable | Value |
| --- | --- |
| Current average time per run (min) | |
| Monthly run volume | |
| Average hourly cost of the people involved | |
| Current error / rework rate (%) | |

## Post-automation estimate

| Variable | Value |
| --- | --- |
| Average time per run with AI (min) | |
| % of runs fully autonomous (no HITL) | |
| % of runs with HITL (partial human review) | |
| Estimated infrastructure and token cost per run | |

## Formula

```
Current monthly cost = (current_time_min / 60) × monthly_volume × hourly_cost
Monthly cost with AI = [(ai_time_min / 60) × monthly_volume × hourly_cost × %HITL]
                       + (token_cost_per_run × monthly_volume)
                       + fixed_monthly_infrastructure_cost

Monthly saving       = Current monthly cost − Monthly cost with AI
ROI (payback months) = Total engagement investment (Phases 1-3) / Monthly saving
```

## Result

| Metric | Value |
| --- | --- |
| Current monthly cost | |
| Projected monthly cost with AI | |
| Estimated monthly saving | |
| Total investment (Phases 1-3) | |
| Estimated payback (months) | |

> Always report a range (optimistic/conservative), never a single number — it protects the FDE's credibility when the real Phase 4 result diverges from the estimate.

## Market Benchmarks Used (fill in only when the data source is a benchmark)

| Estimated variable | Benchmark used | Source (name + link) | Adjustment applied and rationale |
| --- | --- | --- | --- |
| | | | |

**Scenarios (low / medium / high)** — mandatory when the source is a benchmark, given the greater uncertainty:

| Scenario | Assumed volume / impact | Estimated monthly saving | Estimated payback (months) |
| --- | --- | --- | --- |
| Conservative | | | |
| Medium | | | |
| Optimistic | | | |

⚠️ **This benchmark-based calculation is a proposal placeholder, not validated ROI.** It must be replaced with real numbers as soon as Phase 1 shadowing happens.
