# Template — Estimativa de Esforço (WBS + PERT)

**Cliente:** ______________________
**Fase:** [ ] 0 [ ] 1 [ ] 2 [ ] 3 [ ] 4
**Data:** ______________________
**Motivo da estimativa:** [ ] Proposta inicial [ ] Revalidação por mudança de escopo — descrever: ______________________

## WBS + PERT

| Tarefa | Papel | Otimista (h) | Provável (h) | Pessimista (h) | PERT (h) | Desvio padrão |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Fórmulas:** PERT = (O + 4×M + P) / 6 · Desvio padrão = (P − O) / 6

## Consolidação por Papel

| Papel | Total PERT (h) |
| --- | --- |
| FDE generalista | |
| Dev de integração | |
| Data engineer | |
| Segurança / compliance | |
| **Total da fase** | |

## Buffer e Total Final

| Item | Valor |
| --- | --- |
| Total PERT da fase | ___ h |
| Buffer aplicado (15-20%) | ___ % → ___ h |
| **Total com buffer** | ___ h |

## Tarefas de Maior Risco (desvio padrão alto)

-

## Comparação com Duração de Referência (`PLAYBOOK.md`)

- Duração de referência da fase: ______
- Duração implícita nesta estimativa (horas totais / capacidade semanal): ______
- Compatível com a referência? [ ] Sim [ ] Não — se não, justificar: ______

Próximo passo: alimentar [`plano-capacidade.md`](plano-capacidade.md) com o total desta estimativa.
