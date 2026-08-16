# Demo — Automação de Faturas de Fornecedor

12.000 faturas/mês; tempo de atendimento na baseline de 14 minutos.

```mermaid
flowchart LR
    D[Fatura] --> X[Extração de Documento]
    X --> V[Validação Determinística]
    V --> L[Interpretação por LLM]
    L --> R{Confiança / Regra}
    R -->|Divergência| H[Revisão Humana]
    R -->|Aprovado| A[Gate de Aprovação]
    H --> A
    A --> S[Mock do SAP]
    S --> O[Observabilidade + Valor]
```

Avaliação: acurácia de campo ≥95%, zero lançamento no SAP sem aprovação, p95 <5s excluindo HITL, custo/documento abaixo do limiar, testes de prompt injection aprovados.
