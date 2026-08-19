# Data Contracts

## Canonical Objects

`EngagementState`, `Requirement`, `Constraint`, `Risk`, `Decision`, `Handoff`, `PatternManifest`, `EvaluationCase`, `EvaluationRun`, `ReleaseManifest`, `Incident`, `Approval`, `ValueMetric`.

Reference schemas (JSON Schema) in [`schemas/`](schemas): `engagement-state.schema.json`, `pattern-manifest.schema.json`, `release-manifest.schema.json`.

## Requirement Example

```yaml
requirement_id: REQ-042
type: functional
statement: "Validate the invoice total before posting to SAP"
priority: must
source:
  type: workshop
  reference: session-03
acceptance_criteria:
  - "A discrepancy above 1,000 is routed to human review"
```

Every material derived fact must carry provenance: source, extractor, timestamp, confidence and human verification.
