# Observability and AI FinOps

## Trace Model

```text
request
├── orchestration
├── model call(s)
├── retrieval
├── tool call(s)
├── validation
├── HITL
└── response
```

## Metrics

- **AI:** tokens, tool calls, retrieval, fallback, model usage.
- **Reliability:** latency, errors, timeouts, retries, availability.
- **FinOps:** cost per request, cost per success, cost per client, budget consumption.
- **Business:** cycle time, manual minutes avoided, exceptions, automation success rate, HITL rate.

## Cost Guardrails

```yaml
budgets:
  engagement_monthly_usd: 5000
  request_soft_limit_usd: 0.10
  request_hard_limit_usd: 0.50
actions:
  at_70_percent: notify
  at_90_percent: downgrade_noncritical_models
  at_100_percent: require_override
```
