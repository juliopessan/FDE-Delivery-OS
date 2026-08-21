# Deliverable defects, and what to write instead

Every entry is a defect an FDE OS agent actually produced in an artifact that
reached a rendered Enterprise Report. Read this before diagnosing a new one.

Each entry names the prompt that owns the defect and, where one exists, the
downstream guard that compensates for artifacts already stored — so nobody
"fixes" it a second time in the renderer and concludes the prompt change did
nothing. See [the skill](../SKILL.md) for why both halves are required.

---

## Vantage — who the artifact is addressed to

### A closing section written for the next agent

**Appeared as** a "Handoff" table ending every phase: `Confidence 0.90`,
`Blockers | None`, `Recommended next step | Issue the Phase 1 SOW`.

**Why it fails** the one test. Confidence, blockers and pipeline stages are the
pipeline talking to itself, and the client is the one reading. A numeric
confidence beside a GO verdict is worse than noise: it invites the sponsor to
ask what lives in the other ten percent, on a document they are paying for.

**Write instead** a section addressed to the sponsor — decision reached, what is
still open and who resolves it, the next step and what it needs from the client.
The underlying facts are genuinely useful; only the framing and the addressee
were wrong.

**Owned by** `report-style.ts` → `CLOSING_SECTION_INSTRUCTIONS`.

### The same section asked for twice

**Appeared as** a prose "8. Handoff" with three subsections, followed
immediately by a redundant table of the same three facts.

**Why it fails.** Two instructions asked for a closing section — the shared style
guide and a separate block — so the agent satisfied both. When two prompts
overlap, agents do not choose; they comply twice.

**Write instead** one instruction owning one section. When adding a formatting
rule, search `report-style.ts` for an existing rule on the same surface first.

**Owned by** `report-style.ts`.

---

## Markdown the renderer cannot parse

### An entire table on one line

**Appeared as** `| Workstream | Hours | Output | |---|---|---|---| | Prompt
tuning | 10.0 | … |` — header, delimiter and every row run together.

**Why it fails.** Markdown needs one row per line. `marked` renders the crammed
form as a paragraph of literal pipes, so the table has no header at all and the
client sees a wall of `|`. It reached a client deliverable this way.

**Write instead** one row per line, always — including the delimiter.

**Owned by** `report-style.ts`. **Guarded by** `normalizeInlineTables` in
`platform/src/lib/report/markdown.ts`, which splits the body back into rows by
counting cells against the header.

### A delimiter row with more cells than the table has columns

**Appeared as** three headers over `|---|---|---|---|`.

**Why it fails.** `marked` rejects a table whose delimiter count does not match
its header count, and renders the whole block as a paragraph. This travels with
the crammed-table defect above — the same agent produces both.

**Write instead** one `---` per column. Count them.

**Guarded by** the same normalizer, which rebuilds the delimiter from the header
rather than trusting it.

### LaTeX in business prose

**Appeared as** `$\ge 85\%$`, `$\text{pages}$`, `$\frac{O + 4M + P}{6}$`.

**Why it fails.** Nothing in the report renders maths, so the markup reaches the
reader verbatim. The inverse error is worse: a `$` usually means money, and a
sanitiser that is too eager turns `$18,500` into `18,500` and silently corrupts
the commercials.

**Write instead** plain text: `≥ 85%`, `pages`, `(O + 4M + P) / 6`. Reserve `$`
for actual amounts.

**Owned by** `report-style.ts`. **Guarded by** `stripInlineLatex`, with the
money cases pinned in `platform/scripts/test-latex-strip.ts`.

### `<br/>` inside a Mermaid node label

**Appeared as** `NODE["Lead FDE Track<br/>Cockpit UI"]`, rendering as
`Lead FDE TrackCockpit UI` with the last line spilling out of its box.

**Why it fails.** Mermaid runs at `securityLevel: "strict"`, which strips the tag
*before* laying the node out — so the words fuse and the node is sized for a line
count it no longer has.

**Write instead** a single line of label text and let Mermaid wrap it.

**Guarded by** the mermaid branch of the code renderer in `markdown.ts`, which
turns the tag into a space.

### ASCII boxes where the report expects a diagram

**Appeared as** `+------+` box drawings inside fenced code blocks, in the same
report as rendered Mermaid flowcharts.

**Why it fails.** Not a parse error — a consistency one. Two visual languages for
the same job in one document reads as two authors, which is exactly what it is.

**Write instead** Mermaid, or a table. The style guide already says to fall back
to a table when a diagram's syntax is uncertain; ASCII art is not the third
option.

**Owned by** `report-style.ts`.

---

## Content the client cannot act on

### A truncated artifact stored as complete

**Appeared as** a phase report ending mid-heading, at 7,996 completion tokens
against an 8,000 ceiling — stored, rendered, and shipped with no error raised
anywhere.

**Why it fails.** Gemini 3.x spends part of `maxOutputTokens` on reasoning before
writing anything, so roughly half the ceiling was gone before the artifact
started.

**Write instead** — this one is not the agent's to fix. The budget is 24k and
`generateText()` returns a `truncated` flag from the provider's own stop reason,
so the pipeline warns instead of persisting half an artifact.

**Owned by** `platform/src/lib/agents/llm-client.ts`.

### A single ROI figure presented as the answer

**Appeared as** one net monthly benefit, derived from one assumed labour rate,
with the assumption flagged but the figure stated flat.

**Why it fails.** The sponsor cannot tell how much of the number is evidence and
how much is the assumption. A figure that moves with an unvalidated input needs
its range shown, not a footnote.

**Write instead** three scenarios — conservative, medium, optimistic — and say
plainly that released capacity is not the same thing as a hard saving until
someone decides what happens to the freed hours.

**Owned by** `prompts/assessor.ts`. **Open** — not yet applied.

### Two phases contradicting each other on the same constraint

**Appeared as** one artifact anchoring the architecture in Azure UAE North for
data residency while another referenced West Europe.

**Why it fails.** Each artifact is internally consistent, and no agent reads for
contradiction *across* phases. The client reads all nine and finds it.

**Write instead** — the QA agent's cross-artifact check is the right home for
this: constraints named in an earlier phase are facts later phases inherit, not
choices they re-make.

**Owned by** `prompts/qa.ts`. **Open** — not yet applied.
