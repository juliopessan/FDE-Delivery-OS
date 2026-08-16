# Observabilidade e AI FinOps

## Modelo de Trace

```text
request
├── orquestração
├── chamada(s) de modelo
├── retrieval
├── chamada(s) de ferramenta
├── validação
├── HITL
└── resposta
```

## Métricas

- **IA:** tokens, tool calls, retrieval, fallback, uso de modelo.
- **Confiabilidade:** latência, erros, timeouts, retries, disponibilidade.
- **FinOps:** custo/request, custo/sucesso, custo/cliente, consumo de budget.
- **Negócio:** tempo de ciclo, minutos manuais evitados, exceções, taxa de sucesso da automação, taxa de HITL.

## Guardrails de Custo

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
