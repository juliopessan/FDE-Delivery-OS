import { promises as fs } from "fs";
import path from "path";

/**
 * Reading and writing the model API keys from the running app.
 *
 * The keys live in `platform/.env.local` — the same file the README tells you
 * to edit by hand. Writing there rather than into the database keeps one
 * credential store instead of two: it is already gitignored, already the
 * documented location, and a `local.db` that gets copied or backed up does not
 * quietly carry an API key with it.
 *
 * Nothing here ever returns a key value to a caller. The UI only ever learns
 * whether a provider is configured.
 */

export type Provider = "gemini" | "anthropic";

const ENV_VAR: Record<Provider, string> = {
  gemini: "GEMINI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
};

export const PROVIDER_LABEL: Record<Provider, string> = {
  gemini: "Gemini",
  anthropic: "Claude",
};

const ENV_PATH = path.join(process.cwd(), ".env.local");

export function configuredProviders(): Record<Provider, boolean> {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY?.trim()),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
  };
}

/**
 * Ask the provider whether the key is real, before it is written anywhere.
 *
 * Both calls list models rather than generating text: they cost no tokens and
 * still fail on an invalid key. Without this, a typo is saved as success and
 * surfaces three minutes into a pipeline run, after the first agent has
 * already been paid for.
 */
export async function verifyKey(
  provider: Provider,
  key: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    if (provider === "gemini") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
        { signal: AbortSignal.timeout(15_000) }
      );
      if (res.ok) return { ok: true };
      if (res.status === 400 || res.status === 403) {
        return { ok: false, reason: "Google rejected this key." };
      }
      return { ok: false, reason: `Google answered ${res.status}.` };
    }

    const res = await fetch("https://api.anthropic.com/v1/models", {
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) return { ok: true };
    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "Anthropic rejected this key." };
    }
    return { ok: false, reason: `Anthropic answered ${res.status}.` };
  } catch (err) {
    // A network failure is not a bad key — say so, rather than telling
    // someone to go regenerate a key that was fine.
    return {
      ok: false,
      reason: `Could not reach ${PROVIDER_LABEL[provider]} to check the key: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
}

/**
 * Write the key into .env.local, replacing any existing line for that
 * variable, and apply it to the running process so the next request works
 * without a restart. Next's dev server also reloads on .env changes; setting
 * process.env means a production build behaves the same way.
 */
export async function saveKey(provider: Provider, key: string): Promise<void> {
  const name = ENV_VAR[provider];

  let contents = "";
  try {
    contents = await fs.readFile(ENV_PATH, "utf8");
  } catch {
    // No .env.local yet — the file is created below.
  }

  const line = `${name}=${key}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  contents = pattern.test(contents)
    ? contents.replace(pattern, line)
    : `${contents.replace(/\s*$/, "")}\n${line}\n`;

  await fs.writeFile(ENV_PATH, contents.replace(/^\n/, ""), "utf8");
  // Owner-only. The file now holds a live credential, and the default umask
  // on a shared machine would leave it world-readable.
  await fs.chmod(ENV_PATH, 0o600);

  process.env[name] = key;
}
