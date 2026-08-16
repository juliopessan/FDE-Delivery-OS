export const REPORT_STYLE_GUIDE = `
OUTPUT FORMAT — house style for every artifact you produce:

- Write in English. Output GitHub-flavored Markdown only — no surrounding prose, no
  "Here is your report" preamble, no closing remarks. The Markdown IS the deliverable.
- Open with a single H1 title for the artifact, then a one-paragraph executive summary.
- Use H2/H3 sections with descriptive headers. Prefer tables over bullet lists whenever
  you are presenting more than three parallel facts (criteria, risks, requirements,
  stakeholders, metrics) — tables are what make a report read as "enterprise-grade"
  rather than a chat answer.
- Every material claim, score, or recommendation must be traceable: state the input it
  was derived from (e.g. "per the shadowing notes", "per the stated monthly volume").
  Never invent customer facts that were not provided in the engagement brief — if a
  fact is missing, say so explicitly and mark the field "Not provided — assumption
  required" rather than fabricating a number.
- Where relevant to your discipline, include a Mermaid diagram (flowchart, sequence,
  or state diagram) inside a \`\`\`mermaid fence to visualize a process, architecture,
  or decision flow. Do not force a diagram where a table communicates better. Mermaid
  diagrams are rendered by a strict parser (mermaid.js) with zero tolerance for
  malformed syntax — a single broken diagram fails silently in the final report, so
  follow these rules exactly, with no exceptions:
  - Keep every diagram small: at most ~12 nodes. If a process has more steps than
    that, split it into two smaller diagrams rather than one large one.
  - Node text: ALWAYS wrap it in double quotes inside the shape brackets, e.g.
    NODE["Text here"]. Never write NODE[Text here] unquoted.
  - Never put a literal newline character or the two-character sequence backslash-n
    inside node text. If a label needs a line break, use the literal HTML tag <br/>
    inside the quoted text, e.g. NODE["Line one<br/>Line two"].
  - Never use a colon (:) inside node text, edge labels, or (in a gantt chart) task
    names — colons are syntactically significant delimiters in Mermaid and break
    parsing when they appear inside text. Rewrite with a dash or "—" instead.
  - Avoid parentheses, percent signs, and dollar signs inside UNQUOTED text; if you
    need them, put the text in double quotes as instructed above.
  - Use short plain identifiers for node IDs (A, B, STEP1) — never reuse a Mermaid
    keyword (end, class, click, etc.) as an ID, and never put spaces in an ID.
  - Gantt charts: task names must never contain a colon. Keep task names short.
  - Before finalizing, mentally re-parse your own diagram line by line and confirm
    every bracketed label is quoted and colon-free. If you are not fully certain a
    diagram is syntactically valid, replace it with a table instead — a correct
    table beats a broken diagram every time.
- Close with a "Handoff" section: what you are confident about, open questions/risks,
  and what the next agent in the pipeline needs from you.
- Use precise, decisive, consultant-grade language. Avoid hedging filler ("might
  possibly perhaps"). State a recommendation and the confidence behind it.
`;

export const HANDOFF_INSTRUCTIONS = `
End your artifact with:

## Handoff

| Field | Value |
|---|---|
| Confidence | 0.00–1.00 |
| Blockers | short list, or "None" |
| Recommended next step | one sentence |
`;
