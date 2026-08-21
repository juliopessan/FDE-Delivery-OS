"""The execution roster of FDE OS.

Each agent owns one phase (or a cross-cutting concern) of the delivery
pipeline. Phases carry plain, functional English names rather than an acronym.

Prompt text lives in prompts/*.md rather than in this file. A prompt is text,
not code: as a Markdown file it is editable, diffable and greppable without
escaping, and changing what an agent is told does not mean touching Python. The
shared house style and closing-section instructions are appended to every
agent's body here, so a change to either lands on all nine at once.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from functools import cache
from importlib import resources

_PROMPTS = "prompts"


def _read(name: str) -> str:
    return resources.files(__package__).joinpath(_PROMPTS, name).read_text("utf-8")


@cache
def report_style_guide() -> str:
    """House style every artifact is written to."""
    return _read("_report_style.md")


@cache
def closing_section_instructions() -> str:
    """The section every artifact ends with, addressed to the client sponsor."""
    return _read("_closing_section.md")


@cache
def extract_brief_prompt() -> str:
    """Turns a client's discovery document into the six intake fields."""
    return _read("extract_brief.md")


@cache
def master_synthesis_prompt() -> str:
    """The orchestrator that turns nine artifacts into one executive summary."""
    return _read("master.md")


@dataclass(frozen=True)
class AgentDefinition:
    key: str
    name: str
    phase_key: str
    phase_label: str
    mission: str
    #: Informational only — actual routing and fallback live in llm_client.
    model: str
    #: Present-continuous verbs shown while this agent's phase run is active.
    #: Several per agent, cycled in the UI, so a long-running phase reads as
    #: work in progress rather than a stuck label.
    active_verbs: tuple[str, ...]

    @property
    def system_prompt(self) -> str:
        body = _read(f"{self.key.replace('-', '_')}.md")
        return f"{body}{report_style_guide()}\n{closing_section_instructions()}"


@cache
def agent_roster() -> tuple[AgentDefinition, ...]:
    """The nine agents, in the order the pipeline runs them."""
    raw = json.loads(_read("roster.json"))
    return tuple(
        AgentDefinition(
            key=a["key"],
            name=a["name"],
            phase_key=a["phaseKey"],
            phase_label=a["phaseLabel"],
            mission=a["mission"],
            model=a["model"],
            active_verbs=tuple(a["activeVerbs"]),
        )
        for a in raw
    )
