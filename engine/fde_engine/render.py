"""The consolidated Enterprise Report.

Ported from platform/src/lib/report/render.ts. The stylesheet and the Mermaid
bootstrap were lifted out of that file verbatim into assets/report.css and
assets/report.js — they were always payload rather than logic, and as files
they are editable as CSS and JavaScript instead of as a string inside a
template.

Output is deliberately byte-identical to the TypeScript renderer apart from the
generated-at stamp, so the two can be diffed against the same stored artifacts
while both exist.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from importlib import resources
from urllib.parse import quote

from .elapsed import (
    format_elapsed,
    format_generated_at,
    format_timestamp,
    format_total_elapsed,
)
from .markdown import markdown_to_html

_FAVICON = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
    '<rect width="32" height="32" fill="#14150F"/>'
    '<path fill="#C4F04C" d="M10 8h13v4H14v4h8v4h-8v8h-4z"/></svg>'
)

# encodeURIComponent leaves these unescaped; Python's quote does not by default.
_URI_SAFE = "!~*'()-_."

_SLUG_STRIP = re.compile(r"[^a-z0-9]+")
_SLUG_EDGES = re.compile(r"(^-|-$)")


@dataclass(frozen=True)
class PhaseReport:
    """One agent's artifact, as it enters the report."""

    agent_name: str
    phase_label: str
    output: str
    #: Optional so a report can still be rendered from artifacts with no timing.
    started_at: str | None = None
    completed_at: str | None = None


def _asset(name: str) -> str:
    return resources.files(__package__).joinpath("assets", name).read_text("utf-8")


def _slug(value: str) -> str:
    return _SLUG_EDGES.sub("", _SLUG_STRIP.sub("-", value.lower()))


def _phase_stamp(phase: PhaseReport) -> str:
    """When a phase ran and how long it took.

    Rendered only when the artifact carries timing — reports regenerated from
    older runs may not.
    """
    ran = format_timestamp(phase.started_at)
    took = format_elapsed(phase.started_at, phase.completed_at)
    if not ran and not took:
        return ""
    parts = [p for p in (ran, f"{took} elapsed" if took else None) if p]
    return f'<div class="phase-stamp mono">{" &middot; ".join(parts)}</div>'


def render_consolidated_report(
    *,
    engagement: dict[str, object],
    executive_summary: str,
    phase_reports: list[PhaseReport],
    now: datetime | None = None,
) -> str:
    """Assemble the single self-contained HTML file handed to the client."""
    generated_at = format_generated_at(now)

    toc = "\n".join(
        f'<a class="toc-link" href="#{_slug(p.phase_label)}-{i}">'
        f'<span class="toc-index">{i + 1:02d}</span>'
        f"<span>{p.phase_label}</span>"
        f'<span class="toc-agent">{p.agent_name}</span></a>'
        for i, p in enumerate(phase_reports)
    )

    sections = "\n".join(
        f"""
      <section class="phase-section" id="{_slug(p.phase_label)}-{i}">
        <div class="phase-heading">
          <span class="phase-index">{i + 1:02d}</span>
          <div>
            <div class="eyebrow">{p.phase_label}</div>
            <h2 class="agent-title">{p.agent_name}</h2>
          </div>
        </div>
        {_phase_stamp(p)}
        <div class="prose">{markdown_to_html(p.output)}</div>
      </section>"""
        for i, p in enumerate(phase_reports)
    )

    timings = [
        {"startedAt": p.started_at, "completedAt": p.completed_at}
        for p in phase_reports
    ]
    total_elapsed = format_total_elapsed(timings)
    runtime_item = (
        f'<div class="meta-item"><div class="label">Agent runtime</div>'
        f'<div class="value">{total_elapsed}</div></div>'
        if total_elapsed
        else ""
    )

    customer = engagement.get("customerName") or ""
    objective = engagement.get("objective") or ""
    industry = engagement.get("industry") or "—"
    company_size = engagement.get("companySize") or "—"

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{customer} — FDE OS Enterprise Report</title>
<!-- Inlined as a data URI so the report stays a single self-contained file:
     it is opened from disk and emailed around, where a linked icon would 404. -->
<link rel="icon" href="data:image/svg+xml,{quote(_FAVICON, safe=_URI_SAFE)}">
<style>
{_asset("report.css")}</style>
<script type="module">
{_asset("report.js")}</script>
</head>
<body>
  <header class="masthead">
    <div class="brand">
      <div class="brand-badge">F</div>
      <span class="brand-name mono">FDE OS</span>
    </div>
    <div class="masthead-right">
      <span class="masthead-meta">Enterprise Report</span>
      <button type="button" class="export-btn" onclick="window.print()">Export PDF</button>
    </div>
  </header>

  <main>
    <div class="eyebrow">Consolidated Delivery Report</div>
    <h1 class="report-title">{customer}</h1>
    <p class="report-objective">{objective}</p>
    <p class="report-sub">Generated by the FDE OS agent pipeline — every phase below was produced independently by the specialist agent named in its heading, then synthesized by the Master Orchestrator into the executive summary above.</p>

    <div class="meta-row">
      <div class="meta-item"><div class="label">Customer</div><div class="value">{customer}</div></div>
      <div class="meta-item"><div class="label">Industry</div><div class="value">{industry}</div></div>
      <div class="meta-item"><div class="label">Company size</div><div class="value">{company_size}</div></div>
      <div class="meta-item"><div class="label">Generated</div><div class="value">{generated_at}</div></div>
      <div class="meta-item"><div class="label">Phases run</div><div class="value">{len(phase_reports)}</div></div>
      {runtime_item}
    </div>

    <div class="exec-summary">
      <div class="eyebrow">Executive Summary</div>
      <div class="prose">{markdown_to_html(executive_summary)}</div>
    </div>

    <div class="toc">
      <div class="eyebrow">Pipeline Contents</div>
      <div style="margin-top:16px;">{toc}</div>
    </div>

    {sections}
  </main>

  <footer class="report-footer">
    <span class="mono">FDE OS — Agentic Delivery Operating System</span>
    <span class="mono">Generated {generated_at}</span>
  </footer>
</body>
</html>"""
