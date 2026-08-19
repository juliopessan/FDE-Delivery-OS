# Engagement Brain

Persistent operational memory for each client engagement.

## Entity Model

```text
Engagement
├── Objectives
├── Stakeholders
├── Use Cases
├── Requirements
├── Constraints
├── Systems
├── Data Sources
├── Decisions / ADRs
├── Risks
├── Architecture
├── Patterns Used
├── Evaluation Runs
├── Releases
├── Incidents
└── Value Metrics
```

## State Machine

```mermaid
stateDiagram-v2
    [*] --> Qualification
    Qualification --> Assessment: GO
    Qualification --> Closed: NO-GO
    Assessment --> Context
    Context --> Engineering
    Engineering --> ReleaseCandidate
    ReleaseCandidate --> Engineering: Gate Fail
    ReleaseCandidate --> Production: Human Approval
    Production --> Scale
    Scale --> Engineering
    Scale --> Assessment
```

## Memory Layers

1. **Structured State** — the source of truth.
2. **Versioned Artifacts** — approved evidence.
3. **Retrieval Memory** — searchable client context.
4. **Working Context** — ephemeral prompt context.
