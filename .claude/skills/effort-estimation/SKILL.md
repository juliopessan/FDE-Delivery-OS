---
name: effort-estimation
description: Metodologia de estimativa de esforço em horas por fase da metodologia A.C.E.S., usando WBS (work breakdown structure) + estimativa de três pontos (PERT). Use ao fechar prazo/preço de uma fase, ou ao revalidar esforço depois de qualquer mudança de escopo.
---

# Skill: Estimativa de Esforço (WBS + PERT)

## Quando usar

- No fechamento de proposta de cada fase (Fase 0 para a Fase 1; ao final de cada Go/No-Go para a fase seguinte).
- A cada revalidação de escopo durante as Fases 2-4 (nova ferramenta, novo caso de uso, mudança de porte/regulação do cliente).
- Usada por `fde-capacity-planner`, mas qualquer agente pode invocá-la ao perceber que o escopo mudou.

## Passo a passo

1. **Decompor em WBS:** liste as tarefas da fase de forma granular. Regra prática: nenhuma tarefa deve ter estimativa maior que ~2 dias de esforço — se tiver, decomponha mais.
2. **Estimar três pontos por tarefa** (em horas):
   - **Otimista (O):** tudo corre bem, sem imprevistos.
   - **Mais Provável (M):** cenário realista, com pequenos ajustes normais.
   - **Pessimista (P):** imprevistos razoáveis (acesso atrasado, dado de baixa qualidade, retrabalho).
3. **Aplicar a fórmula PERT:**
   ```
   Estimativa (E)     = (O + 4×M + P) / 6
   Desvio padrão (DP) = (P − O) / 6
   ```
4. **Somar por papel** (FDE generalista, dev de integração, data engineer, segurança/compliance) e por fase.
5. **Aplicar buffer de 15-20%** sobre o total da fase.
6. **Comparar contra a capacidade disponível** (ver agente `fde-capacity-planner`) para decidir se o solo sustenta ou se precisa de reforço/extensão de prazo.

## Referência de ancoragem (durações do `PLAYBOOK.md`)

| Fase | Duração de referência |
| --- | --- |
| 0 — Qualificação | 3-5 dias úteis |
| 1 — Assessment | 2-3 semanas |
| 2 — Context | 2-3 semanas |
| 3 — Engineering | 3-4 semanas |
| 4 — Scale | Contínuo, 10-15h/semana |

Use essas durações como âncora para checar se a soma das estimativas PERT está plausível — se a WBS somar muito acima ou abaixo da referência, revise a decomposição antes de aceitar o número.

## Erros comuns a evitar

- Estimar "de cabeça" sem decompor em WBS — perde granularidade e some com o desvio padrão de tarefas específicas.
- Ignorar o desvio padrão — duas tarefas com a mesma média mas desvio muito diferente carregam riscos de estouro muito diferentes; a de maior desvio merece buffer adicional ou marco de checagem intermediário.
- Não recalcular quando o escopo muda no meio da fase — a estimativa original vira ficção.
- Zerar o buffer para "ganhar" a proposta comercial — transfere o risco de estouro para o meio do engajamento, quando é mais caro de corrigir.
