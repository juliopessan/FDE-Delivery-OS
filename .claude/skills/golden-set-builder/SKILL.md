---
name: golden-set-builder
description: Constrói e valida o golden set de perguntas de referência usado para medir recall/qualidade do pipeline RAG (Fase 2) e para testes de regressão antes de produção (Fase 3). Use ao configurar um novo pipeline de contexto ou antes de aprovar qualquer mudança de prompt/modelo.
---

# Skill: Construção e Validação do Golden Set

## Quando usar

- Na Fase 2, ao configurar o pipeline de ingestão/RAG (`fde-context-engineer`).
- Na Fase 3, antes de qualquer go-live ou mudança de prompt/modelo (`fde-qa`, teste de regressão).

## Passo a passo — Construção

1. Reúna 20-30 perguntas reais que o sistema precisa responder corretamente (para setores de alto risco — jurídico, saúde, financeiro — use 50+).
2. Para cada pergunta, registre: pergunta, resposta esperada, fonte/documento de onde a resposta deve vir.
3. Priorize perguntas que cobrem: casos comuns (alto volume), casos de borda (edge cases), e perguntas que o sistema **deveria recusar responder** (fora de escopo, dado não disponível) — isso testa se o sistema evita alucinação por omissão de grounding.
4. Salve em `harness/engagements/<cliente>/02-context/golden-set.md`.

## Passo a passo — Validação

1. Rode cada pergunta contra o sistema (ou contra o design documentado, se ainda não implementado).
2. Registre: resposta obtida, correta/incorreta, fonte citada corretamente ou não.
3. Calcule o recall = (respostas corretas com fonte correta) / (total de perguntas).
4. Compare contra o limiar definido (padrão 85%; setores de alto risco ≥ 95%).
5. Se abaixo do limiar, não aprove o Go/No-Go — devolva ao `fde-context-engineer` para ajuste de chunking/embedding/fonte.

## Erros comuns a evitar

- Golden set feito só de perguntas "fáceis" — não revela problemas reais de retrieval.
- Não incluir perguntas que o sistema deveria recusar — deixa alucinação por omissão sem cobertura de teste.
- Rodar a validação uma única vez e nunca mais repetir após mudanças de prompt/modelo (teste de regressão obrigatório).
