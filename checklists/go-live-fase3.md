# Checklist Go-Live — Fim da Fase 3 (Engineering)

Este checklist é o gate de segurança antes de qualquer virada para produção.

## Guardrails

- [ ] Input guardrails implementados (prompt injection, rate limiting)
- [ ] Output guardrails implementados (validação de schema, checagem de grounding/citação)
- [ ] Circuit breakers configurados por conector externo

## Matriz de Autonomia

- [ ] Toda ação do agente classificada como Autônoma / Aprovação Prévia / Bloqueada
- [ ] Matriz de autonomia aprovada por escrito pelo patrocinador executivo
- [ ] Fluxo HITL testado ponta a ponta (caso de baixa confiança roteado corretamente)

## Testes

- [ ] Teste de regressão no golden set após última mudança de prompt/modelo
- [ ] Teste de carga básico (concorrência esperada)
- [ ] Teste de red-teaming leve (prompt injection, extração de system prompt)

## Segurança e Compliance

- [ ] Revisão LGPD concluída (base legal, retenção de logs, mascaramento de PII)
- [ ] Trilha de auditoria ativa (logs de input/output/decisão, não editáveis pelo agente)
- [ ] Aprovação de TI/Segurança do cliente para acessos read-write concedidos
- [ ] Confirmado que nenhum conector usa conta de serviço com privilégio maior que o do FDE (permissão herdada, ver `docs/governanca-seguranca.md`)
- [ ] Matriz de autonomia reclassificada para o ambiente de produção (não herdada do sandbox/PoC)

## Capacidade de Infraestrutura

- [ ] Volume/concorrência esperada validado contra o dimensionamento atual (storage, compute, limites de API do provedor de LLM)
- [ ] Considerado que o agente pode operar de forma contínua/paralela, diferente do ritmo sequencial de um operador humano — picos de uso não devem estourar rate limits sem tratamento adequado

## Observabilidade

- [ ] Plataforma de tracing/observabilidade configurada
- [ ] Dashboard de custo de tokens ativo
- [ ] Alertas configurados para taxa de erro/custo fora do esperado

## Handoff

- [ ] Runbook de incidentes documentado
- [ ] System prompts e arquitetura documentados

**Decisão:** [ ] GO-LIVE aprovado [ ] Pendências a resolver: ______________________
