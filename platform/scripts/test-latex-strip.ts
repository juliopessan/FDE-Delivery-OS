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
import { stripInlineLatex } from "../src/lib/report/markdown";

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

  // Amounts sitting next to each other, as they do in report tables. Adjacent
  // placeholders must not share a boundary character, or restoring the first
  // eats the second and the marker reaches the reader.
  ["from $18,500 to $24,000 fixed", "from $18,500 to $24,000 fixed"],
  ["| $5,000 | $61,906 | $742,872 |", "| $5,000 | $61,906 | $742,872 |"],
  ["$1,794 $61,906 $35.00 $0.15", "$1,794 $61,906 $35.00 $0.15"],
];

let failures = 0;
for (const [input, expected] of cases) {
  const actual = stripInlineLatex(input);
  if (actual === expected) continue;
  failures++;
  console.error(`FAIL  in:       ${JSON.stringify(input)}`);
  console.error(`      expected: ${JSON.stringify(expected)}`);
  console.error(`      actual:   ${JSON.stringify(actual)}`);
}

console.log(`${cases.length - failures}/${cases.length} passed`);
process.exit(failures === 0 ? 0 : 1);
