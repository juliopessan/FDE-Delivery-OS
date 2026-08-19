# Pattern Library

## Objective

Create compound delivery: every engagement improves future delivery without leaking client-specific information.

## Structure of a Pattern

```text
patterns/enterprise-rag/
├── pattern.yaml
├── README.md
├── architecture/
├── src-template/
├── infra/
├── evals/
├── guardrails/
├── observability/
├── cost-model/
└── runbook/
```

## Initial Catalogue

enterprise-rag, document-processing, human-approval, tool-calling-api, sql-analytics-agent, service-management-agent, customer-service-agent, multi-agent-review, async-long-running-workflow, private-network-ai, pii-redaction, model-router, agent-memory, incident-diagnosis.

## Maturity

Experimental → Validated → Client-tested → Production-proven → Preferred

## Promotion Flow

```mermaid
flowchart LR
    E[Engagement Asset] --> S[Sanitise]
    S --> G[Generalise]
    G --> T[Test]
    T --> R[Security Review]
    R --> P[Pattern PR]
    P --> A[Human Approval]
    A --> L[Library]
```
