# Pricing Model — Solo FDE

Pricing per phase, aligned to the value delivered at each step of the A.C.E.S. methodology, not by the hour.

**The fixed fee for each phase is never set off the top of your head.** It must derive from the effort estimate produced by `fde-capacity-planner` (WBS + PERT, see `templates/effort-estimate.md`) — a fixed fee with no hour estimate behind it is guesswork dressed as method, and it is the most common way a solo FDE erodes their own margin.

## Recommended structure

| Phase | Model | Rationale |
| --- | --- | --- |
| 0. Qualification | Free (max. 3-5 days) or a nominal fee | Lowers the barrier to entry; works as a qualified lead magnet |
| 1. Assessment | Fixed fee | Scope is clear and short (2-3 weeks); protects the FDE from scope creep |
| 2. Context | Fixed fee or milestone | Depends on data and system volume — reprice if scope changed after Phase 1 |
| 3. Engineering | Fixed fee with a "production approved" milestone | Ties final payment to the client's approval of the HITL matrix |
| 4. Scale | Monthly retainer (10-15h/week) | Recurring revenue; renewal conditional on the ROI report |

## Pricing rules

1. **Never bill by the hour in Phases 1-3.** Hourly billing rewards slowness; a fixed fee rewards efficiency and protects the solo FDE's margin — but the fixed fee itself comes from hours estimated internally (`fde-capacity-planner`); the client only ever sees the agreed price.
2. **Reprice at each phase transition**, never mid-phase — and always anchor repricing to a new estimate, not to a hunch that it got more expensive.
3. **Scope-change clause:** any new use case identified after the Phase 1 Go/No-Go restarts the funnel at Phase 0, even informally.
4. **Foundation discount:** the Phase 1 price can be partly credited against the retainer contract (Phase 4) as a conversion incentive — never credited against the Phase 3 price, since production is the FDE's point of greatest technical risk.
5. **Retainer with a renewal floor:** contracts shorter than 6 months tend not to cover a solo FDE's cost of context-switching between clients — avoid them.

## Range reference (adjust by market, region and client size)

| Item | Suggested range |
| --- | --- |
| Phase 1 (Assessment, 2-3 weeks) | 1 to 2 equivalent monthly retainers |
| Phases 2+3 (Context+Engineering, 5-7 weeks) | 3 to 5 equivalent monthly retainers |
| Phase 4 (Retainer, 10-15h/week) | Set by the local market; adjust annually |

> Treat the figures above as a relative anchor (multiples of your own retainer), not as a fixed price list — adjust to the client's size and to the cost of living in your region.
