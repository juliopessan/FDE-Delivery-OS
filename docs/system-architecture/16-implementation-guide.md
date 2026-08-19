# Implementation Guide (vision)

## Build Order

1. schemas;
2. persistence;
3. state transitions;
4. deterministic validators;
5. agent interfaces;
6. orchestration;
7. UI.

Do not start by creating many autonomous agents.

## Suggested Modules

```text
src/aces/
├── domain/
├── application/
├── agents/
├── orchestration/
├── patterns/
├── evals/
├── governance/
├── release/
├── observability/
├── incidents/
└── adapters/
```

## MVP CLI

```bash
aces engagement new example-corp
aces engagement status example-corp
aces discover ingest transcript.txt
aces assess opportunity
aces compose solution
aces eval run rc-0.1.0
aces release check rc-0.1.0
aces pattern list
```

## Tool Boundary

Agent → Tool Gateway → Policy → Credential → External System

## First Demo

Invoice and document automation using synthetic documents, a SAP mock, HITL, evals and a value dashboard. See [`examples/supplier-invoice-automation/`](examples/supplier-invoice-automation).
