# Stack de Referência (Cardápio de Ferramentas)

Cardápio de opções por camada — escolha por adequação ao ambiente do cliente (o que já é usado/aprovado internamente), não por preferência pessoal do FDE. A Regra de Ouro se aplica aqui também: comece simples.

## Camada de Aplicação

| Necessidade | Opções |
| --- | --- |
| Canal de conversa | WhatsApp Business API (Evolution API, Twilio, Meta Cloud API), Microsoft Teams, Slack, widget web |
| Interface interna | Painel admin simples (Next.js/React), ou reaproveitar CRM/ERP existente do cliente |

## Camada de Orquestração

| Necessidade | Opções |
| --- | --- |
| Automação low-code | n8n (self-hosted ou cloud), Make, Zapier |
| Orquestração de agentes em código | LangChain / LangGraph, orquestração nativa via SDK do provedor de LLM |
| Integração de ferramentas/dados | Model Context Protocol (MCP), tool calling nativo do provedor |

## Camada de Conhecimento & Memória

| Necessidade | Opções |
| --- | --- |
| Banco vetorial | Qdrant, Pinecone, Weaviate, pgvector (PostgreSQL) |
| Banco relacional/estado | PostgreSQL, MySQL, SQLite (para PoCs pequenos) |
| Cache/memória de curto prazo | Redis |

## Camada de Observabilidade & Governança

| Necessidade | Opções |
| --- | --- |
| Tracing/observabilidade de LLM | Langfuse, Arize Phoenix, Helicone |
| Guardrails estruturados | Guardrails AI, validação de schema nativa (Pydantic/Zod) |
| Gestão de custo de tokens | Dashboards custom sobre logs de uso, ou telemetria nativa do provedor de LLM |

## Provedores de Modelo

| Necessidade | Opções |
| --- | --- |
| Raciocínio complexo / produção | Modelos "frontier" do provedor de preferência do cliente (avaliar contrato de dados/residência) |
| Triagem/classificação de alto volume | Modelos menores/rápidos do mesmo provedor, para reduzir custo sem duplicar integração |

## Critérios de escolha

1. **Compliance primeiro:** se o cliente já tem um provedor de nuvem/IA aprovado por segurança, use-o — não introduza um novo fornecedor sem aprovação formal.
2. **Portabilidade:** prefira padrões abertos (MCP, JSON Schema, SQL) a lock-in proprietário sempre que o custo de troca for baixo.
3. **Reversibilidade:** em PoC, escolha o que é fácil de descartar; só comprometa infraestrutura definitiva na Fase 3, com aprovação do cliente.
