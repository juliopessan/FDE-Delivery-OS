# FDE OS — Delivery Engine

The nine agents and the Enterprise Report live here. The Next app in
[`../platform`](../platform) owns the interface and calls this over a
subprocess.

## Why it is split

The two halves want different things. The interface is React: components,
themes, a live-polling dashboard — a rewrite in any other stack, and one that
already took real work to get right. The engine is a sequential pipeline that
makes ten model calls and writes SQLite, which is territory Python is better
at: first-class SDKs for both providers, and a road to computing the ROI
scenarios in code rather than asking a model to do arithmetic in its head.

So the split follows the grain: Python owns the work, TypeScript owns the
screen.

They meet at a subprocess rather than an HTTP service. For one operator on one
machine, a service adds a port, a second process to start and a health check,
and buys nothing — a route handler blocks for the length of a pipeline run
either way, and a crashed subprocess is easier to reason about than a hung
socket.

## Setup

```bash
uv sync
```

That is the whole install. The app finds `.venv/bin/fde-engine` on its own, and
falls back to `uv run` if the venv is not there yet.

Model keys are read from `../platform/.env.local` — the same file the app's own
dialog writes, so there is one place to set a key rather than two.

## Commands

```bash
uv run fde-engine roster                      # the nine agents, in pipeline order
uv run fde-engine run <engagement-id>         # the full pipeline (~$0.28, 3–5 min)
uv run fde-engine regenerate-report <id>      # re-render from artifacts already paid for
uv run fde-engine repair <id> <agent-key>     # re-run one agent and everything after it
uv run fde-engine extract-brief < intake.md   # a discovery document to the six fields
```

`repair` re-runs the agents downstream of the one you name, not just that one:
a later agent consumed the bad artifact as context, so repairing in isolation
leaves eight artifacts quoting text that no longer exists. It does not
re-render the report — that stays `regenerate-report`'s job, so a repair can be
read before it is published.

Every command prints one JSON object on stdout. Progress and tracebacks go to
stderr, so the app can stream them into its log without touching the result.

`--db` points at a different engagement database — useful for trying something
against a copy without touching your own:

```bash
cp ../platform/local.db /tmp/copy.db
uv run fde-engine --db /tmp/copy.db regenerate-report <id>
```

## Layout

| Path | What it is |
|---|---|
| `fde_engine/prompts/*.md` | What each agent is told. Text, not code — editable and diffable without escaping. |
| `fde_engine/prompts/roster.json` | Names, phases and the verbs the UI cycles while a phase runs. |
| `fde_engine/roster.py` | Composes each agent's body with the shared house style and closing section. |
| `fde_engine/llm_client.py` | Gemini 3.7 Flash, falling back to Claude Haiku 4.5. |
| `fde_engine/pipeline.py` | The nine agents in order, then the master synthesis. |
| `fde_engine/markdown.py` | The sanitisers: LaTeX, crammed tables, Mermaid line breaks. |
| `fde_engine/render.py` | The consolidated report. |
| `fde_engine/assets/` | The report stylesheet and its Mermaid bootstrap, as CSS and JS. |
| `fde_engine/db.py` | The same SQLite file the app reads. |

## Tests

```bash
uv run pytest
```

The sanitiser cases were extracted from the TypeScript suite by evaluating its
arrays rather than retyping them, so both implementations are held to literally
the same expectations. When you add a case on either side, add it on both — a
divergence there is the port drifting.

## What stayed in TypeScript

The interface, and two things that belong to it. `format-elapsed.ts` formats
durations for the dashboard, and `token-cost.ts` prices a run for the strip
above the phase list — both are things the screen shows, not work the engine
does. `db/queries.ts` reads the tables for those screens; the schema is still
Drizzle's, migrated from the app.

`roster.ts` imports `fde_engine/prompts/roster.json` directly rather than
keeping a copy. What agents are *told* never crosses over — 52k characters of
prompt have no business in a browser bundle — but the names, phases and verbs
the dashboard draws come from the engine's own file, so renaming an agent
cannot leave the two disagreeing.
