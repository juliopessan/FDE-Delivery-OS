# Contratos de Dados

## Objetos Canônicos

`EngagementState`, `Requirement`, `Constraint`, `Risk`, `Decision`, `Handoff`, `PatternManifest`, `EvaluationCase`, `EvaluationRun`, `ReleaseManifest`, `Incident`, `Approval`, `ValueMetric`.

Schemas de referência (JSON Schema) em [`schemas/`](schemas): `engagement-state.schema.json`, `pattern-manifest.schema.json`, `release-manifest.schema.json`.

## Exemplo de Requisito

```yaml
requirement_id: REQ-042
type: functional
statement: "Validar o total da fatura antes de lançar no SAP"
priority: must
source:
  type: workshop
  reference: session-03
acceptance_criteria:
  - "Divergência > R$ 1.000 é roteada para revisão humana"
```

Todo fato material derivado deve carregar proveniência: fonte, extrator, timestamp, confiança e verificação humana.
