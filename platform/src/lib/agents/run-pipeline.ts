import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { engagements, phaseRuns, reports } from "@/lib/db/schema";
import { AGENT_ROSTER, type AgentDefinition } from "./roster";
import { MASTER_SYNTHESIS_PROMPT } from "./prompts/master";
import { generateText } from "./llm-client";
import { renderConsolidatedReport } from "@/lib/report/render";

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

/**
 * Output ceiling per agent artifact. Generous on purpose: Gemini 3.x bills
 * its internal reasoning ("thoughts") against this same budget, and on real
 * engagements reasoning alone has run to ~1.3k tokens while the visible
 * artifact ran past 7.9k — enough to clip a late-pipeline agent mid-sentence
 * at the previous 8k ceiling.
 */
const AGENT_MAX_TOKENS = 24000;

/** The executive summary is a synthesis, not a full artifact — it stays short by design. */
const SYNTHESIS_MAX_TOKENS = 8000;

async function runAgent(
  agent: AgentDefinition,
  brief: string,
  priorOutputs: { agentName: string; phaseLabel: string; output: string }[]
) {
  const priorContext = priorOutputs.length
    ? `\n\n## Prior phase outputs in this engagement (for context)\n\n${priorOutputs
        .map((p) => `### ${p.phaseLabel} — ${p.agentName}\n\n${p.output}`)
        .join("\n\n---\n\n")}`
    : "";

  const result = await generateText({
    system: agent.systemPrompt,
    prompt: `${brief}${priorContext}\n\nProduce your artifact now.`,
    maxTokens: AGENT_MAX_TOKENS,
  });

  if (result.truncated) {
    console.warn(
      `[run-pipeline] Agent "${agent.key}" hit the ${AGENT_MAX_TOKENS}-token output ceiling — its artifact is cut off mid-thought.`
    );
  }

  return result;
}

export async function runEngagementPipeline(engagementId: string) {
  const [engagement] = await db
    .select()
    .from(engagements)
    .where(eq(engagements.id, engagementId));

  if (!engagement) throw new Error(`Engagement not found: ${engagementId}`);

  const brief = engagementBrief(engagement);
  const priorOutputs: { agentName: string; phaseLabel: string; output: string }[] = [];

  for (const agent of AGENT_ROSTER) {
    await db
      .update(engagements)
      .set({ phase: agent.phaseKey, updatedAt: new Date().toISOString() })
      .where(eq(engagements.id, engagementId));

    const runId = nanoid();
    const startedAt = new Date().toISOString();

    await db.insert(phaseRuns).values({
      id: runId,
      engagementId,
      phaseKey: agent.phaseKey,
      agentKey: agent.key,
      agentName: agent.name,
      status: "running",
      model: agent.model,
      startedAt,
    });

    try {
      const { text, model, promptTokens, completionTokens } = await runAgent(
        agent,
        brief,
        priorOutputs
      );

      await db
        .update(phaseRuns)
        .set({
          status: "completed",
          model,
          outputMarkdown: text,
          promptTokens,
          completionTokens,
          completedAt: new Date().toISOString(),
        })
        .where(eq(phaseRuns.id, runId));

      priorOutputs.push({ agentName: agent.name, phaseLabel: agent.phaseLabel, output: text });
    } catch (err) {
      await db
        .update(phaseRuns)
        .set({
          status: "failed",
          errorMessage: err instanceof Error ? err.message : String(err),
          completedAt: new Date().toISOString(),
        })
        .where(eq(phaseRuns.id, runId));
      throw err;
    }
  }

  const { executiveSummary } = await synthesizeAndRender(engagement, priorOutputs, 1);

  await db
    .update(engagements)
    .set({ phase: "scale", status: "completed", updatedAt: new Date().toISOString() })
    .where(eq(engagements.id, engagementId));

  return { executiveSummary };
}

async function synthesizeAndRender(
  engagement: typeof engagements.$inferSelect,
  phaseReports: { agentName: string; phaseLabel: string; output: string }[],
  version: number
) {
  const brief = engagementBrief(engagement);

  console.log(`[synthesizeAndRender] engagement=${engagement.id} version=${version} starting master synthesis...`);

  // Master orchestrator: synthesize an executive summary over every phase output.
  const synthesis = await generateText({
    system: MASTER_SYNTHESIS_PROMPT,
    prompt: `${brief}\n\n## Completed phase reports\n\n${phaseReports
      .map((p) => `### ${p.phaseLabel} — ${p.agentName}\n\n${p.output}`)
      .join("\n\n---\n\n")}`,
    maxTokens: SYNTHESIS_MAX_TOKENS,
  });

  if (synthesis.truncated) {
    console.warn(
      `[synthesizeAndRender] Executive summary hit the ${SYNTHESIS_MAX_TOKENS}-token ceiling and is cut off.`
    );
  }

  console.log(`[synthesizeAndRender] engagement=${engagement.id} version=${version} synthesis done (model=${synthesis.model}), rendering HTML...`);

  const html = renderConsolidatedReport({
    engagement,
    executiveSummary: synthesis.text,
    phaseReports,
  });

  console.log(`[synthesizeAndRender] engagement=${engagement.id} version=${version} HTML rendered (${html.length} chars), inserting report row...`);

  await db.insert(reports).values({
    id: nanoid(),
    engagementId: engagement.id,
    version,
    htmlContent: html,
  });

  console.log(`[synthesizeAndRender] engagement=${engagement.id} version=${version} report row inserted.`);

  return { executiveSummary: synthesis.text };
}

/**
 * Re-synthesizes the executive summary and re-renders the HTML report from
 * an engagement's already-completed phase_runs, without re-running the full
 * (billed) 9-agent pipeline. Useful after fixing a bug in the report
 * template or in a stored phase output.
 */
export async function regenerateReport(engagementId: string) {
  const [engagement] = await db
    .select()
    .from(engagements)
    .where(eq(engagements.id, engagementId));
  if (!engagement) throw new Error(`Engagement not found: ${engagementId}`);

  const runs = await db.select().from(phaseRuns).where(eq(phaseRuns.engagementId, engagementId));

  const phaseReports = AGENT_ROSTER.map((agent) => {
    const run = runs.find((r) => r.agentKey === agent.key);
    if (!run || !run.outputMarkdown) {
      throw new Error(`Missing completed output for agent ${agent.key}`);
    }
    return { agentName: agent.name, phaseLabel: agent.phaseLabel, output: run.outputMarkdown };
  });

  const existingReports = await db
    .select()
    .from(reports)
    .where(eq(reports.engagementId, engagementId));
  const nextVersion = (existingReports.at(-1)?.version ?? 0) + 1;

  return synthesizeAndRender(engagement, phaseReports, nextVersion);
}

export async function getEngagementRuns(engagementId: string) {
  return db
    .select()
    .from(phaseRuns)
    .where(eq(phaseRuns.engagementId, engagementId));
}

export async function getLatestReport(engagementId: string) {
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.engagementId, engagementId));
  return rows.at(-1);
}
