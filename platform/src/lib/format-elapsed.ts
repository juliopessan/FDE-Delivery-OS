/**
 * Phase timing, formatted for a delivery report rather than for a log.
 *
 * Runs are stored as ISO strings in SQLite (`started_at`, `completed_at`).
 * A phase that has started but not finished has no end, and the caller may
 * hold nothing at all for a phase that never ran, so every input here is
 * optional and an unanswerable question returns null instead of "0s".
 */

function toMs(value: string | null | undefined): number | null {
  if (!value) return null;
  // SQLite's CURRENT_TIMESTAMP has no zone marker; without one, Date treats
  // "2026-08-17 09:14:22" as local time while the value is UTC, which shows
  // up as a multi-hour phase.
  const normalized = /Z|[+-]\d{2}:?\d{2}$/.test(value)
    ? value
    : `${value.replace(" ", "T")}Z`;
  const ms = Date.parse(normalized);
  return Number.isNaN(ms) ? null : ms;
}

/** "48s", "3m 12s", "1h 04m". Null when the span cannot be determined. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${String(seconds).padStart(2, "0")}s`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`;
}

/** How long a single phase took. Null while it is still running or never ran. */
export function formatElapsed(
  startedAt: string | null | undefined,
  completedAt: string | null | undefined
): string | null {
  const start = toMs(startedAt);
  const end = toMs(completedAt);
  if (start === null || end === null) return null;
  return formatDuration(end - start);
}

/**
 * Total time the agents spent working: the sum of the phase durations.
 *
 * Deliberately not wall-clock (last finish minus first start). A phase can be
 * re-run later to repair a bad artifact, and wall-clock then reports the gap
 * between the two sessions — a real engagement showed "18h 31m" for a pipeline
 * that took about three minutes of actual work. Summing the phases answers the
 * question a reader is really asking.
 */
export function formatTotalElapsed(
  runs: { startedAt?: string | null; completedAt?: string | null }[]
): string | null {
  const durations = runs
    .map((r) => {
      const start = toMs(r.startedAt);
      const end = toMs(r.completedAt);
      return start !== null && end !== null ? end - start : null;
    })
    .filter((n): n is number => n !== null);

  if (!durations.length) return null;
  return formatDuration(durations.reduce((a, b) => a + b, 0));
}

/** "17 Aug 2026, 09:14" — for stamping when a phase ran. */
export function formatTimestamp(value: string | null | undefined): string | null {
  const ms = toMs(value);
  if (ms === null) return null;
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
