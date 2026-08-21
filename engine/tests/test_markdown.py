"""The sanitiser cases, ported verbatim from the TypeScript suite.

Extracted from platform/scripts/test-latex-strip.ts by evaluating its case
arrays rather than retyping them, so the two implementations are held to
literally the same expectations. When a case is added on either side, add it on
both — a divergence here is the port drifting.
"""

import pytest

from fde_engine.markdown import (
    markdown_to_html,
    normalize_inline_tables,
    strip_inline_latex,
)

# The agents are told to write plain prose, but they still slip into LaTeX for
# comparisons and units. The tricky half is the inverse error: a dollar sign
# usually means money, and mangling "$18,500" into "18,500" would silently
# corrupt the commercials in a client deliverable.
LATEX_CASES = [
    ('STP $\\ge 65\\%$ maintained', 'STP ≥ 65% maintained'),
    ('cost $\\le 0.15$ per invoice', 'cost ≤ 0.15 per invoice'),
    ('Park $\\rightarrow$ Approve', 'Park → Approve'),
    ('drift $\\pm 0.01$ tolerance', 'drift ± 0.01 tolerance'),
    ('latency $> 6.0\\text{s}$ alerts', 'latency > 6.0s alerts'),
    ('recall $< 0.85$ blocks release', 'recall < 0.85 blocks release'),
    ('variable $P$ denotes price', 'variable P denotes price'),
    ('metric $AHT_E$ per phase', 'metric AHT_E per phase'),
    ('Guarantees $99.9\\%$ ERP uptime', 'Guarantees 99.9% ERP uptime'),
    ('ceiling ($\\le \\$0.15$ per invoice)', 'ceiling (≤ $0.15 per invoice)'),
    ('saves $66,334.22 USD monthly', 'saves $66,334.22 USD monthly'),
    ('between $18,500 and $24,000 fixed', 'between $18,500 and $24,000 fixed'),
    ('budget of $150k needs approval', 'budget of $150k needs approval'),
    ('costs $18,500 at $\\ge 85\\%$ accuracy', 'costs $18,500 at ≥ 85% accuracy'),
    ('$5,000/mo retainer keeps STP $\\ge 65\\%$', '$5,000/mo retainer keeps STP ≥ 65%'),
    ('PERT formula: $E = \\frac{O + 4M + P}{6}$, where:', 'PERT formula: E = (O + 4M + P) / 6, where:'),
    ('check: $\\sum Line \\ne Total$ fails', 'check: Σ Line ≠ Total fails'),
    ('($Gross \\ne Net + Tax$)', '(Gross ≠ Net + Tax)'),
    ('$$\\text{Manual Effort Reduction} = \\frac{1,820}{2,800} = \\mathbf{65.0\\%}$$', 'Manual Effort Reduction = 1,820 / 2,800 = 65.0%'),
    ('$$ROI = 61,906 / 5,000$$', 'ROI = 61,906 / 5,000'),
    ('~12,000 invoices at ~14 minutes each', '≈12,000 invoices at ≈14 minutes each'),
    ('(~16-18 FTE) processing ~2,800 hours', '(≈16-18 FTE) processing ≈2,800 hours'),
    ('cost of ~$1,794 per month', 'cost of ≈$1,794 per month'),
    ('~ 6.0% error rate', '≈ 6.0% error rate'),
    ('the ~~old baseline~~ is superseded', 'the ~~old baseline~~ is superseded'),
    ('from $18,500 to $24,000 fixed', 'from $18,500 to $24,000 fixed'),
    ('| $5,000 | $61,906 | $742,872 |', '| $5,000 | $61,906 | $742,872 |'),
    ('$1,794 $61,906 $35.00 $0.15', '$1,794 $61,906 $35.00 $0.15'),
]

# Tables the agents cram onto one line. Markdown needs a row per line, so the
# crammed form renders as a paragraph of literal pipes — the header never
# appears at all.
TABLE_CASES = [
    ('| Workstream | Hours | Output | |---|---|---|---| | Prompt tuning | 10.0 | Refine extraction. | | Total | 30.0 | $6,000 / month |', '| Workstream | Hours | Output |\n|---|---|---|\n| Prompt tuning | 10.0 | Refine extraction. |\n| Total | 30.0 | $6,000 / month |'),
    ('| A | B |\n|---|---|\n| 1 | 2 |', '| A | B |\n|---|---|\n| 1 | 2 |'),
    ('```\n| a |---|---| b |\n```', '```\n| a |---|---| b |\n```'),
    ('Route A | Route B are both viable', 'Route A | Route B are both viable'),
]


@pytest.mark.parametrize(("source", "expected"), LATEX_CASES)
def test_strip_inline_latex(source: str, expected: str) -> None:
    assert strip_inline_latex(source) == expected


@pytest.mark.parametrize(("source", "expected"), TABLE_CASES)
def test_normalize_inline_tables(source: str, expected: str) -> None:
    assert normalize_inline_tables(source) == expected


def test_crammed_table_renders_with_a_header() -> None:
    """The end-to-end case the normalizer exists for.

    Asserted through the renderer, not just the normalizer, because the failure
    that reached a client was a rendering one: the parser rejects a delimiter
    whose cell count does not match the header, so fixing the line breaks alone
    still produced a wall of pipes.
    """
    html = markdown_to_html(
        "| Workstream | Hours | Output | |---|---|---|---| "
        "| Prompt tuning | 10.0 | Refine extraction. | "
        "| Total | 30.0 | $6,000 / month |"
    )
    assert "<th>Workstream</th>" in html
    assert ">Prompt tuning</td>" in html
    assert "$6,000 / month" in html, "an amount must survive the LaTeX pass"
    assert "|---" not in html, "no literal delimiter may reach the reader"


def test_mermaid_fence_keeps_its_label_on_one_line() -> None:
    """Mermaid runs at securityLevel strict, which strips the tag before laying
    the node out — so the words fuse and the box is sized for a line count the
    label no longer has."""
    html = markdown_to_html('```mermaid\nA["Lead FDE Track<br/>Cockpit UI"]\n```')
    assert '<pre class="mermaid">' in html
    assert "<br" not in html
    assert "Lead FDE Track Cockpit UI" in html


def test_tables_are_wrapped_in_a_scroll_container() -> None:
    html = markdown_to_html("| A | B |\n|---|---|\n| 1 | 2 |")
    assert '<div class="table-scroll">' in html
    assert "</table></div>" in html


def test_cells_carry_their_column_name() -> None:
    """A table is a grid because the header sits above the column.

    Take the grid away — which is what a phone does — and every cell loses the
    one thing that said what it was, so the header rides along on each cell for
    the stylesheet to show when it stacks the rows.
    """
    html = markdown_to_html(
        "| Criterion | Weight |\n|---|---|\n| Measurable Pain | High |"
    )
    assert '<td data-label="Criterion">Measurable Pain</td>' in html
    assert '<td data-label="Weight">High</td>' in html


def test_a_wide_table_is_marked_wide() -> None:
    """Five columns or more keeps the grid and scrolls sideways instead.

    Stacking a comparison matrix destroys the comparison and turns one table
    into several screens. The count is decided here rather than in CSS, which
    would need a :has() inside a :has() to ask — and that is not valid CSS.
    """
    narrow = markdown_to_html("| A | B | C | D |\n|---|---|---|---|\n| 1 | 2 | 3 | 4 |")
    wide = markdown_to_html(
        "| A | B | C | D | E |\n|---|---|---|---|---|\n| 1 | 2 | 3 | 4 | 5 |"
    )
    assert '<div class="table-scroll">' in narrow
    assert '<div class="table-scroll wide">' in wide
