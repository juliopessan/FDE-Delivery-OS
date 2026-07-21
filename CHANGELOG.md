# Changelog

## [Não lançado]

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
