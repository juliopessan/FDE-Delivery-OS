import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL = "gemini-3.7-flash";
export const HAIKU_MODEL = "claude-haiku-4-5-20251001";

export interface GenerateArgs {
  system: string;
  prompt: string;
  maxTokens: number;
}

export interface GenerateResult {
  text: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
}

const CALL_TIMEOUT_MS = 90_000;

function withTimeout<T>(promise: Promise<T>, label: string, ms = CALL_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Primary/fallback model routing for the agent pipeline: Gemini 3.7 Flash
 * first (fast, cheap — the roster runs 9+ sequential calls per engagement),
 * falling back to Claude Haiku 4.5 if Gemini is unavailable, errors, or no
 * GEMINI_API_KEY is configured. Callers never need to know which model
 * actually answered — the returned `model` field records it for the audit
 * trail (persisted per phase run).
 */
export async function generateText({
  system,
  prompt,
  maxTokens,
}: GenerateArgs): Promise<GenerateResult> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      return await withTimeout(
        generateWithGemini(geminiKey, { system, prompt, maxTokens }),
        "Gemini call"
      );
    } catch (err) {
      console.error(
        `[llm-client] Gemini call failed, falling back to Haiku: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    throw new Error(
      "Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set. Add at least one to platform/.env.local."
    );
  }

  return withTimeout(
    generateWithHaiku(anthropicKey, { system, prompt, maxTokens }),
    "Haiku call"
  );
}

async function generateWithGemini(
  apiKey: string,
  { system, prompt, maxTokens }: GenerateArgs
): Promise<GenerateResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: system,
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: maxTokens },
  });

  const text = result.response.text();
  if (!text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const usage = result.response.usageMetadata;
  return {
    text,
    model: GEMINI_MODEL,
    promptTokens: usage?.promptTokenCount,
    completionTokens: usage?.candidatesTokenCount,
  };
}

async function generateWithHaiku(
  apiKey: string,
  { system, prompt, maxTokens }: GenerateArgs
): Promise<GenerateResult> {
  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  return {
    text,
    model: HAIKU_MODEL,
    promptTokens: message.usage.input_tokens,
    completionTokens: message.usage.output_tokens,
  };
}
