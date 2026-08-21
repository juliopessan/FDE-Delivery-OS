import { Marked } from "marked";

const marked = new Marked({
  renderer: {
    code({ text, lang }) {
      if (lang === "mermaid") {
        // The agents write node labels with <br/> in them. Mermaid runs with
        // securityLevel "strict", which sanitizes the tag out of the label
        // before laying the node out — so "Lead FDE Track<br/>Cockpit UI"
        // arrives as "Lead FDE TrackCockpit UI", two words fused, and the
        // node is sized for the line count it no longer has, leaving the last
        // line spilling out of its box. Turning the break into a space lets
        // mermaid wrap and measure the label itself.
        return `<pre class="mermaid">${text.replace(/<br\s*\/?>/gi, " ")}</pre>`;
      }
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre class="code-block"><code>${escaped}</code></pre>`;
    },
  },
});

/** LaTeX commands the agents reach for most often, mapped to plain Unicode. */
const LATEX_COMMANDS: [RegExp, string][] = [
  [/\\rightarrow|\\to\b/g, "→"],
  [/\\leftarrow/g, "←"],
  [/\\Rightarrow/g, "⇒"],
  [/\\geq?\b/g, "≥"],
  [/\\leq?\b/g, "≤"],
  [/\\neq?\b/g, "≠"],
  [/\\sum\b/g, "Σ"],
  [/\\approx\b/g, "≈"],
  [/\\pm\b/g, "±"],
  [/\\times\b/g, "×"],
  [/\\cdot\b/g, "·"],
  [/\\div\b/g, "÷"],
  [/\\infty\b/g, "∞"],
  [/\\sim\b/g, "≈"],
  [/\\text\{([^}]*)\}/g, "$1"],
  [/\\mathrm\{([^}]*)\}/g, "$1"],
  [/\\mathbf\{([^}]*)\}/g, "$1"],
  [/\\%/g, "%"],
  [/\\_/g, "_"],
  [/\\&/g, "&"],
];

// Private Use Area code points: they cannot occur in agent prose, and distinct
// open/close markers mean two adjacent placeholders share no character — so
// restoring the first cannot consume the second's boundary.
const LITERAL_DOLLAR = "";
const AMOUNT_OPEN = "";
const AMOUNT_CLOSE = "";

/**
 * The agents are told to write plain business prose, but they still slip into
 * LaTeX for comparisons and units ("$\ge 85\%$", "$\text{pages}$"). Nothing in
 * this report renders maths, so the markup would reach the reader verbatim.
 *
 * The delicate part is the inverse mistake: a dollar sign usually means money,
 * and turning "$18,500" into "18,500" would quietly corrupt the commercials in
 * a client deliverable. So amounts are set aside before any delimiter pairing
 * happens, and only what remains is treated as maths.
 */
/** A fraction has to go linear: "\frac{O + 4M + P}{6}" -> "(O + 4M + P) / 6". */
function linearizeFractions(text: string): string {
  const parenthesizeIfCompound = (term: string) =>
    /[+\-×÷/\s]/.test(term.trim()) ? `(${term.trim()})` : term.trim();

  return text.replace(
    /\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g,
    (_, numerator: string, denominator: string) =>
      `${parenthesizeIfCompound(numerator)} / ${parenthesizeIfCompound(denominator)}`
  );
}

/**
 * Agents write "~12,000 invoices" for an approximate figure. GitHub-flavoured
 * Markdown pairs up loose tildes into strikethrough, so two approximations in
 * one paragraph render everything between them as struck-out text — which in
 * a client report reads as "withdrawn". Since the intent is always
 * "approximately", promote it to the symbol that says so.
 *
 * A doubled tilde is deliberate strikethrough and is left alone.
 */
function approximationTildesToSymbol(text: string): string {
  return text.replace(/(?<!~)~(?=\s?[\d$])/g, "≈");
}

export function stripInlineLatex(markdown: string): string {
  // 1. An escaped `\$` is a literal dollar sign, not a delimiter.
  let out = approximationTildesToSymbol(
    linearizeFractions(markdown.replace(/\\\$/g, LITERAL_DOLLAR))
  );

  // 2. Translate the commands, leaving plain text plus bare delimiters.
  for (const [pattern, replacement] of LATEX_COMMANDS) {
    out = out.replace(pattern, replacement);
  }

  // 3. Display math ($$…$$) has to go before inline, or the inline pass reads
  //    the doubled delimiters as an empty span and leaves both pairs behind.
  //    Agents use it for the headline calculations — the effort reduction, the
  //    ROI — so it lands as its own paragraph rather than inline.
  out = out.replace(/\$\$([\s\S]{1,300}?)\$\$/g, (whole, inner: string) =>
    /\\/.test(inner) || !inner.trim() ? whole : inner.trim()
  );

  // 4. Set real amounts aside. Doing this before pairing is what makes a line
  //    like "costs $18,500 at $≥ 85%$ accuracy" resolve correctly — otherwise
  //    the amount's sign pairs with the formula's opening one and strands the
  //    closing delimiter in the output.
  const amounts: string[] = [];
  out = out.replace(/\$\d[\d,.]*\s?[kKmMbB]?/g, (amount, offset: number, full: string) => {
    // "$99.9%" is a percentage wearing delimiters, not an amount — leave it
    // for the pairing step below.
    if (/^\s*%/.test(full.slice(offset + amount.length))) return amount;
    amounts.push(amount);
    return `${AMOUNT_OPEN}${amounts.length - 1}${AMOUNT_CLOSE}`;
  });

  // 5. Every `$` still standing opens or closes a formula. Drop the pair and
  //    keep the value, unless the span carries markup we could not translate.
  out = out.replace(/\$([^$\n]{0,80}?)\$/g, (whole, inner: string) =>
    /\\/.test(inner) || !inner.trim() ? whole : inner.trim()
  );

  // 6. Put the amounts and literal signs back.
  out = out.replace(
    new RegExp(`${AMOUNT_OPEN}(\\d+)${AMOUNT_CLOSE}`, "g"),
    (_, index: string) => amounts[Number(index)]
  );
  return out.replaceAll(LITERAL_DOLLAR, "$");
}

/** Cells of one row, with the outer pipes stripped. */
function splitRow(row: string): string[] {
  return row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

/** A run of `|---|---|` cells, which is what marks a line as a table. */
const DELIMITER_RUN = /\|(?:\s*:?-{3,}:?\s*\|)+/;

/**
 * Agents sometimes emit a whole table on a single line — header, delimiter and
 * every body row run together as `| a | b | | c | d |`. Markdown needs one row
 * per line, so `marked` renders the lot as a paragraph of literal pipes: the
 * header never appears, and the reader gets a wall of `|` in a client
 * deliverable. It happened to the retainer table on a real engagement.
 *
 * The header tells us how many columns there are, so the body can be split
 * back into rows by counting cells. The blank fragment left between rows by
 * the `| |` boundary is skipped rather than counted as a cell.
 *
 * The agent that crams a table onto one line also tends to miscount the
 * delimiter — three headers over four dashes — which `marked` rejects on its
 * own, so the delimiter is rebuilt from the header rather than trusted.
 */
export function normalizeInlineTables(markdown: string): string {
  let inFence = false;

  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      const match = DELIMITER_RUN.exec(line);
      // A delimiter at the start of its own line is a well-formed table.
      if (!match || match.index === 0) return line;

      const header = splitRow(line.slice(0, match.index));
      if (header.length < 2) return line;

      const rows: string[][] = [];
      const fragments = line.slice(match.index + match[0].length).split("|");
      // Text before the first pipe and after the last belongs to no cell.
      if (!fragments[0]?.trim()) fragments.shift();
      if (!fragments.at(-1)?.trim()) fragments.pop();

      for (let i = 0; i < fragments.length; ) {
        const row = fragments.slice(i, i + header.length).map((c) => c.trim());
        if (!row.length) break;
        rows.push(row);
        i += header.length;
        // The `| |` seam between two rows leaves one empty fragment behind.
        if (i < fragments.length && !fragments[i].trim()) i += 1;
      }

      return [
        `| ${header.join(" | ")} |`,
        `|${header.map(() => "---").join("|")}|`,
        ...rows.map((r) => `| ${r.join(" | ")} |`),
      ].join("\n");
    })
    .join("\n");
}

export function markdownToHtml(markdown: string): string {
  const html = marked.parse(normalizeInlineTables(stripInlineLatex(markdown)), {
    async: false,
  }) as string;

  /*
    Give every table its own scroll container. Below roughly 860px the agents'
    wider tables — 7 columns of PERT estimates, a connector matrix — were
    compressed until "12.67" broke across two lines and a header column read one
    letter per row. Scrolling one table sideways costs the reader far less than
    that, and the prose around it keeps reflowing normally.

    Done by wrapping the rendered output rather than overriding marked's table
    renderer, which would mean reimplementing its cell and alignment handling
    against internals that change between versions.
  */
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
}
