---
name: roi-calculator
description: Calcula o ROI estimado (Fase 1) ou realizado (Fase 4) de um engajamento de FDE, usando a fórmula padrão de custo mensal atual vs. custo mensal com IA. Use sempre que precisar produzir ou atualizar uma projeção/realização de ROI para um cliente.
---

# Skill: Cálculo de ROI

## Quando usar

- Na Fase 1, para estimar o ROI do PoC antes do Go/No-Go (`templates/calculo-roi.md`).
- Na Fase 4, mensalmente, para comparar o ROI realizado contra o estimado (`fde-scale-ops`).

## Fórmula

```
Custo mensal atual   = (tempo_atual_min / 60) × volume_mensal × custo_hora
Custo mensal com IA  = [(tempo_ia_min / 60) × volume_mensal × custo_hora × %HITL]
                      + (custo_token_execucao × volume_mensal)
                      + custo_infraestrutura_mensal_fixo

Economia mensal      = Custo mensal atual − Custo mensal com IA
ROI (payback meses)  = Investimento total do engajamento (Fases 1-3) / Economia mensal
```

## Passo a passo

1. Colete os dados de entrada (tempo médio por execução, volume mensal, custo/hora, taxa de erro atual) — na Fase 1, vêm do shadowing; na Fase 4, vêm da telemetria real de produção.
2. Estime (Fase 1) ou meça (Fase 4) o tempo com IA, % de execuções autônomas vs. com HITL, e custo de infraestrutura/tokens.
3. Aplique a fórmula acima.
4. **Sempre reporte em faixa (otimista/conservador)** na Fase 1 — nunca um número único. Na Fase 4, reporte o número real observado, mas contextualize contra a faixa original.
5. Se o realizado (Fase 4) divergir do estimado (Fase 1), documente a causa da divergência — não omita.

## Erros comuns a evitar

- Esquecer o custo de infraestrutura fixo (VectorDB, observabilidade) no cálculo — isso infla artificialmente o ROI.
- Assumir 100% de execuções autônomas sem considerar o % real de HITL definido pela matriz de autonomia (`fde-guardrails`).
- Apresentar um número único de payback sem faixa de confiança na Fase 1.
