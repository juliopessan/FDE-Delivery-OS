# Test Strategy

## Layers

- **Unit:** scoring, state transitions, policy, schema and cost.
- **Contract:** agent I/O, tool gateway, pattern and release manifests.
- **Agent Behaviour:** tool selection, forbidden actions, escalation.
- **Workflow:** discovery → prototype, prototype → release, incident → remediation.
- **Evaluation:** golden sets, security, regression, performance.
- **Resilience:** model and tool timeouts, malformed responses, provider outage, duplicate events.

## Critical Invariants

- A security veto cannot be bypassed.
- Production tool actions require policy permission.
- An approval payload cannot change after it is approved.
- Client A's data cannot enter Client B's context.
