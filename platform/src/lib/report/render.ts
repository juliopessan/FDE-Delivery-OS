import { markdownToHtml } from "./markdown";
import type { Engagement } from "@/lib/db/schema";

interface PhaseReport {
  agentName: string;
  phaseLabel: string;
  output: string;
}

interface RenderArgs {
  engagement: Engagement;
  executiveSummary: string;
  phaseReports: PhaseReport[];
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function renderConsolidatedReport({
  engagement,
  executiveSummary,
  phaseReports,
}: RenderArgs): string {
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const toc = phaseReports
    .map(
      (p, i) =>
        `<a class="toc-link" href="#${slug(p.phaseLabel)}-${i}"><span class="toc-index">${String(
          i + 1
        ).padStart(2, "0")}</span><span>${p.phaseLabel}</span><span class="toc-agent">${p.agentName}</span></a>`
    )
    .join("\n");

  const sections = phaseReports
    .map(
      (p, i) => `
      <section class="phase-section" id="${slug(p.phaseLabel)}-${i}">
        <div class="phase-heading">
          <span class="phase-index">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <div class="eyebrow">${p.phaseLabel}</div>
            <h2 class="agent-title">${p.agentName}</h2>
          </div>
        </div>
        <div class="prose">${markdownToHtml(p.output)}</div>
      </section>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${engagement.customerName} — FDE OS Enterprise Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink: #14150F;
    --inksoft: #1C1F18;
    --paper: #F2F0EA;
    --paper2: #EDEAE0;
    --lime: #C4F04C;
    --amber: #E8B84B;
    --rust: #D97757;
    --peach: #E8916E;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .mono { font-family: 'JetBrains Mono', ui-monospace, 'Courier New', monospace; }
  .serif-italic { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; }

  header.masthead {
    border-bottom: 1px solid rgba(20,21,15,0.12);
    padding: 20px 6vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-badge {
    width: 28px; height: 28px; background: var(--ink);
    display: flex; align-items: center; justify-content: center;
    color: var(--lime); font-size: 13px; font-weight: 500;
  }
  .brand-name { font-size: 12px; letter-spacing: 0.24em; font-weight: 500; }
  .masthead-meta { font-size: 10px; letter-spacing: 0.2em; color: rgba(20,21,15,0.4); text-transform: uppercase; }

  main { max-width: 900px; margin: 0 auto; padding: 64px 6vw 96px; }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(20,21,15,0.45);
  }
  .eyebrow::before { content: ""; width: 20px; height: 1px; background: rgba(20,21,15,0.3); display: inline-block; }

  h1.report-title {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    line-height: 0.98;
    letter-spacing: -0.03em;
    font-weight: 700;
    margin: 18px 0 14px;
  }
  .report-objective {
    font-size: clamp(1.05rem, 1.6vw, 1.25rem);
    line-height: 1.5;
    color: rgba(20,21,15,0.75);
    max-width: 62ch;
    margin: 0 0 20px;
  }
  .report-sub { color: rgba(20,21,15,0.65); font-size: 15px; max-width: 62ch; line-height: 1.6; }

  .meta-row { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(20,21,15,0.12); }
  .meta-item .label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(20,21,15,0.4); margin-bottom: 4px; }
  .meta-item .value { font-size: 14px; font-weight: 500; }

  .exec-summary {
    margin-top: 48px; background: var(--ink); color: var(--paper2);
    padding: 40px clamp(20px, 4vw, 48px);
  }
  .exec-summary .eyebrow { color: rgba(242,240,234,0.5); }
  .exec-summary .eyebrow::before { background: rgba(242,240,234,0.3); }
  .exec-summary .prose { color: var(--paper2); }
  .exec-summary .prose h1 { color: var(--paper); }
  .exec-summary .prose h2, .exec-summary .prose h3 { color: var(--paper); }
  .exec-summary .prose table { border-color: rgba(242,240,234,0.18); }
  .exec-summary .prose th, .exec-summary .prose td { border-color: rgba(242,240,234,0.18); }
  .exec-summary .prose th { background: rgba(242,240,234,0.1); color: var(--paper); }
  .exec-summary .prose td { color: var(--paper2); }
  .exec-summary .prose code { background: rgba(242,240,234,0.12); color: var(--paper); }
  .exec-summary .prose a { color: var(--peach); }

  .toc { margin-top: 56px; }
  .toc-link {
    display: grid; grid-template-columns: 32px 1fr auto; gap: 16px; align-items: baseline;
    padding: 16px 0; border-bottom: 1px solid rgba(20,21,15,0.12);
    text-decoration: none; color: var(--ink);
  }
  .toc-index { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--rust); }
  .toc-agent { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: rgba(20,21,15,0.4); text-transform: uppercase; }

  .phase-section { margin-top: 72px; padding-top: 40px; border-top: 1px solid rgba(20,21,15,0.14); }
  .phase-heading { display: flex; gap: 20px; align-items: baseline; margin-bottom: 24px; }
  .phase-index { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--rust); }
  .agent-title { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.01em; margin: 4px 0 0; }

  .prose h1 { font-size: 1.7rem; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.01em; }
  .prose h2 { font-size: 1.25rem; font-weight: 700; margin: 32px 0 12px; }
  .prose h3 { font-size: 1.05rem; font-weight: 700; margin: 24px 0 10px; }
  .prose p { line-height: 1.7; margin: 0 0 14px; }
  .prose ul, .prose ol { line-height: 1.7; margin: 0 0 14px; padding-left: 22px; }
  .prose li { margin-bottom: 6px; }
  .prose strong { font-weight: 700; }
  .prose a { color: var(--rust); }

  .prose table { width: 100%; border-collapse: collapse; margin: 18px 0 24px; font-size: 13.5px; }
  .prose th, .prose td { border: 1px solid rgba(20,21,15,0.16); padding: 8px 10px; text-align: left; vertical-align: top; }
  .prose th { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; background: var(--paper2); }

  .prose pre.code-block, .prose pre.mermaid {
    background: var(--inksoft); color: var(--paper2);
    padding: 16px; overflow-x: auto; font-size: 13px; margin: 16px 0;
  }
  .prose pre.mermaid {
    background: var(--paper2); color: var(--ink);
    display: flex; justify-content: center; align-items: center;
  }
  /* Every diagram scales to the same content width and caps its height, so a
     26-node architecture diagram and a 4-node flowchart read at a consistent
     visual size instead of whatever size mermaid happened to lay out. */
  .prose pre.mermaid svg {
    max-width: 100% !important;
    max-height: 560px;
    height: auto !important;
    width: auto;
    margin: 0 auto;
  }
  .prose .diagram-fallback { width: 100%; }
  .prose .diagram-fallback-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--rust); margin-bottom: 8px;
  }
  .prose code { font-family: 'JetBrains Mono', monospace; background: rgba(20,21,15,0.06); padding: 1px 5px; font-size: 0.9em; }

  footer.report-footer { border-top: 1px solid rgba(20,21,15,0.12); padding: 32px 6vw; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  footer.report-footer .mono { font-size: 10px; letter-spacing: 0.14em; color: rgba(20,21,15,0.4); text-transform: uppercase; }

  @media print {
    .exec-summary { break-inside: avoid; }
    .phase-section { break-before: page; }
  }
</style>
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    securityLevel: "strict",
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
    stateDiagram: { useMaxWidth: true },
  });

  // Render each diagram independently so one malformed diagram degrades
  // gracefully to its raw source instead of leaving every diagram on the
  // page blank.
  async function renderDiagrams() {
    const nodes = document.querySelectorAll("pre.mermaid");
    let i = 0;
    for (const node of nodes) {
      const code = node.textContent ?? "";
      const id = "mmd-" + i++;
      try {
        const { svg } = await mermaid.render(id, code);
        node.innerHTML = svg;
      } catch (err) {
        console.error("Mermaid diagram failed to render:", err);
        const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        node.classList.remove("mermaid");
        node.innerHTML =
          '<div class="diagram-fallback"><div class="diagram-fallback-label">Diagram unavailable — showing source</div><pre class="code-block">' +
          escaped +
          "</pre></div>";
      }
    }
  }
  renderDiagrams();
</script>
</head>
<body>
  <header class="masthead">
    <div class="brand">
      <div class="brand-badge">F</div>
      <span class="brand-name mono">FDE OS</span>
    </div>
    <span class="masthead-meta">Enterprise Report / v1</span>
  </header>

  <main>
    <div class="eyebrow">Consolidated Delivery Report</div>
    <h1 class="report-title">${engagement.customerName}</h1>
    <p class="report-objective">${engagement.objective}</p>
    <p class="report-sub">Generated by the FDE OS agent pipeline — every phase below was produced independently by the specialist agent named in its heading, then synthesized by the Master Orchestrator into the executive summary above.</p>

    <div class="meta-row">
      <div class="meta-item"><div class="label">Customer</div><div class="value">${engagement.customerName}</div></div>
      <div class="meta-item"><div class="label">Industry</div><div class="value">${engagement.industry ?? "—"}</div></div>
      <div class="meta-item"><div class="label">Company size</div><div class="value">${engagement.companySize ?? "—"}</div></div>
      <div class="meta-item"><div class="label">Generated</div><div class="value">${generatedAt}</div></div>
      <div class="meta-item"><div class="label">Phases run</div><div class="value">${phaseReports.length}</div></div>
    </div>

    <div class="exec-summary">
      <div class="eyebrow">Executive Summary</div>
      <div class="prose">${markdownToHtml(executiveSummary)}</div>
    </div>

    <div class="toc">
      <div class="eyebrow">Pipeline Contents</div>
      <div style="margin-top:16px;">${toc}</div>
    </div>

    ${sections}
  </main>

  <footer class="report-footer">
    <span class="mono">FDE OS — Agentic Delivery Operating System</span>
    <span class="mono">Generated ${generatedAt}</span>
  </footer>
</body>
</html>`;
}
