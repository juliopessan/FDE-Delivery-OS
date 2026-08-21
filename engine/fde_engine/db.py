"""The same SQLite file the Next app reads.

There is no ORM here on purpose. The schema is owned by Drizzle in
platform/src/lib/db/schema.ts and migrated from there; this module reads and
writes those tables and nothing else. A second definition of the same schema
would be a second thing to keep in step.

Column names are snake_case on disk and camelCase in the app, because Drizzle
maps them. Rows come out of here in the camelCase shape the renderer expects,
so the boundary is crossed once, here.
"""

from __future__ import annotations

import os
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

#: nanoid's default alphabet and length, so ids from either runtime look alike.
_ID_ALPHABET = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"


def new_id(size: int = 21) -> str:
    return "".join(secrets.choice(_ID_ALPHABET) for _ in range(size))


def now_iso() -> str:
    """The ISO-8601 stamp the app writes, so both runtimes sort together."""
    return (
        datetime.now(timezone.utc)
        .isoformat(timespec="milliseconds")
        .replace("+00:00", "Z")
    )


def default_db_path() -> Path:
    """platform/local.db, unless FDE_DB_PATH says otherwise.

    The engine is a sibling of the app rather than a service with its own
    store: the engagement data belongs to whoever is running the pipeline, and
    it stays on their machine either way.
    """
    if env := os.environ.get("FDE_DB_PATH"):
        return Path(env).expanduser()
    return Path(__file__).resolve().parents[2] / "platform" / "local.db"


def default_env_path() -> Path:
    """platform/.env.local, unless FDE_ENV_FILE says otherwise.

    Deliberately not derived from the database path. The keys belong to the
    app, the database is just data, and pointing --db at a copy must not take
    the credentials with it.
    """
    if env := os.environ.get("FDE_ENV_FILE"):
        return Path(env).expanduser()
    return Path(__file__).resolve().parents[2] / "platform" / ".env.local"


def connect(path: Path | None = None) -> sqlite3.Connection:
    resolved = path or default_db_path()
    if not resolved.exists():
        raise FileNotFoundError(
            f"No engagement database at {resolved}. "
            "Run the Next app once to create it, or set FDE_DB_PATH."
        )
    conn = sqlite3.connect(resolved, isolation_level=None)
    conn.row_factory = sqlite3.Row
    return conn


def get_engagement(conn: sqlite3.Connection, engagement_id: str) -> dict[str, object]:
    row = conn.execute(
        "SELECT * FROM engagements WHERE id = ?", (engagement_id,)
    ).fetchone()
    if row is None:
        raise LookupError(f"Engagement not found: {engagement_id}")
    return {
        "id": row["id"],
        "customerName": row["customer_name"],
        "industry": row["industry"],
        "companySize": row["company_size"],
        "objective": row["objective"],
        "currentBaseline": row["current_baseline"],
        "constraints": row["constraints"],
        "rawIntake": row["raw_intake"],
        "phase": row["phase"],
        "status": row["status"],
    }


def set_engagement_phase(
    conn: sqlite3.Connection, engagement_id: str, phase: str, status: str | None = None
) -> None:
    if status is None:
        conn.execute(
            "UPDATE engagements SET phase = ?, updated_at = ? WHERE id = ?",
            (phase, now_iso(), engagement_id),
        )
    else:
        conn.execute(
            "UPDATE engagements SET phase = ?, status = ?, updated_at = ? WHERE id = ?",
            (phase, status, now_iso(), engagement_id),
        )


def start_phase_run(
    conn: sqlite3.Connection,
    *,
    engagement_id: str,
    phase_key: str,
    agent_key: str,
    agent_name: str,
    model: str,
) -> tuple[str, str]:
    """Insert a running row and return (run_id, started_at)."""
    run_id, started_at = new_id(), now_iso()
    conn.execute(
        "INSERT INTO phase_runs (id, engagement_id, phase_key, agent_key, agent_name,"
        " status, model, started_at) VALUES (?, ?, ?, ?, ?, 'running', ?, ?)",
        (run_id, engagement_id, phase_key, agent_key, agent_name, model, started_at),
    )
    return run_id, started_at


def complete_phase_run(
    conn: sqlite3.Connection,
    run_id: str,
    *,
    model: str,
    output_markdown: str,
    prompt_tokens: int | None,
    completion_tokens: int | None,
) -> str:
    completed_at = now_iso()
    conn.execute(
        "UPDATE phase_runs SET status = 'completed', model = ?, output_markdown = ?,"
        " prompt_tokens = ?, completion_tokens = ?, completed_at = ? WHERE id = ?",
        (
            model,
            output_markdown,
            prompt_tokens,
            completion_tokens,
            completed_at,
            run_id,
        ),
    )
    return completed_at


def fail_phase_run(conn: sqlite3.Connection, run_id: str, message: str) -> None:
    conn.execute(
        "UPDATE phase_runs SET status = 'failed', error_message = ?, completed_at = ?"
        " WHERE id = ?",
        (message, now_iso(), run_id),
    )


def completed_runs(conn: sqlite3.Connection, engagement_id: str) -> list[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM phase_runs WHERE engagement_id = ? AND output_markdown IS NOT NULL"
        " AND completed_at IS NOT NULL ORDER BY completed_at",
        (engagement_id,),
    ).fetchall()


def next_report_version(conn: sqlite3.Connection, engagement_id: str) -> int:
    row = conn.execute(
        "SELECT MAX(version) AS v FROM reports WHERE engagement_id = ?",
        (engagement_id,),
    ).fetchone()
    return (row["v"] or 0) + 1


def insert_report(
    conn: sqlite3.Connection, *, engagement_id: str, version: int, html: str
) -> str:
    report_id = new_id()
    conn.execute(
        "INSERT INTO reports (id, engagement_id, version, html_content)"
        " VALUES (?, ?, ?, ?)",
        (report_id, engagement_id, version, html),
    )
    return report_id
