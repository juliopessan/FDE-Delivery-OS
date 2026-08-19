# Incident Operations

## Categories

Model regression, provider outage, tool or API failure, retrieval problem, security event, cost anomaly, performance degradation, incorrect business action.

## Flow

```mermaid
flowchart TD
    A[Alert] --> T[Triage]
    T --> C[Correlate Traces + Release Diff]
    C --> H[Rank Hypotheses]
    H --> S[Select a Safe Action]
    S --> D{Impact}
    D -->|Low| F[Reversible Fix]
    D -->|High| AP[Human Approval]
    AP --> F
    F --> V[Verify]
    V --> P[Postmortem]
    P --> L[Update Pattern/Eval/Runbook]
```

Agents can gather evidence, rank causes and prepare rollback commands. Rollback in production remains policy-controlled.
