# Cérebro do Engajamento

Memória operacional persistente para cada engajamento de cliente.

## Modelo de Entidades

```text
Engagement
├── Objetivos
├── Stakeholders
├── Casos de Uso
├── Requisitos
├── Restrições
├── Sistemas
├── Fontes de Dados
├── Decisões / ADRs
├── Riscos
├── Arquitetura
├── Patterns Usados
├── Execuções de Avaliação
├── Releases
├── Incidentes
└── Métricas de Valor
```

## Máquina de Estados

```mermaid
stateDiagram-v2
    [*] --> Qualificacao
    Qualificacao --> Assessment: GO
    Qualificacao --> Encerrado: NO-GO
    Assessment --> Context
    Context --> Engineering
    Engineering --> ReleaseCandidate
    ReleaseCandidate --> Engineering: Gate Fail
    ReleaseCandidate --> Producao: Aprovação Humana
    Producao --> Scale
    Scale --> Engineering
    Scale --> Assessment
```

## Camadas de Memória

1. **Estado Estruturado** — fonte de verdade.
2. **Artefatos Versionados** — evidência aprovada.
3. **Memória de Retrieval** — contexto de cliente pesquisável.
4. **Contexto de Trabalho** — contexto de prompt efêmero.
