"""Every model call the pipeline makes goes through here.

Ported from platform/src/lib/agents/llm-client.ts. Gemini 3.7 Flash first —
fast and cheap, and the roster runs ten sequential calls per engagement —
falling back to Claude Haiku 4.5 when Gemini errors or no key is configured.
Callers never need to know which model answered; the returned `model` records
it for the audit trail, persisted per phase run.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass

log = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-3.7-flash"
HAIKU_MODEL = "claude-haiku-4-5-20251001"

#: Without a timeout a hung request has no way to fail, and a stalled pipeline
#: looks identical to a slow one.
CALL_TIMEOUT_SECONDS = 90.0


@dataclass(frozen=True)
class GenerateResult:
    text: str
    model: str
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    #: True when the model hit the output ceiling and the text is cut off
    #: mid-thought.
    truncated: bool = False


class NoModelKeyError(RuntimeError):
    """Neither provider is configured."""


def generate_text(*, system: str, prompt: str, max_tokens: int) -> GenerateResult:
    """Primary/fallback routing for the agent pipeline."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            return _with_gemini(
                gemini_key, system=system, prompt=prompt, max_tokens=max_tokens
            )
        except Exception as err:  # noqa: BLE001 — any Gemini failure falls back
            log.warning("Gemini call failed, falling back to Haiku: %s", err)

    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if not anthropic_key:
        raise NoModelKeyError(
            "Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set. "
            "Add at least one to platform/.env.local."
        )

    return _with_haiku(
        anthropic_key, system=system, prompt=prompt, max_tokens=max_tokens
    )


def _with_gemini(
    api_key: str, *, system: str, prompt: str, max_tokens: int
) -> GenerateResult:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key, http_options={"timeout": int(CALL_TIMEOUT_SECONDS * 1000)})
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system,
            max_output_tokens=max_tokens,
        ),
    )

    text = response.text or ""
    if not text.strip():
        # Gemini 3.x spends part of max_output_tokens on internal reasoning
        # ("thoughts"). A tight budget can be consumed entirely by thinking,
        # leaving no visible answer at all.
        raise RuntimeError(
            f"Gemini returned an empty response (max_tokens={max_tokens} "
            "may have been consumed by reasoning tokens)."
        )

    usage = response.usage_metadata
    candidates = response.candidates or []
    finish = getattr(candidates[0], "finish_reason", None) if candidates else None

    return GenerateResult(
        text=text,
        model=GEMINI_MODEL,
        prompt_tokens=getattr(usage, "prompt_token_count", None),
        completion_tokens=getattr(usage, "candidates_token_count", None),
        truncated=str(finish).endswith("MAX_TOKENS"),
    )


def _with_haiku(
    api_key: str, *, system: str, prompt: str, max_tokens: int
) -> GenerateResult:
    import anthropic

    client = anthropic.Anthropic(api_key=api_key, timeout=CALL_TIMEOUT_SECONDS)
    message = client.messages.create(
        model=HAIKU_MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )

    text = next((b.text for b in message.content if b.type == "text"), "")

    return GenerateResult(
        text=text,
        model=HAIKU_MODEL,
        prompt_tokens=message.usage.input_tokens,
        completion_tokens=message.usage.output_tokens,
        truncated=message.stop_reason == "max_tokens",
    )
