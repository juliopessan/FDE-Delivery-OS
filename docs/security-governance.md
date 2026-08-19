# Governance and Security

Applies from Phase 2 (Context) onwards, and is mandatory before any move to production in Phase 3.

## 0. Inherited-Permission Principle (no separate service account)

* The agent must **never** operate with broader access than the FDE (or the user it acts on behalf of) already holds. If the FDE cannot write to a system, neither can the agent — do not create a service account with expanded privileges "so the agent works better".
* Every agent action must be attributable to an individual identity in the audit trail (see section 5) — never to a generic or shared account.
* When the FDE loses access to a system (contract end, revocation), the agent's access to that system must be revoked automatically.

## 1. Data Protection / Personal Data

* Before ingestion, map whether the documents or data contain personal or sensitive data (national ID numbers, health data, personal financial data, biometrics).
* Prefer **masking or anonymisation at ingestion**, not only at output — personal data should not reach the VectorDB at all unless it is strictly necessary for the task.
* Define and document the **legal basis** for processing (contract performance, legitimate interest, and so on) with the client's DPO, where one exists.
* Define **log retention** (agent inputs and outputs) with an explicit period — never "forever by default".

## 2. Input Guardrails

* Sanitisation against *prompt injection* (malicious content embedded in documents or emails the agent processes).
* Size limits and *rate limiting* per user or session.
* A clear separation between **system instructions** (trusted) and **data content** (untrusted) in every dynamically built prompt.

## 3. Output Guardrails

* Structured schema validation (JSON Schema or equivalent) before any output is consumed by another system.
* Hallucination checks: for RAG-based answers, require a source citation and reject answers with no grounding in the golden set or retrieved context.
* A sensitive-content filter before any output visible to an end user or sent to a third party.

## 4. Action Autonomy Matrix

Every action an agent can perform must be classified and approved in writing by the client's sponsor:

| Class | Definition | Example | Approval required |
| --- | --- | --- | --- |
| **Autonomous** | Reversible, low impact, no cost or sensitive data involved | Summarise a document, classify a ticket | None (logging only) |
| **Prior Approval** | Irreversible or medium-to-high impact | Send an email, create a CRM record | A human confirms before execution (HITL) |
| **Blocked** | Financial action, data deletion, critical configuration change | Transfer, hard delete, permission change | Never automated by the agent |

### Additional dimension: environment-sensitive autonomy

The same action can carry a different class depending on where it runs — do not treat autonomy as a global constant of the system:

| Environment | Rule |
| --- | --- |
| **Sandbox / PoC / dev** | The Prior Approval class can be relaxed to "Autonomous with logging" — the data is not real, or the impact is isolated and reversible. |
| **Production** | The approved matrix applies exactly as defined — no action changes class automatically, however clean the sandbox history has been. |

Promotion from sandbox to production never inherits the sandbox's permissiveness — each environment is reclassified (see `checklists/go-live-phase3.md`).

## 5. Audit Trail

* Log: timestamp, actor (user/system), input, tools called, output, guardrail decision (approved/blocked/escalated).
* Audit logs must not be editable by the agent itself.
* Define an incident response plan: what to do in case of a hallucination with real impact, a data leak, or unexpected token cost.

## 6. Minimum checklist before production

See [`checklists/go-live-phase3.md`](../checklists/go-live-phase3.md).
