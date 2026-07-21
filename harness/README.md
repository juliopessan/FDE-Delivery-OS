# Harness Operacional do Time de Agentes FDE

Este diretório é a camada de **execução** da metodologia A.C.E.S. — como o FDE solo efetivamente roda o time de agentes no dia a dia, dentro do Claude Code.

Para a metodologia em si, ver [`../PLAYBOOK.md`](../PLAYBOOK.md). Para os agentes, ver [`../.claude/agents/`](../.claude/agents) e [`../specs/agent-roster.md`](../specs/agent-roster.md).

## Como os agentes ficam disponíveis

Os arquivos em `.claude/agents/*.md` e `.claude/skills/*/SKILL.md` seguem o formato nativo de subagentes e skills do Claude Code. Duas formas de uso:

1. **Direto neste repositório:** abra o Claude Code na raiz deste repo — os agentes ficam disponíveis automaticamente.
2. **Em um repositório de cliente:** copie a pasta `.claude/agents/` e `.claude/skills/` para o repositório do projeto do cliente (ou referencie este repo como submódulo/pacote interno), mantendo os caminhos relativos para `PLAYBOOK.md`, `templates/`, `checklists/` e `docs/` deste repositório de metodologia.

## Convenção de Pastas por Engajamento

Cada cliente ativo tem sua própria pasta em `harness/engagements/<slug-do-cliente>/`, criada a partir do esqueleto em [`engagement-template/`](engagement-template). **Esta pasta não vai para o controle de versão do framework** (ver `.gitignore`) — cada engajamento é confidencial e deve viver em um repositório próprio ou área privada do FDE.

```
harness/engagements/<cliente>/
├── state.md                  # fase atual, decisões de Go/No-Go, próximos passos
├── 00-qualificacao/
│   ├── fit-score.md
│   ├── one-pager-proposta.md
│   ├── estimativa-esforco.md     # fde-capacity-planner (WBS+PERT da Fase 1, antes de fechar a proposta)
│   └── plano-capacidade.md       # fde-capacity-planner
├── 01-assessment/
│   ├── blueprint.md
│   ├── calculo-roi.md
│   ├── estimativa-esforco.md     # fde-capacity-planner (WBS+PERT da Fase 2, ao fechar o Go)
│   ├── plano-capacidade.md       # fde-capacity-planner
│   └── handoff.md
├── 02-context/
│   ├── pipeline-design.md
│   ├── golden-set.md
│   ├── conectores.md
│   ├── estimativa-esforco.md     # fde-capacity-planner (WBS+PERT da Fase 3)
│   ├── plano-capacidade.md       # fde-capacity-planner
│   └── handoff.md
├── 03-engineering/
│   ├── arquitetura.md            # fde-architect
│   ├── matriz-autonomia.md       # fde-guardrails
│   ├── guardrails.md             # fde-guardrails
│   ├── revisao-lgpd.md           # fde-guardrails
│   ├── qa-report.md              # fde-qa
│   └── handoff.md
└── 04-scale/
    ├── relatorios-semanais/
    ├── relatorios-mensais-roi/
    ├── estimativa-esforco.md     # fde-capacity-planner — reexecutada a cada mudança de escopo/retainer
    ├── plano-capacidade.md       # fde-capacity-planner
    └── runbook-incidentes.md
```

`estimativa-esforco.md` e `plano-capacidade.md` (templates em `templates/`) são reexecutados **sempre que o escopo mudar**, não apenas uma vez por fase — a versão mais recente é a que vale para a proposta/preço vigente.

## Cheatsheet de Comandos

| Situação | O que fazer |
| --- | --- |
| Começar um cliente novo | Peça ao `fde-master` para iniciar um engajamento; ele copia `engagement-template/` para `engagements/<cliente>/` |
| Retomar um cliente em sessão nova | Peça ao `fde-master` para retomar `<cliente>`; ele lê `state.md` e delega ao agente da fase atual |
| Pular direto a um especialista | Chame o agente diretamente (ex.: `fde-context-engineer`) quando já souber exatamente o que precisa — útil para retrabalho pontual dentro de uma fase já iniciada |
| Validar antes de avançar fase | Peça ao `fde-qa` para rodar o checklist Go/No-Go da fase corrente |
| Fechar o mês de um retainer ativo | Peça ao `fde-scale-ops` para gerar o relatório mensal de ROI |
| Fechar prazo/preço de uma fase (nova ou repactuação) | Peça ao `fde-capacity-planner` para rodar a estimativa (WBS+PERT) e o plano de capacidade **antes** de comprometer prazo/preço |
| Escopo mudou no meio de uma fase | Peça ao `fde-capacity-planner` para reexecutar a estimativa — nunca reaproveite a antiga |

## Matriz de Ferramentas / MCP por Agente

| Agente | Ferramentas nativas | MCP externo útil (opcional) |
| --- | --- | --- |
| `fde-master` | Read, Write, Edit, Bash, Grep, Glob, Agent | — |
| `fde-qualifier` | Read, Write, Edit, WebSearch, WebFetch | CRM do FDE (se houver), LinkedIn/dados públicos da empresa |
| `fde-capacity-planner` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Planilha/ferramenta de gestão de projeto (se o FDE já usar uma), benchmark de taxas de mercado |
| `fde-assessor` | Read, Write, Edit, Bash, WebSearch | Gravador de reunião/transcrição (para consolidar shadowing), planilha de dados do cliente |
| `fde-context-engineer` | Read, Write, Edit, Bash, Grep, Glob | Conector do VectorDB escolhido, MCP dos sistemas legados do cliente (CRM/ERP) |
| `fde-architect` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Documentação do provedor de LLM/orquestração escolhido |
| `fde-guardrails` | Read, Write, Edit, Bash, Grep, Glob, WebSearch | Ferramenta de guardrails estruturados (ex.: validação de schema), referência de LGPD |
| `fde-qa` | Read, Write, Edit, Bash, Grep, Glob | Ferramenta de teste de carga, se necessário além do básico |
| `fde-scale-ops` | Read, Write, Edit, Bash, WebSearch | Plataforma de observabilidade/tracing (Langfuse ou equivalente), dashboard de custo de tokens |

Nenhum MCP externo é obrigatório para o framework funcionar — os agentes operam com as ferramentas nativas do Claude Code. MCPs listados são aceleradores por fase, a incluir conforme a stack real do cliente (ver `docs/stack-referencia.md`).

## Regras do Harness

1. **Estado em arquivo, não em memória de conversa.** Qualquer sessão nova deve conseguir retomar um engajamento lendo `state.md` — nunca dependa de contexto de uma conversa anterior.
2. **Um `state.md` por cliente.** Nunca misture o estado de dois engajamentos no mesmo arquivo.
3. **Confidencialidade por padrão.** Dados reais de cliente nunca são commitados neste repositório de metodologia — vivem em `harness/engagements/` (gitignored) ou em repositório próprio do engajamento.
