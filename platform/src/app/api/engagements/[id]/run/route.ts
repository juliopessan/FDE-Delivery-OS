import { NextResponse } from "next/server";
import { callEngine } from "@/lib/engine";

export const maxDuration = 300;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await callEngine("run", id);

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
