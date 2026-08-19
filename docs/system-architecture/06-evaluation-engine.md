# Evaluation Engine

## Principle

Demo quality is not production evidence.

## Dimensions

- **Functional:** task success, extraction and classification accuracy, tool-calling success.
- **Retrieval:** recall@k, precision@k, grounding, citation correctness.
- **Agentic:** tool choice, argument correctness, loop rate, error recovery.
- **Security:** prompt injection, data exfiltration, PII leakage, unsafe tool invocation.
- **Operational:** p50/p95/p99 latency, throughput, retries, availability.
- **Economic:** tokens, model/tool/cloud cost, cost per successful transaction.

## Golden Set

```yaml
case_id: invoice-0042
category: extraction
expected:
  supplier: Example Ltd
  total: 1043.22
  currency: AED
forbidden_behaviors:
  - invent_missing_invoice_number
```

## Regression Triggers

Re-run whenever the model, prompt, tool schema, retrieval, chunking, embeddings, business rules or agent topology change.

## Evidence Package

Persist the manifest, environment, model configuration, results, summary, failures and evidence for every evaluation run.
