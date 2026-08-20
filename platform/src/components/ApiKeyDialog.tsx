"use client";

import { useEffect, useState } from "react";
import { AlertIcon, CheckIcon, SpinnerIcon } from "@/components/Icon";

type Provider = "gemini" | "anthropic";
type Status = Record<Provider, boolean>;

const PROVIDERS: {
  id: Provider;
  label: string;
  role: string;
  where: string;
  href: string;
}[] = [
  {
    id: "gemini",
    label: "Gemini",
    role: "Primary — every agent call goes here first",
    where: "aistudio.google.com/apikey",
    href: "https://aistudio.google.com/apikey",
  },
  {
    id: "anthropic",
    label: "Claude",
    role: "Fallback — used when Gemini errors or is rate-limited",
    where: "console.anthropic.com",
    href: "https://console.anthropic.com/settings/keys",
  },
];

/**
 * Shown when neither provider is configured, which is the state every fresh
 * clone starts in. The pipeline cannot run without a key, so this is the
 * first thing worth doing rather than an error to hit three screens later.
 *
 * It mounts on the landing page too. That looked wrong at first — asking a
 * reader for a credential before they have read the pitch — but FDE OS only
 * runs on localhost, so there is no such reader: whoever loads `/` is the
 * operator who just started the server, and `/` is the first screen they see.
 * "Later" dismisses it for anyone who only wants to look around.
 *
 * The key is posted once and never comes back: the server answers with
 * whether each provider is configured, not with what was stored. Nothing is
 * kept in localStorage — a credential in browser storage outlives the tab
 * and travels with a profile sync.
 */
export function ApiKeyDialog() {
  const [status, setStatus] = useState<Status | null>(null);
  const [provider, setProvider] = useState<Provider>("gemini");
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ gemini: false, anthropic: false }));
  }, []);

  const configured = status ? status.gemini || status.anthropic : true;
  if (configured || dismissed || !status) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, key }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not save the key.");
        return;
      }

      setKey("");
      setStatus({ gemini: data.gemini, anthropic: data.anthropic });
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-title"
    >
      <div className="bg-paper text-ink w-full max-w-[560px] p-8 sm:p-10 border border-ink/15 dark:border-paper2/15 shadow-2xl max-h-full overflow-y-auto">
        <div className="mono-face text-label tracking-[0.2em] uppercase text-ink/60">
          Setup — one step
        </div>
        <h2
          id="api-key-title"
          className="display-face mt-3 text-[clamp(1.2rem,2.2vw,1.6rem)] font-bold tracking-[-0.02em]"
        >
          Add a model API key
        </h2>
        <p className="mt-3 text-ink/70 text-small max-w-[52ch]">
          The nine agents run on a language model, so FDE OS needs a key for at
          least one provider. Either one alone is a working setup.
        </p>

        <form onSubmit={save} className="mt-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/12 border border-ink/12">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                className={`text-left p-4 transition-colors ${
                  provider === p.id
                    ? "bg-ink dark:bg-inksoft dark:ring-1 dark:ring-paper2/20 text-paper2"
                    : "bg-paper hover:bg-paper2 dark:hover:bg-ink/10"
                }`}
              >
                <div className="mono-face text-label tracking-[0.14em] uppercase flex items-center gap-2">
                  {/* In the light theme the selected card is a near-black slab
                      against cream and needs no marker. In dark both cards are
                      dark, so selection leans on the lime dot the roster
                      already uses for "this one is live" — and lime only has
                      the contrast for that job on a dark slab, which is
                      exactly where the selected card sits in both themes. */}
                  {provider === p.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                  )}
                  {p.label}
                  {status[p.id] && <CheckIcon />}
                </div>
                <div
                  className={`text-small mt-1.5 ${
                    provider === p.id ? "text-paper2/80" : "text-ink/60"
                  }`}
                >
                  {p.role}
                </div>
              </button>
            ))}
          </div>

          <label
            htmlFor="api-key"
            className="mono-face block text-label tracking-[0.2em] uppercase text-ink/60 mt-7 mb-3"
          >
            {PROVIDERS.find((p) => p.id === provider)!.label} API key
          </label>
          <input
            id="api-key"
            // A password field so the key is not left readable on a screen
            // that may well be shared while someone is demoing this.
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste the key here"
            className="w-full bg-transparent border-b border-ink/50 pb-3 text-body placeholder-ink/60 focus:outline-none focus:border-ink transition-colors font-mono"
          />

          <p className="text-ink/60 text-small mt-3">
            Get one at{" "}
            <a
              href={PROVIDERS.find((p) => p.id === provider)!.href}
              target="_blank"
              rel="noreferrer"
              className="text-rustink hover:text-peach transition-colors"
            >
              {PROVIDERS.find((p) => p.id === provider)!.where}
            </a>
            . It is written to <code className="font-mono">.env.local</code> on
            this machine, which is gitignored, and never sent anywhere but the
            provider you chose.
          </p>

          {error && (
            <p className="text-rustink text-small mt-4 flex items-start gap-2">
              <AlertIcon className="mt-[3px] shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving || !key.trim()}
              className="mono-face text-label tracking-[0.12em] uppercase bg-ink dark:bg-inksoft text-paper2 px-6 py-4 hover:bg-rust dark:hover:bg-rust transition-colors disabled:text-paper2/60 disabled:hover:bg-ink dark:disabled:hover:bg-inksoft"
            >
              <span className="inline-flex items-center gap-2">
                {saving && <SpinnerIcon />}
                {saving ? "Checking the key…" : "Save and continue →"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="mono-face text-label tracking-[0.14em] uppercase text-ink/60 hover:text-ink transition-colors"
            >
              Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
