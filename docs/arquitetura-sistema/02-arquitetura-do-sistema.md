# Arquitetura do Sistema

```mermaid
flowchart TD
    U[FDE] --> EB[Cérebro do Engajamento]
    C[Inputs do Cliente] --> DI[Discovery/Ingestão]
    DI --> EB
    EB --> O[Orquestrador de Entrega]
    O --> A[Assessment]
    O --> X[Context Engineering]
    O --> R[Arquitetura]
    O --> B[Builder]
    O --> E[Avaliação]
    O --> G[Governança]
    O --> RM[Gestor de Release]
    O --> I[Operações de Incidente]
    O --> V[Realização de Valor]
    P[Biblioteca de Patterns] --> R
    P --> B
    P --> E
    P --> G
    E --> Gate{Gate de Release}
    G --> Gate
    RM --> Gate
    Gate -->|PASS + Aprovação Humana| Prod[Produção]
    Gate -->|FAIL| O
    Prod --> Obs[Observabilidade]
    Obs --> I
    Obs --> V
    I --> EB
    V --> EB
```

## Camadas

- **Experiência:** CLI, integração com IDE, console web opcional.
- **Orquestração:** roteamento de workflow ciente de estado e seleção de próxima melhor ação.
- **Agentes:** agentes especialistas com fronteiras de responsabilidade explícitas.
- **Conhecimento:** estado estruturado, ADRs, riscos, requisitos e artefatos.
- **Avaliação e Governança:** golden sets, regressões, segurança, latência, custo e gates de aprovação humana.
- **Execução:** scaffolding de código, testes, infraestrutura e adaptadores de deploy.
- **Observabilidade:** traces, logs, métricas de token/custo, incidentes e métricas de negócio.

## Plano Compartilhado vs. Plano do Cliente

O **Plano de Metodologia Compartilhado** contém agentes reutilizáveis, schemas, patterns, templates, checklists e evals genéricos. O **Plano de Engajamento do Cliente** contém dados, código, arquitetura, decisões e incidentes específicos daquele cliente.

## Restrição

Agentes não são donos da verdade. Estado estruturado persistido e artefatos versionados são a fonte de verdade.
