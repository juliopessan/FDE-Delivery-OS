# Modelo Operacional de Agentes

## Princípio

**Um agente = uma responsabilidade primária + fronteira de autoridade explícita.**

| Agente | Responsabilidade | Autoridade |
|---|---|---|
| fde-master | orquestração e estado | roteia o trabalho |
| fde-qualifier | fit e qualificação | recomenda GO/NO-GO |
| fde-assessor | discovery | recomenda casos de uso |
| fde-capacity-planner | WBS/PERT | bloqueia compromissos irrealistas |
| fde-context-engineer | RAG/contexto | recomenda arquitetura de contexto |
| fde-data-engineer | dados corporativos | recomenda arquitetura de dados |
| fde-architect | arquitetura de solução | propõe arquitetura |
| fde-ai-model-specialist | benchmark/roteamento | recomenda modelos |
| fde-solution-composer | composição de solução | gera spec de solução |
| fde-builder | scaffold de implementação | sem escrita em produção |
| fde-evaluator | execução de avaliação | produz evidência |
| fde-guardrails | política/segurança | veto de segurança |
| fde-qa | QA independente | veto de qualidade |
| fde-release-manager | prontidão | recomenda release |
| fde-incident | diagnóstico de incidente | recomenda remediação |
| fde-scale-ops | operação/valor | recomenda otimização |

> Nota: esta é a topologia-alvo do sistema completo. O time de agentes já em operação em [`.claude/agents/`](../../.claude/agents) é um subconjunto deliberadamente mais enxuto (9 agentes) calibrado para operação solo — ver [`specs/agent-roster.md`](../../specs/agent-roster.md).

## Contrato de Handoff

```yaml
handoff:
  from: fde-assessor
  to: fde-architect
  engagement_id: eng-001
  produced: [requirement_set:v3, process_blueprint:v2]
  blockers: ["Rate limit da API não confirmado"]
  confidence: 0.87
```

## Regras

1. Ler o estado persistido antes de delegar.
2. Enviar o contexto mínimo necessário.
3. Persistir saída tipada.
4. Vetos de QA/segurança não podem ser contornados.
5. Validação reprovada volta para o agente responsável.
6. Ações de alto impacto exigem aprovação humana.
