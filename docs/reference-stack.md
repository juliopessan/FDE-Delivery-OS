# Reference Stack (Tooling Menu)

A menu of options per layer — choose by fit with the client's environment (what is already used or approved internally), not by the FDE's personal preference. The Golden Rule applies here too: start simple.

## Application Layer

| Need | Options |
| --- | --- |
| Conversation channel | WhatsApp Business API (Evolution API, Twilio, Meta Cloud API), Microsoft Teams, Slack, web widget |
| Internal interface | A simple admin panel (Next.js/React), or reuse of the client's existing CRM/ERP |

## Orchestration Layer

| Need | Options |
| --- | --- |
| Low-code automation | n8n (self-hosted or cloud), Make, Zapier |
| Agent orchestration in code | LangChain / LangGraph, native orchestration via the LLM provider's SDK |
| Tool and data integration | Model Context Protocol (MCP), the provider's native tool calling |

## Knowledge & Memory Layer

| Need | Options |
| --- | --- |
| Vector store | Qdrant, Pinecone, Weaviate, pgvector (PostgreSQL) |
| Relational/state store | PostgreSQL, MySQL, SQLite (for small PoCs) |
| Cache / short-term memory | Redis |

## Observability & Governance Layer

| Need | Options |
| --- | --- |
| LLM tracing and observability | Langfuse, Arize Phoenix, Helicone |
| Structured guardrails | Guardrails AI, native schema validation (Pydantic/Zod) |
| Token cost management | Custom dashboards over usage logs, or the LLM provider's native telemetry |

## Model Providers

| Need | Options |
| --- | --- |
| Complex reasoning / production | Frontier models from the client's preferred provider (assess the data and residency agreement) |
| High-volume triage/classification | Smaller, faster models from the same provider, to cut cost without duplicating the integration |

## Selection criteria

1. **Compliance first:** if the client already has a cloud or AI provider approved by security, use it — do not introduce a new vendor without formal approval.
2. **Portability:** prefer open standards (MCP, JSON Schema, SQL) over proprietary lock-in whenever the switching cost is low.
3. **Reversibility:** in a PoC, choose what is easy to throw away; only commit to permanent infrastructure in Phase 3, with the client's approval.
