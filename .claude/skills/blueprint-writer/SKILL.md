---
name: blueprint-writer
description: Estrutura o AI Architecture Blueprint da Fase 1 a partir dos dados de shadowing — classificação do processo, diagrama de fluxo, sistemas de integração, riscos e escopo do PoC. Use ao concluir o shadowing operacional de um cliente.
---

# Skill: Redação do AI Architecture Blueprint

## Quando usar

Ao final do shadowing operacional na Fase 1 (`fde-assessor`), antes do cálculo de ROI e do Go/No-Go da Fase 1.

## Passo a passo

1. Abra `templates/blueprint.md`.
2. Preencha o contexto do processo: descrição as-is, frequência/volume mensal, tempo médio por execução hoje, pessoas e sistemas envolvidos — todos vindos de dados observados no shadowing, não de relato de gestor sem confirmação.
3. Classifique o processo na Matriz de Qualificação:
   - Rígido e Repetitivo → RPA/Webhooks simples (sinalize que talvez Gen AI não seja a solução certa).
   - Cognitivo/Contextual → Gen AI (RAG/LLM).
   - Decisório/Multi-etapas → Agentes Autônomos/MCP.
4. Descreva o diagrama de fluxo (texto ou ASCII) cobrindo entrada → etapas → pontos de decisão humana → saída.
5. Liste cada sistema de integração necessário, com tipo de acesso (read/write) e status de aprovação — isso alimenta diretamente o trabalho da Fase 2.
6. Documente riscos e dependências explicitamente — não deixe implícito.
7. Delimite o escopo do PoC: o que entra, o que fica explicitamente fora, e o critério objetivo de sucesso.
8. Submeta para aprovação do patrocinador executivo antes de considerar a Fase 1 concluída.

## Erros comuns a evitar

- Classificar o processo como "Decisório/Multi-etapas" por padrão, quando na verdade é "Cognitivo/Contextual" — isso infla desnecessariamente a complexidade da Fase 3.
- Deixar "Fora de escopo" vazio ou vago — é a principal proteção contra scope creep nas fases seguintes.
- Pedir acesso de escrita a sistemas já no blueprint da Fase 1 — write access só é decidido na Fase 3, pelo `fde-guardrails`.
