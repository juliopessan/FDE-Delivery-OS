# Template — Cálculo de ROI Estimado (Fase 1)

## Dados de entrada (coletados no shadowing)

| Variável | Valor |
| --- | --- |
| Tempo médio por execução hoje (min) | |
| Volume mensal de execuções | |
| Custo/hora médio da(s) pessoa(s) envolvida(s) (R$) | |
| Taxa de erro/retrabalho atual (%) | |

## Estimativa pós-automação

| Variável | Valor |
| --- | --- |
| Tempo médio por execução com IA (min) | |
| % de execuções totalmente autônomas (sem HITL) | |
| % de execuções com HITL (revisão humana parcial) | |
| Custo estimado de infraestrutura/tokens por execução (R$) | |

## Fórmula

```
Custo mensal atual   = (tempo_atual_min / 60) × volume_mensal × custo_hora
Custo mensal com IA  = [(tempo_ia_min / 60) × volume_mensal × custo_hora × %HITL]
                      + (custo_token_execucao × volume_mensal)
                      + custo_infraestrutura_mensal_fixo

Economia mensal      = Custo mensal atual − Custo mensal com IA
ROI (payback meses)  = Investimento total do engajamento (Fases 1-3) / Economia mensal
```

## Resultado

| Métrica | Valor |
| --- | --- |
| Custo mensal atual (R$) | |
| Custo mensal projetado com IA (R$) | |
| Economia mensal estimada (R$) | |
| Investimento total (Fases 1-3) (R$) | |
| Payback estimado (meses) | |

> Reporte sempre a faixa (otimista/conservador), nunca um número único — protege a credibilidade do FDE quando o resultado real da Fase 4 divergir da estimativa.
