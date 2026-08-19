# Value Realization

> Complements [`docs/pricing-model.md`](../pricing-model.md) and the [`roi-calculator`](../../.claude/skills/roi-calculator/SKILL.md) skill already in use — this describes the target model for continuous value instrumentation.

## Baseline

Capture volume, handling time, labour cost, error rate, missed SLAs and measurable revenue or risk impacts.

## Equations

```text
hours_released  = volume × (baseline_minutes - new_manual_minutes) / 60
gross_saving    = hours_released × loaded_hourly_cost
net_benefit     = gross_saving + measurable_revenue_gain - cloud_cost - model_cost - support_cost - amortised_delivery_cost
```

## Confidence Labels

Observed / Calculated / Estimated / Assumption.

## Cadence

Weekly during the pilot, monthly in production, quarterly for strategic expansion.
