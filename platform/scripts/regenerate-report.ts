/**
 * One-off maintenance script: re-synthesizes the executive summary and
 * re-renders the consolidated HTML report for an engagement from its
 * already-completed phase_runs, without re-running the full 9-agent
 * pipeline. Thin wrapper around lib/agents/run-pipeline.ts#regenerateReport
 * — the same function the /api/engagements/[id]/regenerate-report route
 * uses, so this stays in sync with the app automatically.
 *
 * Usage: npx tsx scripts/regenerate-report.ts <engagementId>
 */
import { regenerateReport } from "../src/lib/agents/run-pipeline";

async function main() {
  const engagementId = process.argv[2];
  if (!engagementId) {
    console.error("Usage: npx tsx scripts/regenerate-report.ts <engagementId>");
    process.exit(1);
  }

  console.log("Re-synthesizing executive summary and re-rendering report...");
  const { executiveSummary } = await regenerateReport(engagementId);
  console.log("Done. Executive summary length:", executiveSummary.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
