# Spec — Roster do Time de Agentes FDE

Visão geral de todos os agentes que operam a metodologia A.C.E.S. Definições executáveis em [`.claude/agents/`](../.claude/agents).

| Agente | Fase | Missão | Ferramentas | Entra em cena quando | Handoff para |
| --- | --- | --- | --- | --- | --- |
| [`fde-master`](../.claude/agents/fde-master.md) | Todas | Orquestra, roteia, mantém estado do engajamento | Read, Write, Edit, Bash, Grep, Glob, Agent | Início/retomada de qualquer sessão | Todos os especialistas |
| [`fde-qualifier`](../.claude/agents/fde-qualifier.md) | 0 | Fit score, pesquisa do prospect, one-pager de proposta | Read, Write, Edit, WebSearch, WebFetch | Novo prospect, sem contrato | `fde-assessor` (se GO) |
| [`fde-assessor`](../.claude/agents/fde-assessor.md) | 1 | Shadowing, matriz de qualificação, ICE, blueprint, ROI estimado | Read, Write, Edit, Bash, WebSearch | Go da Fase 0 | `fde-context-engineer` (se GO) |
| [`fde-context-engineer`](../.claude/agents/fde-context-engineer.md) | 2 | Pipeline RAG, VectorDB, conectores, golden set | Read, Write, Edit, Bash, Grep, Glob | Go da Fase 1 | `fde-architect` (se GO) |
| [`fde-architect`](../.claude/agents/fde-architect.md) | 3 (arquitetura) | Topologia de agentes, roteamento de modelos | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Go da Fase 2 | `fde-qa` |
| [`fde-guardrails`](../.claude/agents/fde-guardrails.md) | 3 (segurança) | Guardrails I/O, matriz de autonomia, LGPD, auditoria | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Em paralelo a `fde-architect` | `fde-qa` |
| [`fde-qa`](../.claude/agents/fde-qa.md) | Transversal | Valida checklists Go/No-Go, golden set, testes de carga/red-team | Read, Write, Edit, Bash, Grep, Glob | Fim de cada fase | `fde-master` (com veredito) |
| [`fde-scale-ops`](../.claude/agents/fde-scale-ops.md) | 4 | Observabilidade, ROI realizado, runbook, retainer | Read, Write, Edit, Bash, WebSearch | Sistema em produção | `fde-master` (novo caso de uso → volta à Fase 0) |

## Princípios de Design do Roster

1. **Um agente, uma fase, uma responsabilidade primária.** Evita "agente faz-tudo" — mesmo princípio que os agentes aplicam à arquitetura dos clientes (ver `PLAYBOOK.md`, Fase 3).
2. **`fde-qa` nunca é dono de solução.** É o único agente com poder de bloquear avanço de fase sem propor a correção ele mesmo — a correção volta ao especialista responsável.
3. **`fde-guardrails` tem veto sobre go-live.** Nenhum outro agente pode aprovar a virada para produção sem o sinal verde explícito dele.
4. **Todo handoff é por arquivo**, em `harness/engagements/<cliente>/<fase>/`, nunca apenas por contexto de conversa — garante retomada em outra sessão sem perda de estado.
5. **Skills (`.claude/skills/`) são compartilhadas entre agentes** — procedimentos reutilizáveis (fit score, ROI, golden set, matriz de autonomia, blueprint, status report) que mais de um agente invoca, evitando duplicação de lógica entre as personas.

## Modelo de Invocação

Em uma sessão do Claude Code dentro deste repositório (ou de um repositório de cliente que referencie este framework), os agentes ficam disponíveis automaticamente via `.claude/agents/`. O fluxo recomendado:

```
Usuário → fde-master → decide fase/agente → delega via Agent tool → agente especialista executa → grava artefatos → fde-master atualiza state.md
```

Ver [`harness/README.md`](../harness/README.md) para a convenção de pastas por engajamento e o cheatsheet de comandos.
