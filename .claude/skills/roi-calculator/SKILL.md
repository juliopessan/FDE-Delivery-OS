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

## Fallback: Benchmarking de Mercado (quando ainda não há shadowing real)

Antes do shadowing acontecer — ou quando o fit score aponta pendência de acesso a dado real (`fde-qualifier`) — o ROI pode ser pré-preenchido com **benchmarks públicos de mercado** para dar ordem de grandeza à proposta, em vez de deixar o cálculo vazio ou, pior, inventar números específicos do cliente.

### Como usar

1. Para cada variável de entrada da fórmula (tempo por execução, custo/hora, taxa de conversão/erro), busque um benchmark público equivalente por **função/processo** (ex.: "tempo médio de elaboração de proposta comercial", "custo/hora de analista de marketing CLT", "lift de conversão de chatbot de atendimento") — não por empresa específica.
2. Prefira benchmarks segmentados por porte/setor mais próximo do cliente (ex.: empresas < 100 funcionários, agências de marketing) a médias globais genéricas.
3. Quando o benchmark encontrado for de um processo mais pesado/diferente do real (ex.: RFP formal como proxy de proposta comercial de agência), aplique um fator de ajuste explícito e documente a lógica do ajuste — nunca use o número bruto sem justificar a analogia.
4. Cite a fonte de cada benchmark (nome + link) no documento de ROI — um benchmark sem fonte rastreável não é diferente de um chute.
5. Rotule todo o cálculo como **"Cenário ilustrativo baseado em benchmark de mercado — não é dado real do cliente"**, em destaque, no topo do documento.
6. Apresente em **cenários** (baixo/médio/alto volume ou baixo/médio/alto impacto), não em um número único — o benchmark tem mais incerteza que um dado medido, então a faixa deve ser mais larga, não mais estreita.
7. Quando o shadowing real acontecer, **substitua** os números de benchmark pelos números reais — o documento baseado em benchmark é um placeholder de proposta, não o ROI final que entra no Go/No-Go da Fase 1.

### Erros específicos deste fallback

- Apresentar um cenário de benchmark como se fosse o ROI real já validado — isso quebra a confiança do cliente quando o número real divergir.
- Usar a estatística mais otimista encontrada na pesquisa (ex.: "+391% de conversão") como cenário-base — prefira sempre o extremo mais conservador do intervalo relatado na literatura, guardando o número otimista apenas como referência de teto.
- Não atualizar o documento quando o dado real chegar — o benchmark expira no momento em que o shadowing produz um número medido.
