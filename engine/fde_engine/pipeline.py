"""The nine-agent pipeline.

Ported from platform/src/lib/agents/run-pipeline.ts. Deliberately sequential:
each agent reads every artifact produced before it, which is the whole point of
the roster order and the reason context grows from about 1.5k tokens at the
first agent to 39k at the ninth.
"""

from __future__ import annotations

import logging
import sqlite3

from . import db as store
from .llm_client import GenerateResult, generate_text
from .render import PhaseReport, render_consolidated_report
from .roster import AgentDefinition, agent_roster, master_synthesis_prompt

log = logging.getLogger(__name__)

#: Output ceiling per agent artifact. Generous on purpose: Gemini 3.x bills its
#: internal reasoning against this same budget, and on a real engagement
#: reasoning ran to ~1.3k tokens while the visible artifact ran past 7.9k —
#: enough to clip a late-pipeline agent mid-sentence at the previous 8k ceiling.
AGENT_MAX_TOKENS = 24_000

#: The executive summary is a synthesis, not a full artifact — short by design.
SYNTHESIS_MAX_TOKENS = 8_000


def _engagement_brief(engagement: dict[str, object]) -> str:
    def field(name: str) -> str:
        return str(engagement.get(name) or "Not provided")

    summary = f"""## Engagement Brief

- Customer: {engagement.get("customerName")}
- Industry: {field("industry")}
- Company size: {field("companySize")}
- Stated objective: {engagement.get("objective")}
- Current baseline / pain: {field("currentBaseline")}
- Constraints: {field("constraints")}"""

    intake = str(engagement.get("rawIntake") or "").strip()
    raw = (
        "\n\n## Full Discovery Intake (verbatim client document — treat as the "
        "primary source of truth; the summary fields above are a condensed "
        f"excerpt of this document)\n\n{intake}"
        if intake
        else ""
    )

    return (
        f"{summary}{raw}\n\nWork strictly from the facts above. Where you need a "
        "fact that is not\nprovided, say so explicitly rather than inventing it."
    )


def _joined(phase_reports: list[PhaseReport]) -> str:
    return "\n\n---\n\n".join(
        f"### {p.phase_label} — {p.agent_name}\n\n{p.output}" for p in phase_reports
    )


def _run_agent(
    agent: AgentDefinition, brief: str, prior: list[PhaseReport]
) -> GenerateResult:
    context = (
        f"\n\n## Prior phase outputs in this engagement (for context)\n\n{_joined(prior)}"
        if prior
        else ""
    )

    result = generate_text(
        system=agent.system_prompt,
        prompt=f"{brief}{context}\n\nProduce your artifact now.",
        max_tokens=AGENT_MAX_TOKENS,
    )

    if result.truncated:
        log.warning(
            'Agent "%s" hit the %d-token output ceiling — its artifact is cut '
            "off mid-thought.",
            agent.key,
            AGENT_MAX_TOKENS,
        )

    return result


def _synthesize_and_render(
    conn: sqlite3.Connection,
    engagement: dict[str, object],
    phase_reports: list[PhaseReport],
    version: int,
) -> str:
    """Master orchestrator, then the HTML, then the stored report row."""
    engagement_id = str(engagement["id"])
    log.info("engagement=%s version=%d starting master synthesis", engagement_id, version)

    synthesis = generate_text(
        system=master_synthesis_prompt(),
        prompt=(
            f"{_engagement_brief(engagement)}\n\n## Completed phase reports\n\n"
            f"{_joined(phase_reports)}"
        ),
        max_tokens=SYNTHESIS_MAX_TOKENS,
    )

    if synthesis.truncated:
        log.warning(
            "Executive summary hit the %d-token ceiling and is cut off.",
            SYNTHESIS_MAX_TOKENS,
        )

    html = render_consolidated_report(
        engagement=engagement,
        executive_summary=synthesis.text,
        phase_reports=phase_reports,
    )
    log.info(
        "engagement=%s version=%d rendered %d chars", engagement_id, version, len(html)
    )

    store.insert_report(
        conn, engagement_id=engagement_id, version=version, html=html
    )
    return synthesis.text


def run_engagement_pipeline(
    conn: sqlite3.Connection, engagement_id: str
) -> str:
    """Run all nine agents in order, then synthesize and store the report."""
    engagement = store.get_engagement(conn, engagement_id)
    brief = _engagement_brief(engagement)
    prior: list[PhaseReport] = []

    for agent in agent_roster():
        store.set_engagement_phase(conn, engagement_id, agent.phase_key)
        run_id, started_at = store.start_phase_run(
            conn,
            engagement_id=engagement_id,
            phase_key=agent.phase_key,
            agent_key=agent.key,
            agent_name=agent.name,
            model=agent.model,
        )

        try:
            result = _run_agent(agent, brief, prior)
        except Exception as err:
            store.fail_phase_run(conn, run_id, str(err))
            raise

        completed_at = store.complete_phase_run(
            conn,
            run_id,
            model=result.model,
            output_markdown=result.text,
            prompt_tokens=result.prompt_tokens,
            completion_tokens=result.completion_tokens,
        )

        prior.append(
            PhaseReport(
                agent_name=agent.name,
                phase_label=agent.phase_label,
                output=result.text,
                started_at=started_at,
                completed_at=completed_at,
            )
        )

    summary = _synthesize_and_render(conn, engagement, prior, 1)
    store.set_engagement_phase(conn, engagement_id, "scale", status="completed")
    return summary


def regenerate_report(conn: sqlite3.Connection, engagement_id: str) -> str:
    """Re-synthesize and re-render from artifacts already paid for.

    Useful after fixing the report template or a stored phase output. Costs one
    synthesis call rather than a full pipeline run.
    """
    engagement = store.get_engagement(conn, engagement_id)
    rows = store.completed_runs(conn, engagement_id)

    phase_reports: list[PhaseReport] = []
    for agent in agent_roster():
        # An engagement re-run — or a repair of a truncated phase — leaves
        # several rows per agent. Taking the first match would rebuild the
        # report from whichever attempt the database happened to return first,
        # including the truncated one that prompted the repair. Take the newest.
        matches = [r for r in rows if r["agent_key"] == agent.key]
        if not matches:
            raise LookupError(f"Missing completed output for agent {agent.key}")
        run = max(matches, key=lambda r: r["completed_at"])
        phase_reports.append(
            PhaseReport(
                agent_name=agent.name,
                phase_label=agent.phase_label,
                output=run["output_markdown"],
                started_at=run["started_at"],
                completed_at=run["completed_at"],
            )
        )

    version = store.next_report_version(conn, engagement_id)
    return _synthesize_and_render(conn, engagement, phase_reports, version)
