# Changelog

## [Não lançado]

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
