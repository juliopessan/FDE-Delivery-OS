"""Phase timing, formatted for a delivery report rather than for a log.

Ported from platform/src/lib/format-elapsed.ts. Runs are stored as ISO strings
in SQLite. A phase that has started but not finished has no end, and the caller
may hold nothing at all for a phase that never ran, so every input here is
optional and an unanswerable question returns None instead of "0s".
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Iterable, Mapping

_HAS_ZONE = re.compile(r"(Z|[+-]\d{2}:?\d{2})$")

_MONTHS_LONG = (
    "January February March April May June "
    "July August September October November December"
).split()
_MONTHS_SHORT = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


def _parse(value: str | None) -> datetime | None:
    """SQLite's CURRENT_TIMESTAMP has no zone marker.

    Without one, "2026-08-17 09:14:22" reads as local time while the value is
    UTC, which shows up in the report as a multi-hour phase.
    """
    if not value:
        return None
    normalized = value if _HAS_ZONE.search(value) else f"{value.replace(' ', 'T')}Z"
    try:
        return datetime.fromisoformat(normalized.replace("Z", "+00:00"))
    except ValueError:
        return None


def format_duration(seconds: float) -> str:
    """"48s", "3m 12s", "1h 04m"."""
    total = max(0, round(seconds))
    if total < 60:
        return f"{total}s"

    minutes, secs = divmod(total, 60)
    if minutes < 60:
        return f"{minutes}m {secs:02d}s"

    hours, mins = divmod(minutes, 60)
    return f"{hours}h {mins:02d}m"


def format_elapsed(started_at: str | None, completed_at: str | None) -> str | None:
    """How long a single phase took. None while it is still running or never ran."""
    start, end = _parse(started_at), _parse(completed_at)
    if start is None or end is None:
        return None
    return format_duration((end - start).total_seconds())


def format_total_elapsed(runs: Iterable[Mapping[str, str | None]]) -> str | None:
    """Total time the agents spent working: the sum of the phase durations.

    Deliberately not wall-clock (last finish minus first start). A phase can be
    re-run later to repair a bad artifact, and wall-clock then reports the gap
    between the two sessions — a real engagement showed "18h 31m" for a pipeline
    that took about three minutes of actual work. Summing the phases answers the
    question a reader is really asking.
    """
    durations = []
    for run in runs:
        start, end = _parse(run.get("startedAt")), _parse(run.get("completedAt"))
        if start is not None and end is not None:
            durations.append((end - start).total_seconds())

    return format_duration(sum(durations)) if durations else None


def format_timestamp(value: str | None) -> str | None:
    """"17 Aug 2026, 09:14" — for stamping when a phase ran, in local time."""
    parsed = _parse(value)
    if parsed is None:
        return None
    local = parsed.astimezone()
    return (
        f"{local.day:02d} {_MONTHS_SHORT[local.month - 1]} {local.year}, "
        f"{local.hour:02d}:{local.minute:02d}"
    )


def format_generated_at(moment: datetime | None = None) -> str:
    """"August 21, 2026 at 10:16 AM" — the stamp on the report itself."""
    local = (moment or datetime.now(timezone.utc)).astimezone()
    hour = local.hour % 12 or 12
    meridiem = "AM" if local.hour < 12 else "PM"
    return (
        f"{_MONTHS_LONG[local.month - 1]} {local.day}, {local.year} "
        f"at {hour}:{local.minute:02d} {meridiem}"
    )
