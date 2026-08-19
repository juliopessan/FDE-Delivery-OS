# ACCELERATION PLAYBOOK: SOLO FORWARD DEPLOYED ENGINEER (FDE)

This playbook holds the methodological kernel of **FDE Delivery OS** — a repeatable 4-phase method (plus a qualification phase, Phase 0) for mapping, architecting and deploying enterprise agentic automation in short, high-impact cycles, run by a single FDE.

The framework is **agnostic to company size and sector** — the phases below apply the same way to a small business, a mid-market company or an enterprise, and to any vertical (healthcare, financial, legal, retail, industrial, public sector and so on). What varies is the depth, formality and duration of each phase — never the sequence or the security gates. Before closing scope in Phase 0, read [`docs/client-profile-adaptation.md`](docs/client-profile-adaptation.md) to calibrate correctly.

---

## 🏗️ Framework Overview (A.C.E.S. Methodology)

The framework splits into one qualification phase and 4 execution cycles (*Assessment, Context, Engineering, Scale*), covering everything from prospecting to recurring support:

```
[ PHASE 0: QUALIFICATION ] --> Commercial & technical fit (1 week, pre-contract)
          │
[ PHASE 1: ASSESSMENT ]    --> Cognitive diagnosis & blueprint (Sprints 1-2)
          │
[ PHASE 2: CONTEXT ]       --> Data engineering & RAG/MCP (Sprints 3-4)
          │
[ PHASE 3: ENGINEERING ]   --> Agentic architecture & production (Sprints 5-6)
          │
[ PHASE 4: SCALE ]         --> Governance, HITL & fractional retainer (continuous)
```

**Total duration to production:** 8 to 10 weeks. **Golden rule:** no phase advances without clearing its Go/No-Go checklist (see [`checklists/`](checklists)).

---

## 🎯 PHASE 0: Qualification (Pre-contract)

**Duration:** 3 to 5 business days
**Objective:** Avoid low-ROI or technically unworkable engagements before committing weeks of solo work.

### 1. Fit Criteria (score 0-5 each)

| Criterion | Key question | Weight |
| --- | --- | --- |
| Measurable pain | Is there a cost or time today that can be quantified in money or hours? | High |
| Executive sponsorship | Is there an engaged decision-maker with budget and authority, not just someone curious? | High |
| Data access | Can the client release real data samples within 5 days? | High |
| Process maturity | Is the process already understood and documentable, or still being invented? | Medium |
| Risk tolerance | Will the client accept an iterative cycle (PoC → production), or do they demand a big bang? | Medium |

**Decision rule:** total score ≥ 15/25 → proceed to Phase 1. Between 10-14 → offer a paid standalone diagnostic only (Phase 1 on its own). Below 10 → decline, or recommend traditional process consulting.

### 2. Phase 0 Outputs

* **Proposal one-pager** with Phase 1 (Assessment) scope and a fixed price.
* **Signed NDA** before any access to data.
* See the template: [`templates/fit-score-qualification.md`](templates/fit-score-qualification.md)

---

## 📋 PHASE 1: Assessment & Blueprint (Discovery & PoC)

**Duration:** 2 to 3 weeks (Sprints 1-2)
**Objective:** Identify cognitive bottlenecks, validate technical feasibility and deliver a working prototype (*proof of concept*).

### 1. Operational Immersion (*Shadowing*)

* Follow the client team's workflow in real time (minimum 3 one-hour sessions with actual operators, not only managers).
* Identify interactions with unstructured documents (PDFs, emails, reports, audio).
* Map decision points and manual validation steps.
* Record the **average time per task** and the **monthly volume** — this is the basis of the Phase 4 ROI calculation.

### 2. Automation Qualification Matrix

Place the process within the feasibility quadrant:

| Process type | Logic | Recommended solution type |
| --- | --- | --- |
| **Rigid and repetitive** | Fixed rules / structured data | Simple RPA / webhooks |
| **Cognitive / Contextual** | Interpretation / synthesis / extraction | **Gen AI architecture (RAG / LLM)** |
| **Decision-making / Multi-step** | Actions across several systems | **Autonomous agents / MCP** |

### 3. Prioritisation Matrix (ICE) for the mapped use cases

When shadowing reveals more than one candidate use case, prioritise with ICE before choosing the PoC:

| Use case | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Score (mean) |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

Choose the PoC by highest score, not by which one demos best.

### 4. Phase 1 Deliverables

* **AI Architecture Blueprint:** context flow diagram and legacy system integration.
* **Working PoC:** prototype running in a controlled environment (*sandbox*) against real client data.
* **Estimated ROI calculation:** projected reduction in operational time vs. estimated infrastructure and token cost.
* **Client Go/No-Go** for Phase 2, with scope and price agreed.

Templates: [`templates/blueprint.md`](templates/blueprint.md) · [`templates/roi-calculation.md`](templates/roi-calculation.md)

---

## ⚙️ PHASE 2: Context & Integration (Knowledge Engineering)

**Duration:** 2 to 3 weeks (Sprints 3-4)
**Objective:** Structure the corporate knowledge base and the environment's connections.

### 1. Data Pipeline and RAG (*Retrieval-Augmented Generation*)

* **Ingestion:** build parsers to extract unstructured data (PDF, DOCX, email, audio via ASR).
* **Chunking & embedding:** define the text splitting and vectorisation strategy suited to the company's domain (semantic vs. fixed, overlap, source metadata for citation).
* **VectorDB:** configure the vector store (Qdrant, Pinecone, pgvector, or the client's managed equivalent).
* **Refresh strategy:** define the reindexing cadence (nightly batch vs. incremental via webhook) — the decision that prevents frozen knowledge.

### 2. Integration Protocols and Tools (MCP / APIs)

* Map the APIs and webhooks of legacy systems (CRM, ERP, databases).
* Build connectors via **Model Context Protocol (MCP)** or tool calling so the AI can read from and write to external systems.
* Define the **permission scope per connector** explicitly (read-only vs. read-write) — every write connector starts read-only until Phase 3 approves guardrails.

### 3. Data Quality as a Gate

No pipeline advances to Phase 3 without:

* A sample of 20-30 validation questions (*golden set*) with expected answers.
* An acceptable retrieval recall rate (set the threshold by domain; start by requiring ≥ 85%).
* A PII and sensitive-data review before vectorisation (see [`docs/security-governance.md`](docs/security-governance.md)).

---

## 🤖 PHASE 3: Engineering & Guardrails (Agentic Orchestration)

**Duration:** 3 to 4 weeks (Sprints 5-6)
**Objective:** Build the production-ready agentic system, with resilience and security as the focus.

### 1. Model Topology Orchestration

* Routing strategy: use smaller, faster models for triage and classification, reserving advanced reasoning models for complex tasks — it optimises cost without sacrificing quality where it matters.
* Configure specialist agents (Researcher, Analyst, Reviewer/Critic) with isolated responsibilities and prompts — this avoids a do-everything agent that is hard to debug.
* State the **orchestration pattern** explicitly: single agent with tools, multi-agent supervisor/worker, or a deterministic pipeline with an LLM at specific steps. Pick the simplest one that solves the process (see the Golden Rule).

### 2. Guardrails & Security Implementation

* **Input guardrails:** filters against *prompt injection*, and masking of sensitive data.
* **Output guardrails:** schema validation (strict JSON) and hallucination checks before the answer is sent.
* **Rate limiting & circuit breakers** per external connector, to contain cost and the blast radius of cascading failures.
* **Audit trail:** every input, output and tool decision is logged with a timestamp and an actor — mandatory in regulated sectors.

### 3. Designing the *Human-in-the-Loop* (HITL) Flow

* Define escalation rules: when the agent's answer confidence falls below the threshold (for example < 85%), or the action is irreversible or high-impact (sending an email, a financial transaction, a record change), the case routes to human approval before final execution.
* Classify every agent action as **Autonomous / Prior Approval / Blocked** — this matrix must be approved in writing by the client's sponsor before going to production.

### 4. Testing Before the Move to Production

* Basic load test (expected concurrency in use).
* Light *red-teaming*: prompt injection attempts and system-prompt extraction attempts.
* Regression test against the Phase 2 *golden set* after any prompt or model change.

---

## 🚀 PHASE 4: Scale, Governance & Retainer (Continuous Operation)

**Duration:** Continuous (monthly recurrence)
**Objective:** Monitor performance, optimise cost and extend the model to new processes.

### 1. Observability and AI Ops

* Deploy an LLM monitoring and tracing platform (for example Langfuse, Arize Phoenix, or whatever the client already uses).
* Track SLA metrics: latency per request, cumulative token cost, error and hallucination rate, and volume of human interventions.
* Publish a **monthly delivered-value report** (realized vs. Phase 1 estimated ROI) — it is the main argument for retainer renewal.

### 2. Handoff Model

* Training for the internal technical team (where one exists) on basic maintenance.
* Detailed documentation of *system prompts*, architecture and API endpoints.
* Incident runbook: what to do when the agent hallucinates, when a connector fails, when token cost spikes.

### 3. Transition to Fractional FDE (Retainer)

* Move the contract to the recurring model (10 to 15 hours per week) focused on:
  * Continuous refinement of *prompts* and knowledge bases.
  * Managing and optimising the cloud infrastructure and token budget.
  * Mapping new use cases in the company (restarting the funnel at Phase 0/1, now with trust established).

Per-phase pricing model details: [`docs/pricing-model.md`](docs/pricing-model.md).

---

## 📐 RACI per Phase (solo operation + client stakeholders)

| Phase | FDE (you) | Executive sponsor | Client operational team | Client IT/Security |
| --- | --- | --- | --- | --- |
| 0. Qualification | Responsible | Approves | Consulted | Informed |
| 1. Assessment | Responsible | Approves ROI/Go-No-Go | Consulted (shadowing) | Informed |
| 2. Context | Responsible | Informed | Consulted (data validation) | Approves access |
| 3. Engineering | Responsible | Approves HITL matrix | Tests/validates golden set | Approves production guardrails |
| 4. Scale | Responsible | Approves renewal | Consulted | Consulted (audits) |

---

## 📊 Engagement Success KPIs

| Metric | Where it is measured | Reference target |
| --- | --- | --- |
| Cycle time to first PoC | Phase 1 | ≤ 15 business days |
| Golden-set recall rate | Phase 2 | ≥ 85% |
| Human intervention (HITL) rate | Phase 4 (continuous) | Falling month over month |
| Realized vs. estimated ROI | Phase 4 (continuous) | ≥ 80% of the Phase 1 estimate |
| Retainer renewal rate | Phase 4 | ≥ 70% of active clients |

---

## 🚫 Common Antipatterns (what to avoid)

* **Big bang without a PoC:** skipping Phase 1 and going straight to complex architecture without proving value against real data.
* **Agent without output guardrails:** allowing write actions against production systems before the Autonomous/Approval/Blocked matrix exists.
* **Too many agents:** building a multi-agent topology for a process a single well-structured prompt would solve.
* **RAG without a refresh strategy:** vectorising once and never reindexing — the knowledge base drifts from business reality within weeks.
* **Retainer without a value report:** running Phase 4 without reporting measurable monthly ROI — the number one cause of fractional FDE churn.

---

## 🧰 Solo FDE Delivery Toolkit

To keep execution speed without a development team, adopt the following operational stack (full menu with alternatives in [`docs/reference-stack.md`](docs/reference-stack.md)):

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│           Web interfaces / WhatsApp API / CRMs               │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│                 ORCHESTRATION AND FLOWS                       │
│         n8n (self-hosted/cloud) / LangChain / MCP             │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│               KNOWLEDGE BASE & MEMORY                         │
│             Qdrant / Pinecone / PostgreSQL (pgvector)         │
└──────────────────────────────┬───────────────────────────────┘
                                │
┌──────────────────────────────▼───────────────────────────────┐
│              OBSERVABILITY AND GOVERNANCE                     │
│                Langfuse / Guardrails AI                       │
└─────────────────────────────────────────────────────────────┘
```

> **Solo FDE Golden Rule:** keep the architecture simple in the PoC to prove value fast, and add agentic complexity only where the business process genuinely demands it.

---

## 📎 Quick References

* Go/No-Go checklists per phase: [`checklists/`](checklists)
* Field templates: [`templates/`](templates)
* Pricing model: [`docs/pricing-model.md`](docs/pricing-model.md)
* Governance and security: [`docs/security-governance.md`](docs/security-governance.md)
* Reference stack and alternatives: [`docs/reference-stack.md`](docs/reference-stack.md)
* Adaptation by client size/sector: [`docs/client-profile-adaptation.md`](docs/client-profile-adaptation.md)
