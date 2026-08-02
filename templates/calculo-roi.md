# Template — Cálculo de ROI Estimado (Fase 1)

**Fonte dos dados:** [ ] Shadowing real [ ] Descoberta contínua (MANIFEST) — ver `docs/integracoes/manifest-praxia.md` [ ] Benchmark de mercado (pré-shadowing) — se benchmark, preencher também a seção "Benchmarks de Mercado Utilizados" ao final e marcar claramente este documento como cenário ilustrativo, não ROI validado (ver skill `roi-calculator`, seção "Fallback: Benchmarking de Mercado").

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

## Benchmarks de Mercado Utilizados (preencher apenas se a fonte dos dados for benchmark)

| Variável estimada | Benchmark usado | Fonte (nome + link) | Ajuste aplicado e justificativa |
| --- | --- | --- | --- |
| | | | |

**Cenários (baixo / médio / alto)** — obrigatório quando a fonte é benchmark, pela maior incerteza:

| Cenário | Volume/Impacto assumido | Economia mensal estimada (R$) | Payback estimado (meses) |
| --- | --- | --- | --- |
| Conservador | | | |
| Médio | | | |
| Otimista | | | |

⚠️ **Este cálculo baseado em benchmark é um placeholder de proposta, não o ROI validado.** Deve ser substituído pelos números reais assim que o shadowing (Fase 1) acontecer.
