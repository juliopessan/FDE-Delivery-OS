# Roadmap de Produto (visão)

Este roadmap descreve as fases de construção **se e quando** este projeto migrar de metodologia + agentes para um software de Delivery OS de fato. Nenhuma fase abaixo foi iniciada.

## Fase 0 — Fundação

Schemas tipados, persistência, máquina de estados, processo de ADR.

## Fase 1 — MVP do Delivery OS

Cérebro do Engajamento, discovery, pontuação de oportunidade, Biblioteca de Patterns, runner de golden-set, checklist de prontidão.

## Fase 2 — Acelerador de Engenharia

Solution Composer, Builder, benchmark de modelo, scaffolds de código/infra, integração com GitHub.

## Fase 3 — Plano de Controle de Produção

Motor de política, HITL, manifestos de release, observabilidade, controles de budget, agente de incidente.

## Fase 4 — Entrega Composta

Promoção de patterns, checagens de sanitização, modelo de maturidade, analytics de reuso.

## Fase 5 — Plataforma Multi-FDE

RBAC, workspaces por time, isolamento de tenant, registro compartilhado e dashboards organizacionais.

---

## Checklist de Criação do Projeto (Fase 0, quando iniciar)

Ordem sugerida de bootstrap de um repositório de software separado (ex.: `fde-delivery-os-engine`), a partir do zero, quando a Fase 0 acima for de fato iniciada.

### Fundação
- [ ] Criar repositório
- [ ] Esqueleto de projeto Python
- [ ] Lint/type checking
- [ ] CI
- [ ] Secret scanning
- [ ] ADRs

### Domínio
- [ ] `EngagementState`
- [ ] `Risk`
- [ ] `Decision`
- [ ] `Handoff`
- [ ] `EvaluationRun`
- [ ] `ReleaseManifest`
- [ ] `Approval`

### Persistência
- [ ] Adaptador PostgreSQL
- [ ] Armazenamento de artefatos
- [ ] Concorrência otimista
- [ ] Store de eventos de auditoria

### Orquestração
- [ ] `fde-master`
- [ ] Registro de workflows
- [ ] Motor de próxima-melhor-ação
- [ ] Retry/idempotência

### Entrega
- [ ] Ingestão de discovery
- [ ] Pontuação de oportunidade
- [ ] Solution composer
- [ ] Registro de patterns
- [ ] Scaffold do builder

### Avaliação
- [ ] Runner de golden-set
- [ ] Métricas determinísticas
- [ ] Adaptador de avaliação semântica
- [ ] Comparação de regressão

### Governança
- [ ] Motor de política
- [ ] Tool gateway
- [ ] Token de aprovação
- [ ] Matriz de autonomia

### Produção
- [ ] Gate de prontidão
- [ ] Manifesto de release
- [ ] Adaptador de deploy
- [ ] Adaptador de rollback

### Observabilidade
- [ ] OpenTelemetry
- [ ] Captura de token/custo
- [ ] Métricas de negócio
- [ ] Hooks de alerta

### Incidente
- [ ] Schema de incidente
- [ ] Correlação de trace
- [ ] Diff de release
- [ ] Postmortem

### Demo
- [ ] Automação de faturas
- [ ] Documentos sintéticos
- [ ] Golden set
- [ ] Mock de SAP
- [ ] HITL
- [ ] Dashboard de valor
