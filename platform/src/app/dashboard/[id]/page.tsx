"use client";

import { useEffect, useCallback, useState, use } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/Eyebrow";
import { AGENT_ROSTER } from "@/lib/agents/roster";
import { ActiveVerb } from "@/components/ActiveVerb";
import { formatElapsed, formatTotalElapsed } from "@/lib/format-elapsed";
import type { Engagement, PhaseRun, Report } from "@/lib/db/schema";

interface EngagementData {
  engagement: Engagement;
  runs: PhaseRun[];
  report: Report | null;
}

const statusDot: Record<string, string> = {
  pending: "bg-ink/15",
  running: "bg-amber node-active",
  completed: "bg-lime",
  failed: "bg-rust",
};

export default function EngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<EngagementData | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/engagements/${id}`, { cache: "no-store" });
    if (res.ok) setData(await res.json());
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [running, load]);

  async function handleRun() {
    setRunning(true);
    setError(null);
    const res = await fetch(`/api/engagements/${id}/run`, { method: "POST" });
    const body = await res.json();
    setRunning(false);
    if (!res.ok || !body.ok) {
      setError(body.error ?? "Pipeline run failed.");
    }
    load();
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <SiteHeader meta="Engagement" />
        <main className="max-w-[900px] mx-auto px-6 py-24 text-ink/50 mono-face text-sm">Loading…</main>
      </div>
    );
  }

  const { engagement, runs, report } = data;
  const runByAgent = new Map(runs.map((r) => [r.agentKey, r]));
  const pipelineDone = engagement.status === "completed" && report;
  const totalElapsed = formatTotalElapsed(runs);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader meta="Engagement" />

      <main className="max-w-[900px] mx-auto px-6 py-14">
        <Eyebrow>{engagement.phase}</Eyebrow>
        <h1 className="display-face mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em]">
          {engagement.customerName}
        </h1>
        <p className="mt-3 text-ink/65 text-[15px] max-w-[60ch]">{engagement.objective}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          {!pipelineDone && (
            <button
              onClick={handleRun}
              disabled={running || engagement.status === "completed"}
              className="mono-face text-[12px] tracking-[0.12em] uppercase bg-ink text-paper px-6 py-4 hover:bg-rust transition-colors disabled:opacity-50"
            >
              {running ? "Running pipeline…" : "Run agent pipeline →"}
            </button>
          )}
          {pipelineDone && (
            <a
              href={`/api/engagements/${id}/report`}
              target="_blank"
              rel="noreferrer"
              className="mono-face text-[12px] tracking-[0.12em] uppercase bg-lime text-ink dark:text-paper px-6 py-4 hover:opacity-80 transition-opacity"
            >
              View enterprise report →
            </a>
          )}
        </div>

        {error && <p className="mt-4 text-rust text-sm">{error}</p>}

        <div className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <Eyebrow>Pipeline status</Eyebrow>
            {totalElapsed ? (
              <span className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/40 tabular-nums">
                {totalElapsed} agent runtime
              </span>
            ) : null}
          </div>
          <div className="mt-6 divide-y divide-ink/12 border-t border-b border-ink/12">
            {AGENT_ROSTER.map((agent, i) => {
              const run = runByAgent.get(agent.key);
              const status = run?.status ?? "pending";
              const elapsed = formatElapsed(run?.startedAt, run?.completedAt);
              return (
                <div key={agent.key} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="mono-face text-[11px] text-rust shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium truncate">{agent.name}</div>
                      <div className="mono-face text-[10px] tracking-[0.1em] uppercase text-ink/45 truncate">
                        {agent.phaseLabel}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {elapsed ? (
                      <span className="mono-face text-[10px] tracking-[0.1em] text-ink/35 tabular-nums">
                        {elapsed}
                      </span>
                    ) : null}
                    <span className="mono-face text-[10px] tracking-[0.1em] uppercase text-ink/50">
                      {status === "running" ? (
                        <ActiveVerb verbs={agent.activeVerbs} seed={i} />
                      ) : (
                        status
                      )}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${statusDot[status] ?? "bg-ink/15"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
