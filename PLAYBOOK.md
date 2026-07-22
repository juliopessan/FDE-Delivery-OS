# PLAYBOOK DE ACELERAÇÃO: FORWARD DEPLOYED ENGINEER (FDE) SOLO

Este playbook estrutura o **Framework de Aceleração de Gen AI** — um método replicável de 4 fases (mais uma fase de qualificação, Fase 0) para mapear, arquitetar e implantar automações agênticas corporativas em ciclos curtos de alto impacto, operado por um único FDE.

O framework é **agnóstico de porte e setor de empresa** — as fases abaixo se aplicam da mesma forma a uma PME, uma média empresa ou uma corporação enterprise, e a qualquer vertical (saúde, financeiro, jurídico, varejo, indústria, setor público etc.). O que varia é a profundidade, a formalidade e a duração de cada fase — nunca a sequência ou os gates de segurança. Antes de fechar o escopo na Fase 0, consulte [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md) para calibrar corretamente.

---

## 🏗️ Visão Geral do Framework (Metodologia A.C.E.S.)

O framework é mapeado em 4 ciclos de execução operados por um **FDE Pod** (mesmo que em modo Solo, o FDE assume os diferentes papéis conforme o Playbook):

```
[ FASE 0: QUALIFICAÇÃO ]  --> Fit Comercial & Técnico (1 semana, pré-contrato)
          │
[ FASE 1: ASSESSMENT ]    --> Diagnóstico Cognitivo & Blueprint (Sprints 1-2)
          │
[ FASE 2: CONTEXT ]       --> Engenharia de Dados & RAG/MCP (Sprints 3-4)
          │                   * Papel: Data Engineer (Fabric/OneLake)
          │
[ FASE 3: ENGINEERING ]   --> Arquitetura Agêntica & Production (Sprints 5-6)
          │                   * Papel: AI Model Specialist & Architect
          │
[ FASE 4: SCALE ]         --> Governança, HITL & Retainer Fracionado (Contínuo)
```

**Playbooks de Execução:**
Dependendo do desafio, o `fde-master` seleciona uma sequência otimizada de atividades (ex.: RAG Track, Agentic Track, Data-Heavy Track). Ver `specs/agent-roster.md`.

---

## 🎯 FASE 0: Qualificação (Pré-contrato)

**Duração:** 3 a 5 dias úteis
**Objetivo:** Evitar engajamentos de baixo ROI ou tecnicamente inviáveis antes de comprometer semanas de trabalho solo.

### 1. Critérios de Fit (score 0-5 cada)

| Critério | Pergunta-chave | Peso |
| --- | --- | --- |
| Dor mensurável | Existe custo/tempo hoje que dá para quantificar em R$ ou horas? | Alto |
| Patrocínio executivo | Há um decisor com orçamento e autoridade engajado, não só um "curioso"? | Alto |
| Acesso a dados | O cliente consegue liberar amostras de dados reais em até 5 dias? | Alto |
| Maturidade de processo | O processo já é entendido e documentável, ou ainda está sendo inventado? | Médio |
| Tolerância a risco | O cliente aceita um ciclo iterativo (PoC → produção) ou exige "big bang"? | Médio |

**Regra de decisão:** score total ≥ 15/25 → prosseguir para Fase 1. Entre 10-14 → propor apenas um diagnóstico pago isolado (Fase 1 standalone). Abaixo de 10 → declinar ou recomendar consultoria de processos tradicional.

### 2. Saídas da Fase 0

* **One-pager de proposta** com escopo da Fase 1 (Assessment) e preço fixo.
* **NDA / termo de confidencialidade** assinado antes de qualquer acesso a dados.
* Ver template: [`templates/qualificacao-fit-score.md`](templates/qualificacao-fit-score.md)

---

## 📋 FASE 1: Assessment & Blueprint (Discovery & PoC)

**Duração:** 2 a 3 semanas (Sprints 1-2)
**Objetivo:** Identificar gargalos cognitivos, validar a viabilidade técnica e entregar um protótipo funcional (*Proof of Concept*).

### 1. Imersão Operacional (*Shadowing*)

* Acompanhar o fluxo de trabalho do time do cliente em tempo real (mín. 3 sessões de 1h com operadores reais, não só gestores).
* Identificar interações com documentos não estruturados (PDFs, e-mails, relatórios, áudios).
* Mapear pontos de tomada de decisão e validação manual.
* Registrar o **tempo médio por tarefa** e o **volume mensal** — é a base do cálculo de ROI da Fase 4.

### 2. Matriz de Qualificação de Automação

Classificar o processo dentro do quadrante de viabilidade:

| Tipo de Processo | Lógica | Tipo de Solução Recomendada |
| --- | --- | --- |
| **Rígido e Repetitivo** | Regras fixas / Dados estruturados | RPA / Webhooks simples |
| **Cognitivo / Contextual** | Interpretação / Síntese / Extração | **Arquitetura de Gen AI (RAG / LLM)** |
| **Decisório / Multi-etapas** | Ações em múltiplos sistemas | **Agentes Autônomos / MCP** |

### 3. Matriz de Priorização (ICE) dos casos de uso mapeados

Quando o shadowing revela mais de um caso de uso candidato, priorize com ICE antes de escolher o PoC:

| Caso de Uso | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Score (média) |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

Escolha o PoC pelo maior score, não pelo mais "impressionante" para demonstrar.

### 4. Entregáveis da Fase 1

* **AI Architecture Blueprint:** diagrama de fluxo de contexto e integração de sistemas legados.
* **PoC Funcional:** protótipo rodando em ambiente controlado (*Sandbox*) com dados reais do cliente.
* **Cálculo de ROI Estimado:** projeção de redução de tempo operacional vs. custo estimado de infraestrutura/tokens.
* **Go/No-Go do cliente** para a Fase 2, com escopo e preço fechados.

Templates: [`templates/blueprint.md`](templates/blueprint.md) · [`templates/calculo-roi.md`](templates/calculo-roi.md)

---

## ⚙️ FASE 2: Context & Integration (Engenharia do Conhecimento)

**Duração:** 2 a 3 semanas (Sprints 3-4)
**Objetivo:** Estruturar a base de dados corporativa e as conexões do ambiente.

### 1. Pipeline de Dados e RAG (*Retrieval-Augmented Generation*)

* **Ingestão:** estruturar parsers para extração de dados não estruturados (PDF, DOCX, e-mail, áudio via ASR).
* **Chunking & Embedding:** definir a estratégia de divisão de texto e vetorização adequada ao domínio da empresa (semântico vs. fixo, overlap, metadados de origem para citação).
* **VectorDB:** configurar o banco vetorial (Qdrant, Pinecone, pgvector ou equivalente gerenciado do cliente).
* **Estratégia de atualização:** definir cadência de reindexação (batch noturno vs. incremental por webhook) — decisão que evita "conhecimento congelado".

### 2. Protocolos de Integração e Ferramentas (MCP / APIs)

* Mapear APIs e webhooks de sistemas legados (CRM, ERP, bancos de dados).
* Estruturar conectores via **Model Context Protocol (MCP)** ou chamadas de ferramentas (*Tool Calling*) para permitir que a IA leia e escreva em sistemas externos.
* Definir explicitamente **escopo de permissão por conector** (read-only vs. read-write) — todo conector de escrita nasce read-only até a Fase 3 aprovar guardrails.

### 3. Qualidade de Dados como Gate

Nenhum pipeline avança para a Fase 3 sem:

* Amostra de 20-30 perguntas de validação (*golden set*) com resposta esperada.
* Taxa de recall aceitável no retrieval (defina o limiar por domínio; comece exigindo ≥ 85%).
* Revisão de PII/dados sensíveis antes da vetorização (ver [`docs/governanca-seguranca.md`](docs/governanca-seguranca.md)).

---

## 🤖 FASE 3: Engineering & Guardrails (Orquestração Agêntica)

**Duração:** 3 a 4 semanas (Sprints 5-6)
**Objetivo:** Construir o sistema agêntico pronto para produção com foco em resiliência e segurança.

### 1. Orquestração da Topologia de Modelos

* Estratégia de roteamento: usar modelos menores/rápidos para triagem e classificação, reservando modelos de raciocínio avançado apenas para tarefas complexas — otimiza custo sem sacrificar qualidade nas etapas críticas.
* Configuração de agentes especialistas (Pesquisador, Analista, Revisor/Crítico) com responsabilidades e prompts isolados — evita "agente faz-tudo" difícil de depurar.
* Defina explicitamente o **padrão de orquestração**: single-agent com tools, multi-agent supervisor/worker, ou pipeline determinístico com LLM em etapas pontuais. Escolha o mais simples que resolve o processo (ver Regra de Ouro).

### 2. Implementação de Guardrails & Segurança

* **Input Guardrails:** filtros para prevenção de *Prompt Injection* e mascaramento de dados sensíveis (LGPD).
* **Output Guardrails:** validação de schemas (JSON rígido) e checagem de alucinações antes do envio da resposta.
* **Rate limiting & circuit breakers** por conector externo, para conter custo e blast radius de falhas em cascata.
* **Trilha de auditoria:** todo input, output e decisão de ferramenta deve ser logado com timestamp e ator — obrigatório para setores regulados.

### 3. Desenho do Fluxo *Human-in-the-Loop* (HITL)

* Definir regras de transbordo: quando a confiança da resposta do agente estiver abaixo do limiar (ex.: < 85%), ou a ação for irreversível/de alto impacto (envio de e-mail, transação financeira, alteração de cadastro), o caso é roteado para aprovação humana antes da execução final.
* Classificar toda ação do agente em **Autônoma / Aprovação Prévia / Bloqueada** — essa matriz deve ser aprovada por escrito pelo patrocinador do cliente antes de ir para produção.

### 4. Testes Antes da Virada para Produção

* Teste de carga básico (concorrência esperada de uso).
* Teste de *red-teaming* leve: tentativas de prompt injection e extração de system prompt.
* Teste de regressão no *golden set* da Fase 2 após qualquer mudança de prompt ou modelo.

---

## 🚀 FASE 4: Scale, Governance & Retainer (Operação Contínua)

**Duração:** Contínua (recorrência mensal)
**Objetivo:** Monitorar a performance, otimizar custos e expandir o modelo para novos processos.

### 1. Observabilidade e AI Ops

* Implementar plataforma de monitoramento/tracing de LLM (ex.: Langfuse, Arize Phoenix, ou equivalente já usado pelo cliente).
* Acompanhar métricas de SLA: latência por requisição, custo acumulado de tokens, taxa de erro/alucinação e volume de intervenções humanas.
* Publicar um **relatório mensal de valor entregue** (ROI realizado vs. estimado na Fase 1) — é o principal argumento de renovação do retainer.

### 2. Modelo de Passagem de Bastão (Handoff)

* Treinamento do time técnico interno (se houver) para manutenção básica.
* Documentação detalhada das instruções de sistema (*system prompts*), arquitetura e endpoints de API.
* Runbook de incidentes: o que fazer quando o agente alucina, quando um conector cai, quando o custo de tokens dispara.

### 3. Transição para Fractional FDE (Retainer)

* Migrar o contrato para o modelo recorrente (10h a 15h semanais) focado em:
  * Refinamento contínuo de *prompts* e bases de conhecimento.
  * Gestão e otimização do orçamento de infraestrutura cloud e tokens.
  * Mapeamento de novos casos de uso na empresa (reinicia o funil a partir da Fase 0/1, agora com confiança já estabelecida).

Detalhes de modelo de precificação por fase: [`docs/modelo-precificacao.md`](docs/modelo-precificacao.md).

---

## 📐 RACI por Fase (operação solo + stakeholders do cliente)

| Fase | FDE (você) | Patrocinador executivo | Time operacional do cliente | TI/Segurança do cliente |
| --- | --- | --- | --- | --- |
| 0. Qualificação | Responsável | Aprova | Consultado | Informado |
| 1. Assessment | Responsável | Aprova ROI/Go-No-Go | Consultado (shadowing) | Informado |
| 2. Context | Responsável | Informado | Consultado (validação de dados) | Aprova acessos |
| 3. Engineering | Responsável | Aprova matriz HITL | Testa/valida golden set | Aprova guardrails de produção |
| 4. Scale | Responsável | Aprova renovação | Consultado | Consultado (auditorias) |

---

## 📊 KPIs de Sucesso do Engajamento

| Métrica | Onde é medida | Meta de referência |
| --- | --- | --- |
| Tempo de ciclo até 1º PoC | Fase 1 | ≤ 15 dias úteis |
| Taxa de recall no golden set | Fase 2 | ≥ 85% |
| Taxa de intervenção humana (HITL) | Fase 4 (contínuo) | Tendência de queda mês a mês |
| ROI realizado vs. estimado | Fase 4 (contínuo) | ≥ 80% do estimado na Fase 1 |
| Taxa de renovação de retainer | Fase 4 | ≥ 70% dos clientes ativos |

---

## 🚫 Antipadrões Comuns (o que evitar)

* **Big bang sem PoC:** pular a Fase 1 e ir direto para arquitetura complexa sem validar valor com dados reais.
* **Agente sem guardrails de saída:** liberar ações de escrita em sistemas de produção antes de definir a matriz Autônoma/Aprovação/Bloqueada.
* **Excesso de agentes:** criar topologia multi-agente para um processo que um único prompt bem estruturado resolveria.
* **RAG sem estratégia de atualização:** vetorizar uma vez e nunca mais reindexar — a base "descola" da realidade do negócio em semanas.
* **Retainer sem relatório de valor:** operar a Fase 4 sem reportar ROI mensal mensurável — é o motivo nº 1 de churn de fractional FDE.

---

## 🧰 Toolkit de Entrega do FDE Solo

Para manter a velocidade de execução sem a necessidade de uma equipe de desenvolvimento, adote a seguinte pilha operacional (cardápio completo com alternativas em [`docs/stack-referencia.md`](docs/stack-referencia.md)):

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APLICAÇÃO                       │
│            Interfaces Web / WhatsApp API / CRMs              │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│                  ORQUESTRAÇÃO E FLUXOS                        │
│         n8n (Self-hosted/Cloud) / LangChain / MCP             │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│             BASE DE CONHECIMENTO & MEMÓRIA                    │
│             Qdrant / Pinecone / PostgreSQL (pgvector)         │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│               OBSERVABILIDADE E GOVERNANÇA                    │
│                Langfuse / Guardrails AI                       │
└─────────────────────────────────────────────────────────────┘
```

> **Regra de Ouro do FDE Solo:** mantenha a arquitetura simples na PoC para comprovar valor rápido, e adicione complexidade agêntica apenas onde o processo de negócio realmente exigir.

---

## 📎 Referências Rápidas

* Checklists Go/No-Go por fase: [`checklists/`](checklists)
* Templates de campo: [`templates/`](templates)
* Modelo de precificação: [`docs/modelo-precificacao.md`](docs/modelo-precificacao.md)
* Governança e segurança (LGPD): [`docs/governanca-seguranca.md`](docs/governanca-seguranca.md)
* Stack de referência e alternativas: [`docs/stack-referencia.md`](docs/stack-referencia.md)
* Adaptação por porte/setor de cliente: [`docs/adaptacao-por-perfil-cliente.md`](docs/adaptacao-por-perfil-cliente.md)
