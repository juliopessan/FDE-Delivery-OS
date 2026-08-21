"""The engine's command line — and the interface the Next app calls.

The app shells out to these commands rather than talking to a second server.
For a tool that runs on one machine for one operator, an HTTP service would add
a port, a process to start, and a health check, and buy nothing: the Next route
handler already blocks for the length of a pipeline run either way.

Everything an invocation reports goes to stdout as one JSON object, so the
caller parses one thing. Progress and warnings go to stderr, where the app can
stream them into its own log without touching the result.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

from . import db as store
from .pipeline import (
    extract_brief,
    regenerate_report,
    repair_phase,
    run_engagement_pipeline,
)
from .roster import agent_roster


def _load_env_file(path: Path) -> None:
    """Read platform/.env.local the way the Next app does.

    The keys live there because that is where the app's own dialog writes them.
    Reading the same file means one place to set a key, not two — and the
    engine never has to be told a secret the app already holds.
    """
    if not path.exists():
        return
    for line in path.read_text("utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip('"').strip("'")
        # An exported variable wins: it is the more deliberate of the two.
        import os

        os.environ.setdefault(key, value)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="fde-engine", description="The FDE OS delivery engine."
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=None,
        help="Path to the engagement database (default: platform/local.db).",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="Run the nine-agent pipeline on an engagement.")
    run.add_argument("engagement_id")

    regen = sub.add_parser(
        "regenerate-report",
        help="Re-synthesize and re-render from artifacts already produced.",
    )
    regen.add_argument("engagement_id")

    repair = sub.add_parser(
        "repair",
        help="Re-run one agent and everything downstream of it.",
    )
    repair.add_argument("engagement_id")
    repair.add_argument(
        "agent_key",
        help="The first agent to re-run. Later agents consumed its output, so "
        "they are re-run too.",
    )

    sub.add_parser(
        "extract-brief",
        help="Read a discovery document on stdin, print the six intake fields.",
    )

    sub.add_parser("roster", help="List the agents, in pipeline order.")

    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.INFO,
        stream=sys.stderr,
        format="[%(name)s] %(message)s",
    )

    db_path = args.db or store.default_db_path()
    _load_env_file(store.default_env_path())

    try:
        if args.command == "roster":
            payload = {
                "ok": True,
                "agents": [
                    {
                        "key": a.key,
                        "name": a.name,
                        "phaseKey": a.phase_key,
                        "phaseLabel": a.phase_label,
                        "mission": a.mission,
                        "promptChars": len(a.system_prompt),
                    }
                    for a in agent_roster()
                ],
            }
        elif args.command == "extract-brief":
            # On stdin rather than an argument: a discovery document runs to
            # tens of kilobytes, past what an argument list will carry.
            payload = {"ok": True, "brief": extract_brief(sys.stdin.read())}
        elif args.command == "repair":
            conn = store.connect(db_path)
            with conn:
                repaired = repair_phase(conn, args.engagement_id, args.agent_key)
            payload = {"ok": True, "repaired": repaired}
        else:
            conn = store.connect(db_path)
            with conn:
                summary = (
                    run_engagement_pipeline(conn, args.engagement_id)
                    if args.command == "run"
                    else regenerate_report(conn, args.engagement_id)
                )
            payload = {"ok": True, "executiveSummary": summary}
    except Exception as err:  # noqa: BLE001 — the boundary reports, never raises
        # The caller is a route handler that will show this to a person, so the
        # message matters more than the traceback. The traceback still goes to
        # stderr for whoever is reading the log.
        logging.getLogger("fde-engine").exception("command failed")
        json.dump({"ok": False, "error": str(err)}, sys.stdout)
        sys.stdout.write("\n")
        return 1

    json.dump(payload, sys.stdout)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
