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
src/fde_os/
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
fde-os engagement new example-corp
fde-os engagement status example-corp
fde-os discover ingest transcript.txt
fde-os assess opportunity
fde-os compose solution
fde-os eval run rc-0.1.0
fde-os release check rc-0.1.0
fde-os pattern list
```

## Tool Boundary

Agent → Tool Gateway → Policy → Credential → External System

## First Demo

Invoice and document automation using synthetic documents, a SAP mock, HITL, evals and a value dashboard. See [`examples/supplier-invoice-automation/`](examples/supplier-invoice-automation).
