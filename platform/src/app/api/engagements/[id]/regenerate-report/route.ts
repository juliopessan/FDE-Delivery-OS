import { NextResponse } from "next/server";
import { regenerateReport } from "@/lib/agents/run-pipeline";

export const maxDuration = 60;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log(`[regenerate-report route] engagement=${id} received POST`);
  try {
    const result = await regenerateReport(id);
    console.log(`[regenerate-report route] engagement=${id} success, summary length=${result.executiveSummary.length}`);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error(`[regenerate-report route] engagement=${id} failed:`, err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
