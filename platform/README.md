# FDE OS — Platform

![FDE OS landing page](docs/screenshot-landing-page.png)

A solo Forward Deployed Engineer sells and delivers applied Gen AI engagements
alone: qualifying the opportunity, sizing the effort, running discovery,
designing the architecture, writing the guardrails, running QA, and reporting
value back to the sponsor. Every one of those steps produces a document a
client will actually read. Doing that by hand, engagement after engagement,
means the quality of the deliverable tracks how much attention that
particular week allowed — and none of the reasoning behind a fit score, an
architecture decision, or a guardrails verdict survives past the chat session
it was typed in.

This platform turns that sequence into a pipeline instead of a habit. You
give it one engagement brief — or the client's raw discovery document, and it
extracts the brief for you. Nine specialist agents run against it in order,
each reading every report the agents before it produced, and hand back one
consolidated Enterprise Report — the kind of document a business sponsor and
a technical reviewer can both sit down with. The last agent in the pipeline,
Compound Intelligence, exists so the engagement doesn't end at "automation
shipped": it extracts the client's own proprietary know-how surfaced during
delivery, states how governance and cost visibility apply across the stack,
and names what should be promoted into the shared pattern library versus what
must stay inside this client's boundary — the mechanism by which delivery
compounds instead of resetting to zero on the next engagement.

## What happens when you use it

1. You paste the client's discovery document, or upload it as `.txt`, `.md`,
   `.pdf`, or `.docx`, and hit "Extract brief" — the fields below it (customer,
   industry, objective, baseline, constraints) fill themselves in. You review
   and correct them before continuing; the agents treat the full document as
   the primary source of truth and the fields as a condensed excerpt of it.
2. You hit "Run agent pipeline." The Qualification and Capacity Planning
   agents score the opportunity and size the effort first — before anything
   else runs, so a bad fit or an unrealistic timeline gets flagged early
   instead of buried in page twelve.
3. Assessment, Context Engineering, Architecture, Guardrails, and QA run in
   sequence. Each one reads the brief plus every prior agent's output, so the
   Architecture agent already knows what the Assessment agent found, and the
   Guardrails agent is reviewing an actual proposed system, not a hypothetical
   one. The dashboard shows each agent's status with a verb suited to what
   it's actually doing — Qualifying, Estimating, Assessing, Ingesting,
   Architecting, Hardening, Validating, Operating, Compounding — not a generic
   "running" spinner.
4. Scale & Value and Compound Intelligence close the pipeline: the first
   projects realized ROI and an operations runbook, the second extracts the
   client's own proprietary know-how surfaced along the way and states what
   should feed back into a shared, reusable pattern library.
5. A Master Orchestrator step reads all nine reports and writes an executive
   summary that cites specific figures from them — the fit score, the
   estimated effort, the ROI projection, the architecture decision, the
   guardrails verdict — instead of restating generic claims.
6. The executive summary and all nine phase reports are assembled into one
   Enterprise Report, styled and print-ready, with every Mermaid diagram
   rendered independently so one malformed diagram degrades to its raw
   source instead of blanking the page. Served at
   `/api/engagements/:id/report`.

## How it's built

```
Browser (dashboard, new-engagement form)
        │
        ▼
Next.js API routes  ──▶  SQLite (Turso/libSQL, via Drizzle)
        │                     stores: engagements, phase_runs, reports
        ▼
Agent pipeline (src/lib/agents/run-pipeline.ts)
        │  sequential calls through lib/agents/llm-client.ts, one per agent
        │  in the roster, each call's context = brief + every prior agent's
        │  output
        ▼
Report renderer (src/lib/report/render.ts)
        │  Markdown → styled HTML, one self-contained document
        ▼
Consolidated Enterprise Report
```

It's a single Next.js app (App Router, TypeScript) — the frontend and the
API routes live in the same deployable unit, so there's no separate backend
service to stand up or keep in sync.

State lives in SQLite through Drizzle ORM, using the `@libsql/client` driver.
That's a deliberate choice, not the default: Vercel's serverless functions
have a read-only, ephemeral filesystem, so a plain local SQLite file would
vanish between requests. The libSQL driver speaks the exact same API against
a local `file:` database in development and a remote Turso database in
production, so the schema and every query in `src/lib/db/` work unmodified
in both places — only the connection string changes.

Every agent is a system prompt in `src/lib/agents/prompts/`, listed in
`src/lib/agents/roster.ts` alongside its phase. The roster mirrors the phase
structure already defined in
[`../specs/agent-roster.md`](../specs/agent-roster.md) — Qualification,
Assessment, Context Engineering, Engineering, Scale — but the "A.C.E.S."
acronym is retired here; phases are just their plain English names. The
report renderer converts each agent's Markdown output to HTML and wraps it in
the visual language carried over from the `content-machine` project:
Helvetica Neue for display type, italic Instrument Serif for accents,
JetBrains Mono for uppercase micro-labels, on a cream-paper/ink palette with
lime, amber, and rust accents.

**Model routing.** `src/lib/agents/llm-client.ts` centralizes every LLM call
behind one `generateText()` function: Gemini 3.7 Flash first, falling back to
Claude Haiku 4.5 automatically if the Gemini call errors or `GEMINI_API_KEY`
isn't set. Nine sequential agent calls plus a synthesis call is enough volume
per engagement that a fast/cheap primary model matters; the fallback means a
missing or rate-limited Gemini key degrades the pipeline instead of breaking
it. Every phase run records which model actually answered, for the audit
trail.

**Mermaid diagrams are a known sharp edge.** Early testing produced diagrams
that silently failed to render — unquoted node labels containing a literal
`\n`, and Gantt task names containing a colon (Mermaid's own delimiter
character). `src/lib/agents/report-style.ts` now gives every agent an
explicit, strict Mermaid syntax checklist (quote every label, use `<br/>` not
`\n`, never a bare colon in label or task text, keep diagrams under ~12
nodes), and the report renderer renders each diagram independently via
`mermaid.render()` in a try/catch — a syntax error in one diagram falls back
to a labeled code block showing its source instead of leaving the whole
report blank past that point. Every diagram is also capped to the same
max-width/max-height in CSS, so a 20-node architecture diagram and a 4-node
flowchart read at a consistent size instead of whatever mermaid happened to
lay out.

## One honest limitation

The whole pipeline runs synchronously inside a single API request (capped at
`maxDuration = 300` seconds in `src/app/api/engagements/[id]/run/route.ts`).
Nine sequential model calls plus the synthesis call comfortably fit inside
that today, but there's no mid-pipeline resume — if a call in a much larger
future roster timed out, you'd rerun the whole engagement. There's also no
auth or multi-tenant isolation yet — one shared database, which matches the
"solo FDE" scope this implements first, not the multi-FDE platform sketched
in [`../docs/arquitetura-sistema/15-roadmap.md`](../docs/arquitetura-sistema/15-roadmap.md).

## Stack

- **Next.js 15** (App Router, TypeScript) — frontend + API routes in one app.
- **SQLite via Turso/libSQL + Drizzle ORM** — see above.
- **Gemini 3.7 Flash primary, Claude Haiku 4.5 fallback** (`@google/generative-ai`,
  `@anthropic-ai/sdk`) — powers every agent in the roster.
- **`pdf-parse` + `mammoth`** — server-side text extraction for uploaded
  `.pdf` and `.docx` discovery documents.
- **Tailwind CSS** — the `content-machine`-derived visual language described
  above.

## Local development

```bash
cp .env.example .env.local
# fill in GEMINI_API_KEY and/or ANTHROPIC_API_KEY; leave DATABASE_URL as
# file:./local.db for local dev
npm install
npx tsx src/lib/db/migrate.ts   # creates local.db with the schema
npm run dev
```

Open http://localhost:3000, create an engagement at `/dashboard/new`, then
run its pipeline from the engagement detail page. The consolidated report is
served at `/api/engagements/:id/report`.

If you edit a phase's prompt or the report template after an engagement has
already completed, `npx tsx scripts/regenerate-report.ts <engagementId>`
re-synthesizes the executive summary and re-renders the HTML report from the
already-stored phase outputs, without re-running the full (billed) pipeline.

## Deploying to Vercel

1. Create a [Turso](https://turso.tech) database and get its `libsql://` URL
   and auth token.
2. In the Vercel project settings, set the environment variables:
   - `GEMINI_API_KEY` and/or `ANTHROPIC_API_KEY`
   - `DATABASE_URL` (the `libsql://...` URL)
   - `DATABASE_AUTH_TOKEN`
3. Run the schema bootstrap once against the Turso database:
   `DATABASE_URL=... DATABASE_AUTH_TOKEN=... npx tsx src/lib/db/migrate.ts`
4. Deploy. `vercel.json` in this directory sets the framework preset and
   build/install commands; point the Vercel project's root directory at
   `platform/`.
