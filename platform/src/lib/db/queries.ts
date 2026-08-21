import { eq } from "drizzle-orm";
import { db } from "./client";
import { phaseRuns, reports } from "./schema";

/**
 * Reads the dashboard and the report route need.
 *
 * These used to live in the pipeline module, which meant a route that only
 * wanted to list phase runs pulled in the model client and every agent prompt
 * behind it. The pipeline now runs in the Python engine; what stayed behind is
 * this — plain queries against tables Drizzle owns.
 */

export async function getEngagementRuns(engagementId: string) {
  return db.select().from(phaseRuns).where(eq(phaseRuns.engagementId, engagementId));
}

export async function getLatestReport(engagementId: string) {
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.engagementId, engagementId));
  return rows.at(-1);
}
