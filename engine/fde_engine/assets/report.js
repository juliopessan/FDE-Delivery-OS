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

        // Record the width mermaid actually laid the diagram out at, so the
        // stylesheet can cap it there instead of scaling it up to the column.
        const el = node.querySelector("svg");
        const box = el && el.viewBox && el.viewBox.baseVal;
        if (box && box.width) {
          node.style.setProperty("--diagram-w", Math.ceil(box.width) + "px");
        }
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
