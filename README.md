# FDE OS

**Sistema Operacional de Entrega Agêntica para Forward Deployed Engineers**

![FDE OS — um engajamento entra, um Enterprise Report sai](platform/docs/screenshot-landing-page.png)

FDE OS é a evolução do framework antes chamado de A.C.E.S.: uma metodologia replicável de 4 fases (Assessment → Context → Engineering → Scale) para mapear, arquitetar e implantar automações agênticas corporativas em ciclos curtos de alto impacto, desenhada para operação **solo** (um único FDE atuando como consultor técnico ponta a ponta) — **executada por um time de 9 agentes de IA especializados**, não apenas documentada. O repositório contém tanto a metodologia + agentes de execução no Claude Code quanto uma **plataforma web real** ([`platform/`](platform)) que roda esses mesmos 9 agentes contra o brief de um engajamento e devolve um Enterprise Report consolidado — ver screenshot e detalhes em [`platform/README.md`](platform/README.md).

O framework é **agnóstico de porte e setor**: as fases não mudam de forma, apenas de profundidade e formalidade conforme o perfil do cliente — ver [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md).

## Princípio central

> Automatizar o trabalho repetitivo de entrega, não o julgamento de engenharia. Mantenha a arquitetura simples na PoC para comprovar valor rápido, e adicione complexidade agêntica apenas onde o processo de negócio realmente exigir.

## Quatro camadas neste repositório

| Camada | O que é | Estado | Onde está |
| --- | --- | --- | --- |
| **1. Metodologia (referência)** | O "o quê" e o "porquê" — playbook, templates, checklists, docs de apoio | Em uso | [`PLAYBOOK.md`](PLAYBOOK.md), [`templates/`](templates), [`checklists/`](checklists), [`docs/`](docs) |
| **2. Time de agentes (execução no Claude Code)** | O "quem" e o "como" — 9 agentes de IA, skills reutilizáveis, specs de tarefa e o harness operacional que roda tudo isso no Claude Code | Em uso | [`.claude/agents/`](.claude/agents), [`.claude/skills/`](.claude/skills), [`specs/`](specs), [`harness/`](harness) |
| **3. Arquitetura do sistema (visão)** | O "para onde" — especificação de um Delivery OS com estado persistido, biblioteca de patterns, motor de avaliação e control plane de produção | Aspiracional — parcialmente implementado (ver camada 4) | [`docs/arquitetura-sistema/`](docs/arquitetura-sistema) |
| **4. Plataforma (implementação real)** | Os mesmos 9 agentes rodando como um app Next.js real: formulário de engajamento com extração automática de brief (paste/upload .txt/.md/.pdf/.docx), pipeline sequencial via Gemini 3.7 Flash com fallback para Claude Haiku 4.5, estado em SQLite (Turso/libSQL), e um Enterprise Report consolidado em HTML | Em uso (dev local; deploy em preparação) | [`platform/`](platform) — ver [`platform/README.md`](platform/README.md) |

A camada 3 continua sendo, em boa parte, documentação de arquitetura-alvo — ver o aviso em [`docs/arquitetura-sistema/README.md`](docs/arquitetura-sistema/README.md). A camada 4 é onde essa visão vira código de verdade, começando pelo recorte "solo FDE" (sem multi-tenant, sem RBAC ainda).

## Fluxo-alvo do sistema

```
Ambiguidade do Cliente → Discovery → Pontuação de Oportunidade → Arquitetura → Protótipo → Avaliação → Governança → Prontidão de Produção → Deploy → Observabilidade → Valor de Negócio
```

## Metas de produto (não métricas já alcançadas)

| Resultado | Meta |
|---|---:|
| Discovery → protótipo | < 2 dias úteis |
| Bootstrap de arquitetura | < 2 horas |
| Bootstrap de avaliação | < 4 horas |
| Esforço de entrega repetitivo | -50% |
| Ativos reutilizáveis por engajamento | ≥ 3 |
| Capacidade de engajamentos paralelos por FDE | 2× |
| Time-to-value do cliente | -40–60% |

## Conteúdo do repositório

| Caminho | Conteúdo |
| --- | --- |
| [`PLAYBOOK.md`](PLAYBOOK.md) | Playbook completo da metodologia A.C.E.S. — as 4 fases (+ Fase 0), papéis, RACI, KPIs e toolkit |
| [`docs/`](docs) | Aprofundamentos operacionais: modelo de precificação, governança/segurança, stack de referência, adaptação por perfil de cliente |
| [`docs/arquitetura-sistema/`](docs/arquitetura-sistema) | Visão de arquitetura do FDE OS: 20 docs de sistema, 4 ADRs, JSON Schemas dos contratos de dados, templates e um caso de uso de referência |
| [`platform/`](platform) | App Next.js real: os 9 agentes rodando via Gemini/Haiku, SQLite, formulário de intake com extração automática, Enterprise Report renderizado |
| [`templates/`](templates) | Templates prontos para uso em campo (qualificação, blueprint, ROI, SOW, status report) |
| [`checklists/`](checklists) | Checklists de qualidade por fase (Go/No-Go, go-live) |
| [`.claude/agents/`](.claude/agents) | 9 agentes de IA — um orquestrador + um especialista por fase/disciplina, prontos para uso no Claude Code |
| [`.claude/skills/`](.claude/skills) | 7 skills reutilizáveis (fit score, cálculo de ROI, golden set, matriz de guardrails, blueprint, relatório de status, estimativa de esforço) invocadas por múltiplos agentes |
| [`specs/`](specs) | `agent-roster.md` (visão geral do time) e `task-specs/` (protocolos de handoff, shadowing, go-live review) |
| [`harness/`](harness) | Como rodar o time de agentes na prática: convenção de pastas por engajamento, matriz de ferramentas/MCP, esqueleto reaproveitável |
| [`docs/relatorio-enterprise.html`](docs/relatorio-enterprise.html) | Relatório enterprise em HTML — framework, agentes, RACI, KPIs, capacidade, governança e precificação consolidados, pronto para abrir no navegador ou exportar para PDF |

## O Time de Agentes (resumo)

| Agente | Fase | Papel |
| --- | --- | --- |
| `fde-master` | Todas | Orquestrador — roteia entre especialistas e mantém o estado do engajamento |
| `fde-qualifier` | 0 | Fit score, pesquisa do prospect, proposta |
| `fde-capacity-planner` | Transversal | Estimativa de esforço (WBS+PERT), quantos devs/horas por fase, solo vs. reforço |
| `fde-assessor` | 1 | Shadowing, blueprint, ROI estimado |
| `fde-context-engineer` | 2 | Pipeline RAG, VectorDB, conectores, golden set |
| `fde-architect` | 3 | Topologia de agentes, roteamento de modelos |
| `fde-guardrails` | 3 | Guardrails, matriz de autonomia, LGPD, auditoria — tem veto sobre go-live |
| `fde-qa` | Transversal | Valida checklists Go/No-Go, golden set, testes de carga/red-team |
| `fde-scale-ops` | 4 | Observabilidade, ROI realizado, runbook, retainer |

Detalhes completos em [`specs/agent-roster.md`](specs/agent-roster.md). A topologia-alvo mais ampla (16 papéis) para quando o sistema crescer além da operação solo está em [`docs/arquitetura-sistema/03-modelo-operacional-de-agentes.md`](docs/arquitetura-sistema/03-modelo-operacional-de-agentes.md).

## Como usar

1. Leia o [`PLAYBOOK.md`](PLAYBOOK.md) para entender o fluxo completo das fases.
2. Abra o Claude Code neste repositório (ou copie `.claude/agents/` e `.claude/skills/` para o repositório do seu cliente) — os 9 agentes ficam disponíveis automaticamente.
3. Peça ao `fde-master` para iniciar (ou retomar) um engajamento — ele cria a pasta em `harness/engagements/<cliente>/` a partir do esqueleto e delega ao especialista da fase correta.
4. Antes de fechar a Fase 0, consulte [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md) para calibrar duração e formalidade ao porte/setor do cliente.
5. Ao final de cada fase, `fde-qa` roda o checklist Go/No-Go correspondente antes de avançar.
6. Use `docs/stack-referencia.md` como cardápio de ferramentas — adapte à realidade de infraestrutura de cada cliente.
7. Para entender para onde o sistema evolui — e os contratos de dados, ADRs e roadmap que já estão especificados — comece por [`docs/arquitetura-sistema/README.md`](docs/arquitetura-sistema/README.md).

Cheatsheet completo de comandos e convenção de pastas: [`harness/README.md`](harness/README.md).

## Licença

MIT — use, adapte e redistribua livremente, mantendo o aviso de copyright.
