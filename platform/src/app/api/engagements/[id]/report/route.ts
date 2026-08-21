import { NextResponse } from "next/server";
import { getLatestReport } from "@/lib/db/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await getLatestReport(id);

  if (!report) {
    return NextResponse.json({ error: "Report not generated yet." }, { status: 404 });
  }

  return new NextResponse(report.htmlContent, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
