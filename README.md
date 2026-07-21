# FDE — Metodologia A.C.E.S.

**Framework de Aceleração de Gen AI para Forward Deployed Engineers**

Metodologia replicável de 4 fases (**A**ssessment → **C**ontext → **E**ngineering → **S**cale) para mapear, arquitetar e implantar automações agênticas corporativas em ciclos curtos de alto impacto, desenhada para operação **solo** (um único FDE atuando como consultor técnico ponta a ponta).

O framework é **agnóstico de porte e setor**: as fases não mudam de forma, apenas de profundidade e formalidade conforme o perfil do cliente — ver [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md).

## Conteúdo do repositório

| Caminho | Conteúdo |
| --- | --- |
| [`PLAYBOOK.md`](PLAYBOOK.md) | Playbook completo da metodologia A.C.E.S. — as 4 fases, papéis, KPIs e toolkit |
| [`docs/`](docs) | Aprofundamentos: modelo de precificação, governança/segurança, stack de referência, adaptação por perfil de cliente |
| [`templates/`](templates) | Templates prontos para uso em campo (discovery, blueprint, ROI, SOW, status report) |
| [`checklists/`](checklists) | Checklists de qualidade por fase (Go/No-Go, guardrails, handoff) |

## Como usar

1. Leia o [`PLAYBOOK.md`](PLAYBOOK.md) para entender o fluxo completo das 4 fases.
2. Antes de fechar a Fase 0, consulte [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md) para calibrar a duração e formalidade de cada fase ao porte/setor do cliente.
3. Ao iniciar um engajamento novo, copie os templates de `templates/` para a pasta do projeto do cliente.
4. Ao final de cada fase, rode o checklist correspondente em `checklists/` antes de avançar (Go/No-Go).
5. Use `docs/stack-referencia.md` como cardápio de ferramentas — adapte à realidade de infraestrutura de cada cliente.

## Princípio central

> Mantenha a arquitetura simples na PoC para comprovar valor rápido, e adicione complexidade agêntica apenas onde o processo de negócio realmente exigir.

## Licença

MIT — use, adapte e redistribua livremente, mantendo o aviso de copyright.
