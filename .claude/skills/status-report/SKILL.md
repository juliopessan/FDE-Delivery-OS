---
name: status-report
description: Gera o relatório de status semanal (qualquer fase) ou o relatório mensal de ROI realizado (Fase 4) de um engajamento de FDE. Use ao final de cada semana de trabalho em um engajamento ativo, ou mensalmente durante a Fase 4.
---

# Skill: Relatório de Status / ROI

## Quando usar

- Semanalmente, em qualquer fase de um engajamento ativo — mantém o cliente informado e cria histórico auditável.
- Mensalmente, na Fase 4, especificamente para o relatório de ROI realizado (`fde-scale-ops`).

## Passo a passo — Status semanal

1. Abra `templates/relatorio-status-semanal.md`.
2. Preencha o resumo executivo em no máximo 3 linhas — o cliente deve entender o essencial sem ler o resto.
3. Liste os itens planejados da semana com status (concluído/em andamento/bloqueado).
4. Registre bloqueios e riscos de forma explícita, mesmo que pareçam pequenos — bloqueios não reportados cedo viram atraso de fase.
5. A partir da Fase 4, inclua as métricas semanais (taxa de intervenção HITL, custo de tokens, taxa de erro, volume processado).

## Passo a passo — Relatório mensal de ROI (Fase 4)

1. Puxe o ROI estimado original de `harness/engagements/<cliente>/01-assessment/calculo-roi.md`.
2. Puxe os dados reais de produção do mês (telemetria de observabilidade).
3. Compare realizado vs. estimado — se houver divergência, explique a causa (adoção, qualidade de dado, escopo reduzido).
4. Destaque tendências (ex.: queda na taxa de intervenção HITL mês a mês) como sinal de maturidade.
5. Encerre com uma recomendação clara: manter, expandir ou ajustar o escopo do retainer.

## Erros comuns a evitar

- Reportar apenas boas notícias — divergência de ROI omitida é a principal causa de churn quando descoberta depois.
- Pular o relatório em semanas "sem novidade" — a ausência de relatório gera mais dúvida no cliente do que um relatório curto dizendo "sem bloqueios".
