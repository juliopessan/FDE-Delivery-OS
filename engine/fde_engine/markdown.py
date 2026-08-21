"""Markdown the agents write, turned into HTML the client can read.

Ported from platform/src/lib/report/markdown.ts. The sanitisers here are the
reason that file exists: agents slip into LaTeX, cram tables onto one line, and
put HTML line breaks inside Mermaid labels, and every one of those reaches the
reader verbatim if nothing catches it. The cases each rule was written against
are pinned in tests/test_markdown.py.
"""

from __future__ import annotations

import re

from markdown_it import MarkdownIt
from mdit_py_plugins.tasklists import tasklists_plugin

# ---------------------------------------------------------------------------
# LaTeX
# ---------------------------------------------------------------------------

#: LaTeX commands the agents reach for most often, mapped to plain Unicode.
LATEX_COMMANDS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\\rightarrow|\\to\b"), "→"),
    (re.compile(r"\\leftarrow"), "←"),
    (re.compile(r"\\Rightarrow"), "⇒"),
    (re.compile(r"\\geq?\b"), "≥"),
    (re.compile(r"\\leq?\b"), "≤"),
    (re.compile(r"\\neq?\b"), "≠"),
    (re.compile(r"\\sum\b"), "Σ"),
    (re.compile(r"\\approx\b"), "≈"),
    (re.compile(r"\\pm\b"), "±"),
    (re.compile(r"\\times\b"), "×"),
    (re.compile(r"\\cdot\b"), "·"),
    (re.compile(r"\\div\b"), "÷"),
    (re.compile(r"\\infty\b"), "∞"),
    (re.compile(r"\\sim\b"), "≈"),
    (re.compile(r"\\text\{([^}]*)\}"), r"\1"),
    (re.compile(r"\\mathrm\{([^}]*)\}"), r"\1"),
    (re.compile(r"\\mathbf\{([^}]*)\}"), r"\1"),
    (re.compile(r"\\%"), "%"),
    (re.compile(r"\\_"), "_"),
    (re.compile(r"\\&"), "&"),
]

# Private Use Area code points: they cannot occur in agent prose, and distinct
# open/close markers mean two adjacent placeholders share no character — so
# restoring the first cannot consume the second's boundary.
LITERAL_DOLLAR = "\ue000"
AMOUNT_OPEN = "\ue001"
AMOUNT_CLOSE = "\ue002"

_FRACTION = re.compile(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}")
_APPROX_TILDE = re.compile(r"(?<!~)~(?=\s?[\d$])")
_DISPLAY_MATH = re.compile(r"\$\$([\s\S]{1,300}?)\$\$")
_INLINE_MATH = re.compile(r"\$([^$\n]{0,80}?)\$")
_AMOUNT = re.compile(r"\$\d[\d,.]*\s?[kKmMbB]?")
_STASHED_AMOUNT = re.compile(f"{AMOUNT_OPEN}(\\d+){AMOUNT_CLOSE}")


def _linearize_fractions(text: str) -> str:
    """A fraction has to go linear: "\\frac{O + 4M + P}{6}" -> "(O + 4M + P) / 6"."""

    def parenthesize_if_compound(term: str) -> str:
        term = term.strip()
        return f"({term})" if re.search(r"[+\-×÷/\s]", term) else term

    return _FRACTION.sub(
        lambda m: f"{parenthesize_if_compound(m.group(1))} / {parenthesize_if_compound(m.group(2))}",
        text,
    )


def _approximation_tildes_to_symbol(text: str) -> str:
    """Agents write "~12,000 invoices" for an approximate figure.

    GitHub-flavoured Markdown pairs up loose tildes into strikethrough, so two
    approximations in one paragraph render everything between them as struck-out
    text — which in a client report reads as "withdrawn". Since the intent is
    always "approximately", promote it to the symbol that says so. A doubled
    tilde is deliberate strikethrough and is left alone.
    """
    return _APPROX_TILDE.sub("≈", text)


def _keep_or_unwrap(match: re.Match[str]) -> str:
    """Drop the delimiters and keep the value, unless the span carries markup
    we could not translate."""
    inner = match.group(1)
    return match.group(0) if "\\" in inner or not inner.strip() else inner.strip()


def strip_inline_latex(markdown: str) -> str:
    """Remove LaTeX markup without touching money.

    The agents are told to write plain business prose, but they still slip into
    LaTeX for comparisons and units ("$\\ge 85\\%$", "$\\text{pages}$"). Nothing
    in this report renders maths, so the markup would reach the reader verbatim.

    The delicate half is the inverse mistake: a dollar sign usually means money,
    and turning "$18,500" into "18,500" would quietly corrupt the commercials in
    a client deliverable. So amounts are set aside before any delimiter pairing
    happens, and only what remains is treated as maths.
    """
    # 1. An escaped `\$` is a literal dollar sign, not a delimiter.
    out = _approximation_tildes_to_symbol(
        _linearize_fractions(markdown.replace(r"\$", LITERAL_DOLLAR))
    )

    # 2. Translate the commands, leaving plain text plus bare delimiters.
    for pattern, replacement in LATEX_COMMANDS:
        out = pattern.sub(replacement, out)

    # 3. Display math ($$…$$) has to go before inline, or the inline pass reads
    #    the doubled delimiters as an empty span and leaves both pairs behind.
    out = _DISPLAY_MATH.sub(_keep_or_unwrap, out)

    # 4. Set real amounts aside. Doing this before pairing is what makes a line
    #    like "costs $18,500 at $≥ 85%$ accuracy" resolve correctly — otherwise
    #    the amount's sign pairs with the formula's opening one and strands the
    #    closing delimiter in the output.
    amounts: list[str] = []

    def stash(match: re.Match[str]) -> str:
        amount = match.group(0)
        # "$99.9%" is a percentage wearing delimiters, not an amount — leave it
        # for the pairing step below.
        if re.match(r"\s*%", match.string[match.end() :]):
            return amount
        amounts.append(amount)
        return f"{AMOUNT_OPEN}{len(amounts) - 1}{AMOUNT_CLOSE}"

    out = _AMOUNT.sub(stash, out)

    # 5. Every `$` still standing opens or closes a formula.
    out = _INLINE_MATH.sub(_keep_or_unwrap, out)

    # 6. Put the amounts and literal signs back.
    out = _STASHED_AMOUNT.sub(lambda m: amounts[int(m.group(1))], out)
    return out.replace(LITERAL_DOLLAR, "$")


# ---------------------------------------------------------------------------
# Tables
# ---------------------------------------------------------------------------

#: A run of `|---|---|` cells, which is what marks a line as a table.
DELIMITER_RUN = re.compile(r"\|(?:\s*:?-{3,}:?\s*\|)+")

_FENCE = re.compile(r"^\s*```")


def _split_row(row: str) -> list[str]:
    """Cells of one row, with the outer pipes stripped."""
    return [c.strip() for c in re.sub(r"^\||\|$", "", row.strip()).split("|")]


def normalize_inline_tables(markdown: str) -> str:
    """Split a table the agent crammed onto one line back into rows.

    Agents sometimes emit a whole table as `| a | b | | c | d |`. Markdown needs
    one row per line, so the renderer produces a paragraph of literal pipes: the
    header never appears, and the reader gets a wall of `|` in a client
    deliverable. It happened to the retainer table on a real engagement.

    The header tells us how many columns there are, so the body can be split
    back into rows by counting cells. The blank fragment left between rows by
    the `| |` boundary is skipped rather than counted as a cell.

    The agent that crams a table onto one line also tends to miscount the
    delimiter — three headers over four dashes — which the parser rejects on its
    own, so the delimiter is rebuilt from the header rather than trusted.
    """
    in_fence = False
    out: list[str] = []

    for line in markdown.split("\n"):
        if _FENCE.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue

        match = DELIMITER_RUN.search(line)
        # A delimiter at the start of its own line is a well-formed table.
        if not match or match.start() == 0:
            out.append(line)
            continue

        header = _split_row(line[: match.start()])
        if len(header) < 2:
            out.append(line)
            continue

        fragments = line[match.end() :].split("|")
        # Text before the first pipe and after the last belongs to no cell.
        if fragments and not fragments[0].strip():
            fragments.pop(0)
        if fragments and not fragments[-1].strip():
            fragments.pop()

        rows: list[list[str]] = []
        i = 0
        while i < len(fragments):
            row = [c.strip() for c in fragments[i : i + len(header)]]
            if not row:
                break
            rows.append(row)
            i += len(header)
            # The `| |` seam between two rows leaves one empty fragment behind.
            if i < len(fragments) and not fragments[i].strip():
                i += 1

        out.append(
            "\n".join(
                [
                    "| " + " | ".join(header) + " |",
                    "|" + "|".join("---" for _ in header) + "|",
                    *["| " + " | ".join(r) + " |" for r in rows],
                ]
            )
        )

    return "\n".join(out)


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

_MERMAID_BREAK = re.compile(r"<br\s*/?>", re.IGNORECASE)
_TABLE_OPEN = re.compile(r"<table>")
_TABLE_CLOSE = re.compile(r"</table>")

# "gfm-like" is the preset closest to the `marked` configuration the TypeScript
# renderer used: CommonMark plus tables, strikethrough and autolinking.
# Task lists are not in the preset, but the guardrails agent writes its
# pre-production checklist as "- [ ] item" and marked renders those as
# checkboxes. Without the plugin they arrive as literal brackets.
_md = MarkdownIt("gfm-like").use(tasklists_plugin)


def _render_fence(self, tokens, idx, options, env):  # noqa: ANN001, ARG001
    token = tokens[idx]
    if token.info.strip() == "mermaid":
        # The agents write node labels with <br/> in them. Mermaid runs with
        # securityLevel "strict", which sanitizes the tag out of the label
        # before laying the node out — so "Lead FDE Track<br/>Cockpit UI"
        # arrives as "Lead FDE TrackCockpit UI", two words fused, and the node
        # is sized for the line count it no longer has, leaving the last line
        # spilling out of its box. Turning the break into a space lets mermaid
        # wrap and measure the label itself.
        return f'<pre class="mermaid">{_MERMAID_BREAK.sub(" ", token.content)}</pre>'
    escaped = (
        token.content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )
    return f'<pre class="code-block"><code>{escaped}</code></pre>'


_md.add_render_rule("fence", _render_fence)


def markdown_to_html(markdown: str) -> str:
    """Render an agent artifact, with every sanitiser applied first."""
    html = _md.render(normalize_inline_tables(strip_inline_latex(markdown)))

    # Give every table its own scroll container. Below roughly 860px the agents'
    # wider tables — 7 columns of PERT estimates, a connector matrix — were
    # compressed until "12.67" broke across two lines and a header column read
    # one letter per row. Scrolling one table sideways costs the reader far less
    # than that, and the prose around it keeps reflowing normally.
    html = _TABLE_OPEN.sub('<div class="table-scroll"><table>', html)
    return _TABLE_CLOSE.sub("</table></div>", html)
