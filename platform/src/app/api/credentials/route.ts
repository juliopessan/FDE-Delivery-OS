import { NextResponse } from "next/server";
import {
  configuredProviders,
  saveKey,
  verifyKey,
  type Provider,
} from "@/lib/credentials";

/**
 * Writing a credential is the one thing in this app worth guarding at the
 * request level. FDE OS is meant to run on the operator's own machine, but
 * `next dev -H 0.0.0.0` puts it on the local network — and this route would
 * then let anyone on that network write an API key into the operator's
 * .env.local. Loopback only.
 */
function isLoopback(req: Request): boolean {
  const host = new URL(req.url).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

export async function GET() {
  // Status only. The key values never leave the server.
  return NextResponse.json(configuredProviders());
}

export async function POST(req: Request) {
  if (!isLoopback(req)) {
    return NextResponse.json(
      { error: "API keys can only be set from the machine running FDE OS." },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    provider?: string;
    key?: string;
  };

  const provider = body.provider as Provider;
  const key = body.key?.trim();

  if (provider !== "gemini" && provider !== "anthropic") {
    return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
  }
  if (!key) {
    return NextResponse.json({ error: "Paste a key first." }, { status: 400 });
  }

  const check = await verifyKey(provider, key);
  if (!check.ok) {
    return NextResponse.json({ error: check.reason }, { status: 400 });
  }

  await saveKey(provider, key);

  return NextResponse.json({ saved: true, ...configuredProviders() });
}
