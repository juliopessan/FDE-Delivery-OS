# Task Spec — Handoff Protocol Between Phases

Applies to every transition between FDE team agents and phases. Executed by `fde-master`, together with the agent handing over and the agent receiving.

## Preconditions

- The Go/No-Go checklist for the phase being closed exists and is filled in (`checklists/` in the reference repo).
- Every mandatory artifact for the phase is saved under `harness/engagements/<client>/<phase>/`.

## Steps

1. The **handing-over agent** runs (or asks `fde-qa` to run, where applicable) the phase's Go/No-Go checklist.
2. On **NO-GO**: the handing-over agent lists specific, actionable open items; `fde-master` keeps the engagement in the current phase and does not delegate onwards.
3. On **GO**: the handing-over agent writes a handoff summary (`handoff.md`) in the phase folder, containing:
   - The list of artifacts produced, with paths.
   - Key decisions taken and why — especially where the playbook's default was departed from.
   - Non-blocking open items the next phase should know about (for example, "the client has not confirmed X yet, but it does not prevent Phase 2 from starting").
4. `fde-master` updates the engagement's `state.md`: phase completed, date, checklist decision, next phase.
5. `fde-master` delegates to the next phase's agent, passing the path to `handoff.md` as initial context.

## Postconditions

- `state.md` reflects the current phase correctly.
- The receiving agent can start work by reading only the engagement's files, without depending on memory from a previous conversation.

## Special cases

- **Parallel handoff (Phase 3):** `fde-architect` and `fde-guardrails` work simultaneously; `fde-qa` receives the handoff only once **both** have finished and written their artifacts.
- **Return handoff (Phase 4 → Phase 0):** when a new use case surfaces during the retainer, `fde-scale-ops` does not implement it directly — it writes an opportunity note and returns it to `fde-master`, who opens a new sub-engagement starting at Phase 0.
