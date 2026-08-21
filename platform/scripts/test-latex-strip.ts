/**
 * Checks the LaTeX sanitiser in lib/report/markdown.ts.
 *
 * The agents are told to write plain prose, but they still slip into LaTeX for
 * comparisons and units. Nothing in the report renders maths, so the markup
 * would reach the reader verbatim. The tricky half of this is the inverse
 * error: a dollar sign usually means money, and mangling "$18,500" into
 * "18,500" would silently corrupt the commercials in a client deliverable.
 *
 * Usage: npx tsx scripts/test-latex-strip.ts
 */
import { normalizeInlineTables, stripInlineLatex } from "../src/lib/report/markdown";

const cases: [string, string][] = [
  // Maths becomes plain Unicode.
  ["STP $\\ge 65\\%$ maintained", "STP ≥ 65% maintained"],
  ["cost $\\le 0.15$ per invoice", "cost ≤ 0.15 per invoice"],
  ["Park $\\rightarrow$ Approve", "Park → Approve"],
  ["drift $\\pm 0.01$ tolerance", "drift ± 0.01 tolerance"],
  ["latency $> 6.0\\text{s}$ alerts", "latency > 6.0s alerts"],
  ["recall $< 0.85$ blocks release", "recall < 0.85 blocks release"],
  ["variable $P$ denotes price", "variable P denotes price"],
  ["metric $AHT_E$ per phase", "metric AHT_E per phase"],
  ["Guarantees $99.9\\%$ ERP uptime", "Guarantees 99.9% ERP uptime"],
  ["ceiling ($\\le \\$0.15$ per invoice)", "ceiling (≤ $0.15 per invoice)"],

  // Money is left exactly as written.
  ["saves $66,334.22 USD monthly", "saves $66,334.22 USD monthly"],
  ["between $18,500 and $24,000 fixed", "between $18,500 and $24,000 fixed"],
  ["budget of $150k needs approval", "budget of $150k needs approval"],

  // Both on one line — the case that breaks naive delimiter pairing.
  ["costs $18,500 at $\\ge 85\\%$ accuracy", "costs $18,500 at ≥ 85% accuracy"],
  ["$5,000/mo retainer keeps STP $\\ge 65\\%$", "$5,000/mo retainer keeps STP ≥ 65%"],

  // Formulae the estimation and QA agents actually emit.
  [
    "PERT formula: $E = \\frac{O + 4M + P}{6}$, where:",
    "PERT formula: E = (O + 4M + P) / 6, where:",
  ],
  ["check: $\\sum Line \\ne Total$ fails", "check: Σ Line ≠ Total fails"],
  ["($Gross \\ne Net + Tax$)", "(Gross ≠ Net + Tax)"],

  // Display math. Agents use it for headline calculations, and the doubled
  // delimiters slip past an inline-only pass.
  [
    "$$\\text{Manual Effort Reduction} = \\frac{1,820}{2,800} = \\mathbf{65.0\\%}$$",
    "Manual Effort Reduction = 1,820 / 2,800 = 65.0%",
  ],
  ["$$ROI = 61,906 / 5,000$$", "ROI = 61,906 / 5,000"],

  // Approximations. Two loose tildes in a paragraph make GFM strike out
  // everything between them, so an estimate must not stay a bare tilde.
  ["~12,000 invoices at ~14 minutes each", "≈12,000 invoices at ≈14 minutes each"],
  ["(~16-18 FTE) processing ~2,800 hours", "(≈16-18 FTE) processing ≈2,800 hours"],
  ["cost of ~$1,794 per month", "cost of ≈$1,794 per month"],
  ["~ 6.0% error rate", "≈ 6.0% error rate"],
  // Deliberate strikethrough survives.
  ["the ~~old baseline~~ is superseded", "the ~~old baseline~~ is superseded"],

  // Amounts sitting next to each other, as they do in report tables. Adjacent
  // placeholders must not share a boundary character, or restoring the first
  // eats the second and the marker reaches the reader.
  ["from $18,500 to $24,000 fixed", "from $18,500 to $24,000 fixed"],
  ["| $5,000 | $61,906 | $742,872 |", "| $5,000 | $61,906 | $742,872 |"],
  ["$1,794 $61,906 $35.00 $0.15", "$1,794 $61,906 $35.00 $0.15"],
];

/**
 * Tables the agents cram onto one line. Markdown needs a row per line, so
 * `marked` renders the crammed form as a paragraph of literal pipes — the
 * header never appears at all. This happened to the retainer table on a real
 * engagement and reached a client deliverable.
 */
const tableCases: [string, string][] = [
  // The shape the Scale agent actually emitted: rows run together by `| |`,
  // and a delimiter with one more cell than the header has columns.
  [
    "| Workstream | Hours | Output | |---|---|---|---| | Prompt tuning | 10.0 | Refine extraction. | | Total | 30.0 | $6,000 / month |",
    [
      "| Workstream | Hours | Output |",
      "|---|---|---|",
      "| Prompt tuning | 10.0 | Refine extraction. |",
      "| Total | 30.0 | $6,000 / month |",
    ].join("\n"),
  ],

  // A well-formed table is left exactly as written.
  [
    ["| A | B |", "|---|---|", "| 1 | 2 |"].join("\n"),
    ["| A | B |", "|---|---|", "| 1 | 2 |"].join("\n"),
  ],

  // A delimiter inside a fenced block is ASCII art, not a table.
  [
    ["```", "| a |---|---| b |", "```"].join("\n"),
    ["```", "| a |---|---| b |", "```"].join("\n"),
  ],

  // Prose that merely contains a pipe is not a table.
  ["Route A | Route B are both viable", "Route A | Route B are both viable"],
];

let failures = 0;

function run(name: string, suite: [string, string][], fn: (s: string) => string) {
  let failed = 0;
  for (const [input, expected] of suite) {
    const actual = fn(input);
    if (actual === expected) continue;
    failed++;
    console.error(`FAIL  ${name}`);
    console.error(`      in:       ${JSON.stringify(input)}`);
    console.error(`      expected: ${JSON.stringify(expected)}`);
    console.error(`      actual:   ${JSON.stringify(actual)}`);
  }
  failures += failed;
  console.log(`${name}: ${suite.length - failed}/${suite.length} passed`);
}

run("latex", cases, stripInlineLatex);
run("tables", tableCases, normalizeInlineTables);

process.exit(failures === 0 ? 0 : 1);
