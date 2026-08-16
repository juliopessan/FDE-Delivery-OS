# Realização de Valor

> Complementa [`docs/modelo-precificacao.md`](../modelo-precificacao.md) e a skill [`roi-calculator`](../../.claude/skills/roi-calculator/SKILL.md) já em uso — aqui descrevemos o modelo-alvo de instrumentação contínua de valor.

## Baseline

Capturar volume, tempo de atendimento, custo de mão de obra, taxa de erro, SLAs perdidos e impactos mensuráveis de receita/risco.

## Equações

```text
horas_liberadas = volume × (minutos_baseline - minutos_manuais_novos) / 60
economia_bruta = horas_liberadas × custo_hora_carregado
beneficio_liquido = economia_bruta + ganho_de_receita_mensuravel - custo_cloud - custo_modelo - custo_suporte - custo_de_entrega_amortizado
```

## Rótulos de Confiança

Observado / Calculado / Estimado / Premissa.

## Cadência

Semanal durante o piloto, mensal em produção, trimestral para expansão estratégica.
