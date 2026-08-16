import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/agents/llm-client";
import { EXTRACT_BRIEF_PROMPT } from "@/lib/agents/prompts/extract-brief";

interface ExtractedBrief {
  customerName: string;
  industry: string;
  companySize: string;
  objective: string;
  currentBaseline: string;
  constraints: string;
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : trimmed;
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set on the server." },
      { status: 500 }
    );
  }

  const { rawIntake } = await req.json();
  if (!rawIntake || typeof rawIntake !== "string" || !rawIntake.trim()) {
    return NextResponse.json({ error: "rawIntake is required." }, { status: 400 });
  }

  try {
    const result = await generateText({
      system: EXTRACT_BRIEF_PROMPT,
      prompt: rawIntake,
      maxTokens: 1000,
    });

    const parsed = JSON.parse(stripCodeFence(result.text)) as ExtractedBrief;
    return NextResponse.json({ brief: parsed, model: result.model });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Extraction failed." },
      { status: 500 }
    );
  }
}
