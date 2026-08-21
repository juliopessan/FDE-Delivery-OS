import { NextResponse } from "next/server";
import { callEngine } from "@/lib/engine";

export const maxDuration = 60;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await callEngine("regenerate-report", id);

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
