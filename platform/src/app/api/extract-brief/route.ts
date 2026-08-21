import { NextRequest, NextResponse } from "next/server";
import { callEngineWithInput } from "@/lib/engine";

export async function POST(req: NextRequest) {
  const { rawIntake } = await req.json();
  if (!rawIntake || typeof rawIntake !== "string" || !rawIntake.trim()) {
    return NextResponse.json({ error: "rawIntake is required." }, { status: 400 });
  }

  const result = await callEngineWithInput("extract-brief", rawIntake);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ brief: result.brief });
}
