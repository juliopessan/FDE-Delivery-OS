# Adapting the A.C.E.S. Methodology by Client Profile

The A.C.E.S. methodology is agnostic to sector and company size — the 4 phases (plus Phase 0) do not change. What changes is the **depth, formality and duration** of each phase. Use this document to calibrate before closing scope in Phase 0.

## 1. Axes of adaptation

| Axis | Question to answer in Phase 0 |
| --- | --- |
| Size | How many employees, how much revenue? Is there a formal IT budget? |
| Sector/regulation | Is the sector regulated (healthcare, financial, legal, public) or not? |
| Digital maturity | Does the client already use APIs and integrations, or is everything manual and spreadsheet-based? |
| Decision structure | Is there a single decision-maker, or does a committee or compliance have to approve? |

## 2. Calibrating by Size

### Small business / SMB (up to ~100 employees)

- **Phases 0-1:** compress into 1 week; the decision-maker is usually the owner or a partner.
- **Phase 2:** favour a managed (SaaS) stack over self-hosted — the client has no IT team to run its own infrastructure.
- **Phase 3:** guardrails remain mandatory, but the autonomy matrix can be more permissive (lower regulatory exposure, faster decisions).
- **Phase 4:** a smaller retainer (5-8h/week) is usually enough; report ROI in cash-flow language, not technical metrics.

### Mid-market (100-1,000 employees)

- Follow the playbook as written — this is the methodology's default target profile.
- Expect an executive sponsor distinct from the operational user (one more stakeholder in the RACI).
- IT and Security already exist as formal functions — involve them from Phase 2, not only in Phase 3.

### Large company / Enterprise (1,000+ employees)

- **Phase 0:** extend to 2-3 weeks; multiple decision-makers, and possibly a formal procurement process (RFP).
- **Phase 1:** the PoC often has to run in a sandbox isolated from the corporate network — negotiate that explicitly in the SOW.
- **Phase 2:** integration goes through internal platform and data teams rather than direct FDE access to systems — add waiting time for access to the schedule.
- **Phase 3:** guardrails, auditing and the autonomy matrix tend to require formal approval from a security or architecture committee — treat it as a mandatory gate, not an optional one.
- **Phase 4:** the retainer tends to become a procurement contract rather than a direct personal one; consider a company structure for invoicing.
- A solo FDE can rarely sustain several enterprise clients at once — prioritise 1-2 large accounts at a time.

## 3. Calibrating by Sector

| Sector | Main adjustment |
| --- | --- |
| Healthcare | Data-protection law plus health-data specific rules; HITL is almost always mandatory for any action with clinical impact; never classify clinical actions as Autonomous |
| Financial | Auditing and log trails are a regulatory requirement, not optional; validate with compliance before any write action against transactional systems |
| Legal | Hallucination is expensive — the golden set must be larger (50+ cases) with a higher required recall (≥ 95%); every output must cite a source |
| Retail/E-commerce | Typically less regulated — focus can go straight to volume and latency (end-customer response SLA) |
| Public sector | Formal procurement from Phase 0 onwards; transparency and explainability of the agent's decisions are usually a requirement, not just performance |
| Industry/Manufacturing | Processes tend to fall under "Rigid and repetitive" (Phase 1 matrix) — check that Gen AI really is the right solution before selling the engagement |

## 4. Quick decision rule

Before closing Phase 0, answer:

1. **Is this a regulated process?** → If so, Phase 3 (guardrails and auditing) cannot be reduced, whatever the client's size.
2. **Does the client have its own IT?** → If not, favour a managed stack and simplify the Phase 4 handover (there will be no internal team to receive the runbook).
3. **Is there a single decision-maker?** → If not, extend Phase 0 and formalise the RACI in writing before starting Phase 1.

> The framework does not change shape — what changes is how much you formalise, who you involve and how long each phase takes. Never skip Phase 3 (guardrails) to go faster, whatever the client profile.
