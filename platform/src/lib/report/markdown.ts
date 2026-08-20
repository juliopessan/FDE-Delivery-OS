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

export function markdownToHtml(markdown: string): string {
  const html = marked.parse(stripInlineLatex(markdown), { async: false }) as string;

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
