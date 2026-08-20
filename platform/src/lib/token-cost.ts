/**
 * What a pipeline run actually consumed, and what it cost.
 *
 * The token counts are facts: every phase_run row stores the counts the
 * provider reported for that call. The money is an estimate, and the reason
 * it is only an estimate is worth stating plainly — published list rates
 * change, and one of the two models here is on a promotional rate with a
 * known expiry. So each rate carries the date it was verified and, where the
 * provider has already announced the next price, the date it changes and what
 * it changes to. A run is priced with the rate that was in effect the day it
 * ran, which keeps an engagement from silently re-pricing itself in January.
 */

export interface Rate {
  inputPerMTok: number;
  outputPerMTok: number;
}

interface ModelPricing extends Rate {
  /** Model id prefix — stored ids carry date suffixes ("-20251001"). */
  prefix: string;
  label: string;
  /** Last day this rate applies, when the provider has announced a change. */
  until?: string;
  /** What the rate becomes the day after `until`. */
  then?: Rate;
}

/**
 * Verified 2026-08-20 against the providers' published list prices.
 *
 * Gemini 3.7 Flash launched on a promotional rate that doubles on 2027-01-01
 * ($1.50/$7.50). That is not a detail to leave implicit: the pipeline serves
 * every phase on it today, so the cost line below is the one number here with
 * a scheduled step change.
 */
export const MODEL_PRICING: ModelPricing[] = [
  {
    prefix: "gemini-3.7-flash",
    label: "Gemini 3.7 Flash",
    inputPerMTok: 0.75,
    outputPerMTok: 3.75,
    until: "2026-12-31",
    then: { inputPerMTok: 1.5, outputPerMTok: 7.5 },
  },
  {
    prefix: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    inputPerMTok: 1.0,
    outputPerMTok: 5.0,
  },
];

export const RATES_VERIFIED_ON = "2026-08-20";

/** The rate for `model` on the day `isoDate` — falls back to today's rate. */
function rateFor(model: string | null | undefined, isoDate?: string | null): Rate | null {
  if (!model) return null;
  const pricing = MODEL_PRICING.find((p) => model.startsWith(p.prefix));
  if (!pricing) return null;

  if (pricing.until && pricing.then) {
    // Compare on the date alone: stored stamps are "2026-08-19 21:04:11",
    // which sorts correctly against a bare date once truncated.
    const day = (isoDate ?? new Date().toISOString()).slice(0, 10);
    if (day > pricing.until) return pricing.then;
  }
  return { inputPerMTok: pricing.inputPerMTok, outputPerMTok: pricing.outputPerMTok };
}

export interface Consumption {
  promptTokens: number;
  completionTokens: number;
  /** Null when no run carried a model we have a rate for. */
  costUsd: number | null;
  /** Models seen in the runs that we could not price. */
  unpriced: string[];
}

type PricedRun = {
  model?: string | null;
  promptTokens?: number | null;
  completionTokens?: number | null;
  completedAt?: string | null;
};

/**
 * Totals across every run, including re-runs and repairs of truncated phases.
 * Those attempts were billed too, so leaving them out would report a cost the
 * engagement did not actually incur.
 */
export function summarizeConsumption(runs: PricedRun[]): Consumption {
  let promptTokens = 0;
  let completionTokens = 0;
  let costUsd = 0;
  let priced = false;
  const unpriced = new Set<string>();

  for (const run of runs) {
    const input = run.promptTokens ?? 0;
    const output = run.completionTokens ?? 0;
    if (!input && !output) continue;

    promptTokens += input;
    completionTokens += output;

    const rate = rateFor(run.model, run.completedAt);
    if (!rate) {
      if (run.model) unpriced.add(run.model);
      continue;
    }
    priced = true;
    costUsd += (input / 1_000_000) * rate.inputPerMTok;
    costUsd += (output / 1_000_000) * rate.outputPerMTok;
  }

  return {
    promptTokens,
    completionTokens,
    costUsd: priced ? costUsd : null,
    unpriced: [...unpriced],
  };
}

/** "881.8K" — the exact figure goes in a title attribute, not the strip. */
export function formatTokens(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${(n / 1_000_000).toFixed(2)}M`;
}

/**
 * Cents matter at this scale — a whole pipeline lands under a dollar — so the
 * figure keeps two decimals and never rounds a real cost down to "$0.00".
 */
export function formatUsd(amount: number): string {
  if (amount > 0 && amount < 0.01) return "<$0.01";
  return `$${amount.toFixed(2)}`;
}
