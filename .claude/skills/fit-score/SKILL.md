---
name: fit-score
description: Calcula o Fit Score de qualificação (Fase 0) de um prospect de FDE — 5 critérios ponderados que decidem GO/GO parcial/NO-GO antes de comprometer semanas de trabalho solo. Use quando avaliar um novo cliente em potencial ou revisar uma qualificação já feita.
---

# Skill: Fit Score de Qualificação

## Quando usar

Sempre que um novo prospect de FDE precisar ser avaliado antes de uma proposta comercial, ou quando um engajamento em andamento precisar ser reavaliado por mudança de contexto (ex.: patrocinador saiu da empresa).

## Passo a passo

1. Abra `templates/qualificacao-fit-score.md` (repositório de referência).
2. Para cada um dos 5 critérios, atribua nota de 0 a 5 com base em evidência concreta (não impressão):
   - **Dor mensurável** — existe custo/tempo hoje que dá para quantificar em R$ ou horas?
   - **Patrocínio executivo** — há um decisor com orçamento e autoridade engajado?
   - **Acesso a dados** — o cliente consegue liberar amostras reais em até 5 dias?
   - **Maturidade de processo** — o processo já é entendido e documentável?
   - **Tolerância a risco** — o cliente aceita um ciclo iterativo (PoC → produção)?
3. Some o total (máximo 25).
4. Aplique a regra de decisão:
   - **≥ 15** → GO para Fase 1 completa.
   - **10-14** → GO parcial (apenas diagnóstico isolado, sem compromisso de fases seguintes).
   - **< 10** → NO-GO.
5. Registre a decisão e a justificativa por escrito — nunca deixe implícita.

## Erros comuns a evitar

- Pontuar "Patrocínio executivo" alto só porque a pessoa é simpática/responsiva — o critério é orçamento + autoridade, não relacionamento.
- Inflar "Acesso a dados" antes de o cliente efetivamente confirmar por escrito o que pode compartilhar.
- Pular a reavaliação quando o contexto muda no meio de um engajamento em andamento.
