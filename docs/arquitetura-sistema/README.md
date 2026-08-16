# Camada 3 — Arquitetura do Sistema (visão)

Esta pasta é a **camada de visão** do FDE Delivery OS: o "para onde" o projeto evolui se a operação de FDE solo crescer de um único operador com um time de agentes Claude Code para uma plataforma de entrega agêntica com estado persistido, avaliação contínua e controle de produção.

Nada aqui está implementado como software hoje. É especificação e arquitetura-alvo — o "o quê" e o "porquê" de uma eventual Fase 2 de engenharia deste projeto, mantida junto da metodologia para que toda decisão futura de implementação já nasça referenciada a um princípio, um contrato de dados e um ADR.

## Como isso se relaciona com as outras duas camadas do repositório

| Camada | O que é | Estado |
| --- | --- | --- |
| 1. Metodologia (referência) | O "o quê" e o "porquê" do processo de entrega — [`PLAYBOOK.md`](../../PLAYBOOK.md), [`templates/`](../../templates), [`checklists/`](../../checklists) | Em uso |
| 2. Time de agentes (execução) | 9 agentes Claude Code que executam a metodologia hoje — [`.claude/agents/`](../../.claude/agents), [`.claude/skills/`](../../.claude/skills), [`harness/`](../../harness) | Em uso |
| **3. Arquitetura do sistema (visão)** | Especificação de um futuro Delivery OS que persiste estado, avalia e controla produção | Aspiracional — não implementado |

A camada 3 não substitui nem altera as camadas 1 e 2. Ela documenta o destino possível caso a alavancagem de agentes e templates deixe de ser suficiente e a operação precise de estado persistido fora do chat, avaliação automatizada e um control plane de produção formal.

## Índice

| # | Documento | Tema |
| --- | --- | --- |
| 01 | [`01-visao-de-produto.md`](01-visao-de-produto.md) | Tese, usuário primário, jobs-to-be-done, princípios de design, métrica norte |
| 02 | [`02-arquitetura-do-sistema.md`](02-arquitetura-do-sistema.md) | Camadas do sistema, plano compartilhado vs. plano do cliente |
| 03 | [`03-modelo-operacional-de-agentes.md`](03-modelo-operacional-de-agentes.md) | Um agente = uma responsabilidade, contrato de handoff, regras |
| 04 | [`04-cerebro-do-engajamento.md`](04-cerebro-do-engajamento.md) | Modelo de entidades, máquina de estados, camadas de memória |
| 05 | [`05-biblioteca-de-padroes.md`](05-biblioteca-de-padroes.md) | Estrutura de pattern, catálogo inicial, fluxo de promoção |
| 06 | [`06-motor-de-avaliacao.md`](06-motor-de-avaliacao.md) | Dimensões de avaliação, golden set, gatilhos de regressão |
| 07 | [`07-plano-de-controle-de-producao.md`](07-plano-de-controle-de-producao.md) | Domínios de prontidão, modelo de gate, ciclo de vida do release |
| 08 | [`08-seguranca-e-governanca.md`](08-seguranca-e-governanca.md) | Modelo de confiança, classes de ação, política de ferramentas, token de aprovação |
| 09 | [`09-observabilidade-e-finops.md`](09-observabilidade-e-finops.md) | Modelo de trace, métricas, guardrails de custo |
| 10 | [`10-operacoes-de-incidente.md`](10-operacoes-de-incidente.md) | Categorias, fluxo de resposta a incidente |
| 11 | [`11-realizacao-de-valor.md`](11-realizacao-de-valor.md) | Baseline, equações de ROI, rótulos de confiança, cadência |
| 12 | [`12-contratos-de-dados.md`](12-contratos-de-dados.md) | Objetos canônicos, exemplo de requisito, proveniência |
| 13 | [`13-fluxos-ponta-a-ponta.md`](13-fluxos-ponta-a-ponta.md) | Novo engajamento, discovery→protótipo, protótipo→produção, incidente, engenharia composta |
| 14 | [`14-dashboard-de-entrega.md`](14-dashboard-de-entrega.md) | Métricas executivas, card de engajamento, visões |
| 15 | [`15-roadmap.md`](15-roadmap.md) | Fases 0-5 de implementação, checklist de criação do projeto |
| 16 | [`16-guia-de-implementacao.md`](16-guia-de-implementacao.md) | Ordem de construção, módulos sugeridos, CLI de MVP |
| 17 | [`17-estrategia-de-testes.md`](17-estrategia-de-testes.md) | Camadas de teste, invariantes críticos |
| 18 | [`18-isolamento-multi-cliente.md`](18-isolamento-multi-cliente.md) | Namespace por engajamento, promoção segura para patterns |
| 19 | [`19-contratos-de-api-e-eventos.md`](19-contratos-de-api-e-eventos.md) | Comandos e eventos do sistema |
| 20 | [`20-definicao-de-pronto.md`](20-definicao-de-pronto.md) | DoD de agente, de pattern e de release |

## Outros artefatos desta camada

- [`adrs/`](adrs) — Architecture Decision Records fundacionais (estado fora do chat, responsabilidade humana, patterns versionados, política antes de ferramentas)
- [`schemas/`](schemas) — JSON Schemas dos contratos de dados centrais (`EngagementState`, `PatternManifest`, `ReleaseManifest`)
- [`templates/`](templates) — Template de ADR, one-pager de engajamento e checklist de prontidão de produção, no formato-alvo do sistema
- [`exemplos/automacao-faturas-fornecedor/`](exemplos/automacao-faturas-fornecedor) — Caso de uso de referência ponta a ponta (discovery → protótipo → avaliação → produção)

## Princípio central desta camada

> Automatizar o trabalho repetitivo de entrega, não o julgamento de engenharia.
