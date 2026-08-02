# Integração — MANIFEST como motor de descoberta da Fase 1

> **Esqueleto.** Documento inicial para orientar o handoff técnico entre o
> produto MANIFEST e a Fase 1 da metodologia A.C.E.S. Complementar conforme o
> Piloto 1 (ver `MANIFEST/docs/execution/30-60-90.md`) gerar evidência real.

## A tese

A Fase 1 hoje depende de shadowing manual: 3+ sessões observando operadores,
para estimar tempo médio por execução e volume mensal — os dois insumos
diretos do cálculo de ROI (`templates/calculo-roi.md`). Quando o shadowing
ainda não aconteceu, o `fde-assessor` recorre a benchmark de mercado como
placeholder, marcado explicitamente como cenário ilustrativo.

O MANIFEST substitui a estimativa por medição. Em vez de observar 3 sessões e
extrapolar, a captura de eventos registra **todas** as execuções do período,
e a descoberta de processos (`process-discovery.ts`) computa tempo médio,
volume e variantes diretamente dos dados — não da amostra, não do benchmark.

Isso não elimina o shadowing como técnica — elimina a necessidade de usá-lo
como única fonte quando existe captura instrumentada. As duas continuam
válidas; a escolha entre elas é sobre o que está disponível no cliente, não
sobre qual é "melhor" em abstrato.

## Mapeamento — Fase 1 × MANIFEST

| Deliverable da Fase 1 | Fonte manual (hoje) | Fonte MANIFEST |
|---|---|---|
| Tempo médio por execução | Cronometragem no shadowing | `Process.avgDurationMs` |
| Volume mensal | Contagem observada / extrapolada | `Process.instanceCount` no período capturado |
| Sistemas envolvidos | Entrevista com operador | `appSignature` (sequência de aplicações do processo descoberto) |
| Classificação Rígido/Cognitivo/Decisório | Julgamento do assessor sobre o relato | `Process.riskLevel` + `Process.automationPotential` como sinal de partida — **confirmar com julgamento humano, não substituir** |
| Priorização entre processos (ICE) | Estimativa de Impact/Confidence/Ease | `instanceCount` × `avgDurationMs` dá o "Impact" com dado real; Confidence sobe quando o processo já tem playbook gerado com score de confiança |
| Variantes e caminho predominante | Relato de exceções pelo operador | `DiscoveredVariant[]` — todas as variantes observadas, não só a que o operador lembrou de mencionar |

## O que isso muda no `calculo-roi.md`

Adicionar uma terceira fonte de dados, ao lado de "Shadowing real" e
"Benchmark de mercado": **Descoberta contínua (MANIFEST)**. Os campos de
"Dados de entrada" deixam de ser preenchidos à mão — vêm de
`GET /api/processes/[id]` do MANIFEST:

```
Tempo médio por execução hoje (min)  ← Process.avgDurationMs / 60000
Volume mensal de execuções           ← Process.instanceCount (normalizado ao período de captura)
Taxa de erro/retrabalho atual (%)    ← proporção de variantes fora do caminho predominante
```

Custo/hora da pessoa envolvida continua vindo de entrevista — o MANIFEST não
tem acesso a folha de pagamento, e não deveria ter.

## O que isso muda no `blueprint.md`

- **Seção 1 (Contexto do Processo)** — frequência, tempo médio e sistemas
  envolvidos vêm do processo descoberto, não de relato.
- **Seção 3 (Diagrama de Fluxo)** — `canonicalSteps` já é a sequência
  ordenada; o assessor formata, não reconstrói do zero.
- **Seção 4 (Sistemas de Integração)** — `appSignature` lista os sistemas
  tocados; tipo de acesso (read/write) ainda exige confirmação humana, porque
  a captura não distingue por si só qual ação é gravação em produção.

## A ponte de credibilidade: validar contra um audit já existente

Quando o cliente **já foi auditado** pelo A.C.E.S. em outro engajamento (ou
por outra consultoria), a ferramenta de comparação do MANIFEST
(`MANIFEST/scripts/compare-audit.ts`) responde uma pergunta concreta antes de
qualquer apresentação ao cliente: **a descoberta automática regenera o que o
audit manual documentou?**

Método: alinhamento de sequência entre os passos do audit (linguagem de
negócio) e os passos descobertos (aplicação + ação de UI) — os dois
vocabulários divergem por natureza, então a comparação não é por igualdade
de string. Ver `MANIFEST/docs/execution/pilot-1-validation.md` para o método
completo e uma rodagem de prova (6/7 passos, 86% de match, gate em 70%).

Isso não é etapa opcional de cortesia — é o que permite ao `fde-assessor`
apresentar o blueprint gerado por descoberta automática com a mesma
credibilidade de um blueprint construído a partir de shadowing manual, sem
ter que refazer o shadowing para provar que a descoberta não inventou nada.

## O que continua manual, sempre

- **Classificação final** na Matriz de Qualificação — `automationPotential`
  do MANIFEST é sinal de partida, não veredito. Um processo de baixa
  eficiência e alta repetição pode ser cognitivo por natureza (ex.: decisão
  de crédito), não apenas rígido mal executado.
- **Riscos e dependências** (Seção 5 do blueprint) — captura de eventos não
  vê contexto organizacional, políticas internas ou histórico de tentativas
  anteriores de automação.
- **Aprovação executiva** — nenhum dado, de qualquer fonte, substitui a
  assinatura do patrocinador na Seção 8.
- **Custo/hora e taxa de erro por causa raiz** — dado de sistema de folha ou
  de auditoria financeira, fora do escopo de captura comportamental.

## Handoff técnico — passo a passo

1. Confirmar NDA assinado (regra inalterada do `fde-assessor.md`).
2. Instrumentar a captura (`MANIFEST/extension/`) com a chave de ingestão do
   cliente.
3. Rodar `POST /api/processes/discover` após período mínimo de captura
   (recomendado: 2 a 4 semanas, calibrar por volume do processo).
4. Se existir audit anterior do mesmo processo, rodar
   `compare-audit.ts` contra o audit documentado — anexar o relatório ao
   blueprint como evidência de validação.
5. Preencher `templates/blueprint.md` e `templates/calculo-roi.md` a partir
   do mapeamento acima, com os campos manuais (riscos, custo/hora, aprovação)
   preenchidos por entrevista, não por suposição.
6. Seguir o checklist `checklists/go-nogo-fase1.md` normalmente — a origem do
   dado não muda o critério de Go/No-Go.

## Em aberto — para complementar

- Script de exportação direta de `GET /api/processes/[id]` para o formato de
  `blueprint.md` e `calculo-roi.md` (hoje é preenchimento manual a partir do
  mapeamento acima).
- Critério objetivo para decidir "captura suficiente" antes de rodar a
  descoberta (hoje é heurística de calendário, não de volume estatístico).
- Como `automationPotential` HIGH deveria alimentar o ICE score de forma
  mais direta do que "sinal de partida" — hoje é ainda um passo manual do
  assessor.
