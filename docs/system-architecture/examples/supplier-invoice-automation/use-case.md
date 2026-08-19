# Demo — Supplier Invoice Automation

12,000 invoices per month; baseline handling time of 14 minutes.

```mermaid
flowchart LR
    D[Invoice] --> X[Document Extraction]
    X --> V[Deterministic Validation]
    V --> L[LLM Interpretation]
    L --> R{Confidence / Rule}
    R -->|Discrepancy| H[Human Review]
    R -->|Approved| A[Approval Gate]
    H --> A
    A --> S[SAP Mock]
    S --> O[Observability + Value]
```

Evaluation: field accuracy ≥95%, zero SAP postings without approval, p95 under 5s excluding HITL, cost per document below the threshold, prompt-injection tests passed.
