# FDE — Metodologia A.C.E.S.

**Framework de Aceleração de Gen AI para Forward Deployed Engineers**

Metodologia replicável de 4 fases (**A**ssessment → **C**ontext → **E**ngineering → **S**cale) para mapear, arquitetar e implantar automações agênticas corporativas em ciclos curtos de alto impacto, desenhada para operação **solo** (um único FDE atuando como consultor técnico ponta a ponta) — **executada por um time de 8 agentes de IA especializados**, não apenas documentada.

O framework é **agnóstico de porte e setor**: as fases não mudam de forma, apenas de profundidade e formalidade conforme o perfil do cliente — ver [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md).

## Duas camadas neste repositório

| Camada | O que é | Onde está |
| --- | --- | --- |
| **1. Metodologia (referência)** | O "o quê" e o "porquê" — playbook, templates, checklists, docs de apoio | [`PLAYBOOK.md`](PLAYBOOK.md), [`templates/`](templates), [`checklists/`](checklists), [`docs/`](docs) |
| **2. Time de agentes (execução)** | O "quem" e o "como" — 8 agentes de IA, skills reutilizáveis, specs de tarefa e o harness operacional que roda tudo isso no Claude Code | [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`specs/`](specs), [`harness/`](harness) |

## Conteúdo do repositório

| Caminho | Conteúdo |
| --- | --- |
| [`PLAYBOOK.md`](PLAYBOOK.md) | Playbook completo da metodologia A.C.E.S. — as 4 fases (+ Fase 0), papéis, RACI, KPIs e toolkit |
| [`docs/`](docs) | Aprofundamentos: modelo de precificação, governança/segurança, stack de referência, adaptação por perfil de cliente |
| [`templates/`](templates) | Templates prontos para uso em campo (qualificação, blueprint, ROI, SOW, status report) |
| [`checklists/`](checklists) | Checklists de qualidade por fase (Go/No-Go, go-live) |
| [`.claude/agents/`](.claude/agents) | 8 agentes de IA — um orquestrador + um especialista por fase/disciplina, prontos para uso no Claude Code |
| [`.claude/skills/`](.claude/skills) | 6 skills reutilizáveis (fit score, cálculo de ROI, golden set, matriz de guardrails, blueprint, relatório de status) invocadas por múltiplos agentes |
| [`specs/`](specs) | `agent-roster.md` (visão geral do time) e `task-specs/` (protocolos de handoff, shadowing, go-live review) |
| [`harness/`](harness) | Como rodar o time de agentes na prática: convenção de pastas por engajamento, matriz de ferramentas/MCP, esqueleto reaproveitável |

## O Time de Agentes (resumo)

| Agente | Fase | Papel |
| --- | --- | --- |
| `fde-master` | Todas | Orquestrador — roteia entre especialistas e mantém o estado do engajamento |
| `fde-qualifier` | 0 | Fit score, pesquisa do prospect, proposta |
| `fde-assessor` | 1 | Shadowing, blueprint, ROI estimado |
| `fde-context-engineer` | 2 | Pipeline RAG, VectorDB, conectores, golden set |
| `fde-architect` | 3 | Topologia de agentes, roteamento de modelos |
| `fde-guardrails` | 3 | Guardrails, matriz de autonomia, LGPD, auditoria — tem veto sobre go-live |
| `fde-qa` | Transversal | Valida checklists Go/No-Go, golden set, testes de carga/red-team |
| `fde-scale-ops` | 4 | Observabilidade, ROI realizado, runbook, retainer |

Detalhes completos em [`specs/agent-roster.md`](specs/agent-roster.md).

## Como usar

1. Leia o [`PLAYBOOK.md`](PLAYBOOK.md) para entender o fluxo completo das fases.
2. Abra o Claude Code neste repositório (ou copie `.claude/agents/` e `.claude/skills/` para o repositório do seu cliente) — os 8 agentes ficam disponíveis automaticamente.
3. Peça ao `fde-master` para iniciar (ou retomar) um engajamento — ele cria a pasta em `harness/engagements/<cliente>/` a partir do esqueleto e delega ao especialista da fase correta.
4. Antes de fechar a Fase 0, consulte [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md) para calibrar duração e formalidade ao porte/setor do cliente.
5. Ao final de cada fase, `fde-qa` roda o checklist Go/No-Go correspondente antes de avançar.
6. Use `docs/stack-referencia.md` como cardápio de ferramentas — adapte à realidade de infraestrutura de cada cliente.

Cheatsheet completo de comandos e convenção de pastas: [`harness/README.md`](harness/README.md).

## Princípio central

> Mantenha a arquitetura simples na PoC para comprovar valor rápido, e adicione complexidade agêntica apenas onde o processo de negócio realmente exigir.

## Licença

MIT — use, adapte e redistribua livremente, mantendo o aviso de copyright.
