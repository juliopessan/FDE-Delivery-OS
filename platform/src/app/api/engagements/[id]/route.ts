import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { engagements } from "@/lib/db/schema";
import { getEngagementRuns, getLatestReport } from "@/lib/db/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [engagement] = await db.select().from(engagements).where(eq(engagements.id, id));

  if (!engagement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const runs = await getEngagementRuns(id);
  const report = await getLatestReport(id);

  return NextResponse.json({ engagement, runs, report: report ?? null });
}
