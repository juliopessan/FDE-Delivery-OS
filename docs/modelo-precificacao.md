# Modelo de Precificação — FDE Solo

Precificação por fase, alinhada ao valor entregue em cada etapa da metodologia A.C.E.S., não por hora.

**O preço fixed-fee de cada fase nunca é definido "de cabeça".** Ele deve derivar da estimativa de esforço produzida por `fde-capacity-planner` (WBS + PERT, ver `templates/estimativa-esforco.md`) — fixed-fee sem estimativa de horas por trás é achismo travestido de método, e é a forma mais comum de um FDE solo corroer a própria margem.

## Estrutura recomendada

| Fase | Modelo | Racional |
| --- | --- | --- |
| 0. Qualificação | Gratuito (máx. 3-5 dias) ou fee simbólico | Reduz fricção de entrada; funciona como isca qualificada |
| 1. Assessment | Preço fixo (fixed-fee) | Escopo é claro e curto (2-3 semanas); protege o FDE de scope creep |
| 2. Context | Preço fixo ou milestone | Depende do volume de dados/sistemas — reavaliar preço se o escopo mudar após a Fase 1 |
| 3. Engineering | Preço fixo com milestone de "produção aprovada" | Vincula o pagamento final à aprovação da matriz HITL pelo cliente |
| 4. Scale | Retainer mensal (10-15h/semana) | Receita recorrente; renovação condicionada ao relatório de ROI |

## Regras de precificação

1. **Nunca cobrar por hora nas Fases 1-3.** Hora incentiva lentidão; fixed-fee incentiva eficiência e protege a margem do FDE solo — mas o fixed-fee em si vem de horas estimadas internamente (`fde-capacity-planner`), o cliente só vê o preço fechado.
2. **Reprecificar a cada transição de fase**, nunca no meio de uma fase em andamento — reprecificação sempre ancorada em nova estimativa, não em intuição de que "ficou mais caro".
3. **Cláusula de mudança de escopo:** qualquer novo caso de uso identificado após o Go/No-Go da Fase 1 reinicia o funil pela Fase 0 (mesmo que informal).
4. **Desconto de fundação:** o preço da Fase 1 pode ser parcialmente abatido do contrato de retainer (Fase 4), como incentivo à conversão — nunca abatido do preço da Fase 3 (produção é o ponto de maior risco técnico do FDE).
5. **Retainer com piso de renovação:** contratos abaixo de 6 meses tendem a não cobrir o custo de context-switching entre clientes de um FDE solo — evite.

## Referência de faixas (ajustar por mercado/região/porte do cliente)

| Item | Faixa sugerida |
| --- | --- |
| Fase 1 (Assessment, 2-3 sem.) | 1 a 2 retainers mensais equivalentes |
| Fase 2+3 (Context+Engineering, 5-7 sem.) | 3 a 5 retainers mensais equivalentes |
| Fase 4 (Retainer, 10-15h/semana) | Definido por mercado local; reajuste anual |

> Trate os valores acima como âncora relativa (múltiplos do próprio retainer), não como tabela fixa — ajuste ao porte do cliente e ao custo de vida da sua região.
