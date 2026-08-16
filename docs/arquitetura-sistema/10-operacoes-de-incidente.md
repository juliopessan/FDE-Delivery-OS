# Operações de Incidente

## Categorias

Regressão de modelo, indisponibilidade de provedor, falha de ferramenta/API, problema de retrieval, evento de segurança, anomalia de custo, degradação de performance, ação de negócio incorreta.

## Fluxo

```mermaid
flowchart TD
    A[Alerta] --> T[Triagem]
    T --> C[Correlacionar Traces + Diff de Release]
    C --> H[Ranquear Hipóteses]
    H --> S[Selecionar Ação Segura]
    S --> D{Impacto}
    D -->|Baixo| F[Correção Reversível]
    D -->|Alto| AP[Aprovação Humana]
    AP --> F
    F --> V[Verificar]
    V --> P[Postmortem]
    P --> L[Atualizar Pattern/Eval/Runbook]
```

Agentes podem coletar evidência, ranquear causas e preparar comandos de rollback. O rollback em produção permanece controlado por política.
