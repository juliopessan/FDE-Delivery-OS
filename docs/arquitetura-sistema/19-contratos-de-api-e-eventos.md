# Contratos de API e Eventos

## Comandos

```text
POST /engagements
POST /engagements/{id}/artifacts
POST /engagements/{id}/decisions
POST /engagements/{id}/risks
POST /engagements/{id}/eval-runs
POST /engagements/{id}/release-candidates
POST /engagements/{id}/approvals
POST /engagements/{id}/incidents
```

## Eventos

`engagement.created`, `assessment.completed`, `decision.recorded`, `risk.opened`, `evaluation.completed`, `gate.failed`, `gate.passed`, `approval.requested`, `approval.granted`, `release.deployed`, `incident.opened`, `incident.resolved`, `pattern.promoted`, `value.metric_recorded`.
