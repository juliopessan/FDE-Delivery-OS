/**
 * One-off repair: re-runs only the agents whose stored artifact was clipped by
 * the old 8k output ceiling, plus every agent downstream of them (those
 * consumed the clipped text as context). Leaves report regeneration to
 * regenerate-report.ts / the API route.
 *
 * Usage: npx tsx scripts/repair-truncated.ts <engagementId> <firstAgentKey>
 */
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { engagements, phaseRuns } from "../src/lib/db/schema";
import { AGENT_ROSTER } from "../src/lib/agents/roster";
import { generateText } from "../src/lib/agents/llm-client";

const AGENT_MAX_TOKENS = 24000;

function engagementBrief(engagement: typeof engagements.$inferSelect) {
  const summary = `## Engagement Brief

- Customer: ${engagement.customerName}
- Industry: ${engagement.industry ?? "Not provided"}
- Company size: ${engagement.companySize ?? "Not provided"}
- Stated objective: ${engagement.objective}
- Current baseline / pain: ${engagement.currentBaseline ?? "Not provided"}
- Constraints: ${engagement.constraints ?? "Not provided"}`;

  const rawIntake = engagement.rawIntake?.trim()
    ? `\n\n## Full Discovery Intake (verbatim client document — treat as the primary source of truth; the summary fields above are a condensed excerpt of this document)\n\n${engagement.rawIntake}`
    : "";

  return `${summary}${rawIntake}\n\nWork strictly from the facts above. Where you need a fact that is not
provided, say so explicitly rather than inventing it.`;
}

async function main() {
  const [engagementId, firstAgentKey] = process.argv.slice(2);
  if (!engagementId || !firstAgentKey) {
    console.error("Usage: npx tsx scripts/repair-truncated.ts <engagementId> <firstAgentKey>");
    process.exit(1);
  }

  const [engagement] = await db.select().from(engagements).where(eq(engagements.id, engagementId));
  if (!engagement) throw new Error(`Engagement not found: ${engagementId}`);

  const startIndex = AGENT_ROSTER.findIndex((a) => a.key === firstAgentKey);
  if (startIndex === -1) throw new Error(`Unknown agent key: ${firstAgentKey}`);

  const runs = await db.select().from(phaseRuns).where(eq(phaseRuns.engagementId, engagementId));
  const brief = engagementBrief(engagement);

  // Rebuild the context chain exactly as the pipeline does: every prior agent's
  // full artifact, in roster order.
  const priorOutputs: { agentName: string; phaseLabel: string; output: string }[] = [];
  for (const agent of AGENT_ROSTER.slice(0, startIndex)) {
    const run = runs.find((r) => r.agentKey === agent.key);
    if (!run?.outputMarkdown) throw new Error(`Missing upstream output for ${agent.key}`);
    priorOutputs.push({ agentName: agent.name, phaseLabel: agent.phaseLabel, output: run.outputMarkdown });
  }

  for (const agent of AGENT_ROSTER.slice(startIndex)) {
    const run = runs.find((r) => r.agentKey === agent.key);
    if (!run) throw new Error(`No phase_run row for ${agent.key}`);

    const priorContext = priorOutputs.length
      ? `\n\n## Prior phase outputs in this engagement (for context)\n\n${priorOutputs
          .map((p) => `### ${p.phaseLabel} — ${p.agentName}\n\n${p.output}`)
          .join("\n\n---\n\n")}`
      : "";

    process.stdout.write(`Re-running ${agent.key}… `);
    // Stamp the new start too. Updating only completedAt leaves the original
    // run's start in place, and the phase then reports the gap between the two
    // sessions as its duration — an hours-long phase in the report.
    const startedAt = new Date().toISOString();
    const result = await generateText({
      system: agent.systemPrompt,
      prompt: `${brief}${priorContext}\n\nProduce your artifact now.`,
      maxTokens: AGENT_MAX_TOKENS,
    });

    await db
      .update(phaseRuns)
      .set({
        status: "completed",
        model: result.model,
        outputMarkdown: result.text,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        errorMessage: null,
        startedAt,
        completedAt: new Date().toISOString(),
      })
      .where(eq(phaseRuns.id, run.id));

    console.log(
      `${result.text.length} chars, ${result.completionTokens} completion tokens, truncated=${result.truncated ?? false}`
    );

    priorOutputs.push({ agentName: agent.name, phaseLabel: agent.phaseLabel, output: result.text });
  }

  console.log("Repair complete. Regenerate the report to pick up the new artifacts.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
