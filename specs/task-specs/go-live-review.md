# Task Spec — Go-Live Review (End of Phase 3)

Executed jointly by `fde-architect`, `fde-guardrails` and `fde-qa`, coordinated by `fde-master`. It is the framework's most critical gate — the move to production.

## Preconditions

- `fde-architect` has delivered `architecture.md` with the topology and model routing defined.
- `fde-guardrails` has delivered `autonomy-matrix.md`, `guardrails.md` and `data-protection-review.md`, with written approval from the client's executive sponsor.

## Steps

1. `fde-qa` runs the full `checklists/go-live-phase3.md` checklist:
   - Guardrails / Autonomy Matrix / Security / Compliance sections → evidence comes from `fde-guardrails`' artifacts.
   - Testing / Observability sections → `fde-qa` executes them directly (golden set, load, red-team, dashboards).
2. Every item marked complete must have an evidence artifact attached — nothing is ticked on trust.
3. If any security or compliance item is outstanding, `fde-guardrails` holds a **veto**: go-live is not approved, whatever the state of the other items.
4. If every item is complete with evidence, `fde-qa` records "GO-LIVE approved" with the date and lists the signatories (FDE plus the client's sponsor).
5. `fde-master` moves the engagement's `state.md` to Phase 4 and delegates to `fde-scale-ops`.

## Postconditions

- System in production with the audit trail live from day one.
- An incident runbook already in place, however preliminary, before the first real use.

## Non-negotiable rule

No commercial schedule pressure justifies skipping a security or compliance item on this checklist. If the client pushes, the standard answer is to compress scope (reduce what goes to production), never to compress the checklist's rigour.
