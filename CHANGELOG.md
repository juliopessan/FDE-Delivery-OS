# Changelog

## [Não lançado]

- **Reformulado o projeto como FDE Delivery OS.** Repositório e projeto no GitHub renomeados de `FDE-Metodologia-A.C.E.S` para `FDE-Delivery-OS`. A metodologia A.C.E.S. permanece como o kernel do sistema (fases inalteradas); o nome do produto passa a refletir a ambição maior: um sistema operacional de entrega agêntica, não apenas uma metodologia documentada.
- Adicionada a **Camada 3 — Arquitetura do Sistema** (`docs/arquitetura-sistema/`): 20 documentos de arquitetura-alvo (visão de produto, arquitetura do sistema, modelo operacional de agentes ampliado, cérebro do engajamento, biblioteca de patterns, motor de avaliação, plano de controle de produção, segurança/governança, observabilidade/FinOps, operações de incidente, realização de valor, contratos de dados, fluxos ponta a ponta, dashboard de entrega, roadmap, guia de implementação, estratégia de testes, isolamento multi-cliente, contratos de API/eventos, definição de pronto), 4 ADRs fundacionais, 3 JSON Schemas de contratos de dados (`EngagementState`, `PatternManifest`, `ReleaseManifest`), templates (ADR, one-pager de engajamento, checklist de prontidão de produção) e um caso de uso de referência (`exemplos/automacao-faturas-fornecedor/`). Esta camada é **aspiracional** — descreve para onde o sistema pode evoluir se a operação solo migrar de metodologia + agentes para software com estado persistido; nada nela está implementado, e a camada de execução atual (`.claude/agents/`, `.claude/skills/`, `harness/`) não foi alterada.

- Adicionado o fallback de **benchmarking de mercado** ao cálculo de ROI (`.claude/skills/roi-calculator/SKILL.md`, `templates/calculo-roi.md`, `fde-assessor`): quando o shadowing real ainda não aconteceu, o ROI pode ser pré-preenchido com benchmarks públicos citados (por função/processo, nunca por empresa específica), sempre rotulado como cenário ilustrativo em faixas (conservador/médio/otimista) e substituído pelos números reais assim que o shadowing ocorrer.

- Adicionado `docs/relatorio-enterprise.html`: relatório enterprise consolidado em HTML puro (sem Markdown), com tabelas formatadas nativamente — framework (5 fases), time de agentes, RACI, KPIs, estimativa de esforço/capacidade, governança, precificação e adaptação por perfil de cliente, com suporte a tema claro/escuro e impressão em PDF.

- Adicionado o agente `fde-capacity-planner` (`.claude/agents/fde-capacity-planner.md`): estimativa de esforço por fase (WBS + estimativa de três pontos/PERT), quantos profissionais/devs são necessários, quantas horas por semana, e decisão solo vs. reforço. Chamado antes de fechar prazo/preço de qualquer fase e a cada mudança de escopo.
- Adicionada a skill `effort-estimation` (`.claude/skills/effort-estimation/SKILL.md`) com a metodologia WBS+PERT e âncoras de duração por fase.
- Adicionados os templates `templates/estimativa-esforco.md` e `templates/plano-capacidade.md`.
- Atualizado o roteamento do `fde-master`, o roster (`specs/agent-roster.md`), o harness (`harness/README.md` e `engagement-template/`) e o modelo de precificação (`docs/modelo-precificacao.md`) para refletir que todo fixed-fee deriva de estimativa, não de achismo.

- Refinada a governança de segurança após benchmark com documentação pública de agentes de IA operando plataformas enterprise: princípio de permissão herdada (agente nunca tem acesso maior que o FDE, sem conta de serviço separada), matriz de autonomia sensível a ambiente (sandbox vs. produção), e item de capacidade de infraestrutura no checklist de go-live (`docs/governanca-seguranca.md`, `.claude/agents/fde-guardrails.md`, `checklists/go-live-fase3.md`).

- Adicionado o **time de agentes de execução** (`.claude/agents/`): 8 agentes — `fde-master` (orquestrador), `fde-qualifier`, `fde-assessor`, `fde-context-engineer`, `fde-architect`, `fde-guardrails`, `fde-qa`, `fde-scale-ops` — cada um mapeado a uma fase/disciplina da metodologia A.C.E.S.
- Adicionadas 6 skills reutilizáveis (`.claude/skills/`): fit-score, roi-calculator, golden-set-builder, guardrail-matrix, blueprint-writer, status-report.
- Adicionadas specs (`specs/`): `agent-roster.md` (visão geral do time) e `task-specs/` (protocolos de handoff entre fases, shadowing operacional, go-live review).
- Adicionado o harness operacional (`harness/`): convenção de pastas por engajamento (`engagement-template/`), matriz de ferramentas/MCP por agente, cheatsheet de comandos.

- Adicionado `docs/adaptacao-por-perfil-cliente.md`: guia de calibragem do framework por porte (PME/média/enterprise) e setor (saúde, financeiro, jurídico, varejo, indústria, setor público), tornando explícito que a metodologia é agnóstica de tipo de empresa.

## [0.1.0] - 2026-07-21

- Estrutura inicial do repositório com a metodologia A.C.E.S.
- Adicionada Fase 0 (Qualificação) ao framework original de 4 fases.
- Adicionados RACI, KPIs de sucesso e antipadrões ao playbook.
- Adicionados templates de campo: fit score, blueprint, cálculo de ROI, SOW, relatório de status semanal.
- Adicionados checklists Go/No-Go por fase (1, 2) e Go-Live de produção (3).
- Adicionados docs de apoio: modelo de precificação, governança/segurança (LGPD), stack de referência.
