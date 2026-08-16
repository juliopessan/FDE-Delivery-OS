import Link from "next/link";
import { StatusStrip } from "@/components/StatusStrip";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/Eyebrow";
import { AGENT_ROSTER, PHASES } from "@/lib/agents/roster";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <StatusStrip />
      <SiteHeader />

      <main className="max-w-[1180px] mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-16 items-start">
          <div className="rise">
            <Eyebrow>Agentic delivery operating system</Eyebrow>

            <h1 className="display-face mt-7 text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.95] tracking-[-0.03em] font-bold">
              One engagement enters.
              <br />
              <span className="serif-face italic font-normal tracking-[-0.01em]">
                an enterprise report leaves.
              </span>
            </h1>

            <p className="mt-7 text-[17px] leading-relaxed text-ink/70 max-w-[50ch]">
              FDE OS runs a governed pipeline of nine specialist agents —
              qualification, capacity planning, assessment, context engineering,
              architecture, guardrails, QA, value realisation and compound
              intelligence — over a single engagement brief, and hands back one
              consolidated, citable, enterprise-grade delivery report designed to
              make the client's own organization smarter, not just automated.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/dashboard/new"
                className="mono-face text-[12px] tracking-[0.12em] uppercase bg-ink text-paper px-6 py-4 hover:bg-rust transition-colors"
              >
                Start an engagement →
              </Link>
              <Link
                href="/dashboard"
                className="mono-face text-[12px] tracking-[0.12em] uppercase border border-ink/25 px-6 py-4 hover:border-ink transition-colors"
              >
                View dashboard
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
              {[
                ["9", "specialist agents"],
                ["5", "delivery phases"],
                ["1", "consolidated report"],
              ].map(([n, label]) => (
                <div key={label}>
                  <div className="display-face text-3xl font-bold">{n}</div>
                  <div className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/45 mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rise" style={{ animationDelay: "120ms" }}>
            <Eyebrow>Agent pipeline</Eyebrow>
            <div className="mt-4 bg-ink text-paper2">
              <div className="px-6 sm:px-8 py-6 border-b border-paper2/12 flex items-center justify-between">
                <div>
                  <div className="mono-face text-[10px] tracking-[0.2em] uppercase text-paper2/50">
                    Execution roster
                  </div>
                  <div className="mt-1 text-lg font-semibold">FDE-01 / v1</div>
                </div>
                <span className="mono-face text-[10px] tracking-[0.14em] uppercase bg-paper2/10 text-paper2/70 px-3 py-1.5">
                  Idle
                </span>
              </div>
              <ul className="px-6 sm:px-8 py-2">
                {AGENT_ROSTER.map((agent, i) => (
                  <li
                    key={agent.key}
                    className="flex items-center justify-between gap-4 py-4 border-b border-paper2/10 last:border-b-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="mono-face text-[11px] text-rust shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate">{agent.name}</div>
                        <div className="mono-face text-[10px] tracking-[0.1em] uppercase text-paper2/45 truncate">
                          {agent.phaseLabel}
                        </div>
                      </div>
                    </div>
                    <span
                      className="w-1.5 h-1.5 rounded-full pipeline-dot shrink-0"
                      style={{ animationDelay: `${i * (6600 / AGENT_ROSTER.length)}ms` }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-28">
          <Eyebrow>The five phases</Eyebrow>
          <h2 className="display-face mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] max-w-[26ch]">
            Every phase produces evidence, not a chat transcript.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/12">
            {PHASES.map((phase, i) => (
              <div key={phase.key} className="bg-paper p-6">
                <div className="mono-face text-[11px] text-rust">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-3 font-semibold text-[15px]">{phase.label}</div>
                <div className="mt-2 text-[13px] text-ink/60 leading-relaxed">
                  {phaseCopy[phase.key]}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-28 bg-ink text-paper2 p-10 sm:p-14">
          <Eyebrow dark>Why a pipeline, not a chatbot</Eyebrow>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <div className="display-face text-xl font-semibold">State outside chat</div>
              <p className="mt-2 text-[14px] text-paper2/70 leading-relaxed">
                Every engagement, phase run and report is persisted in SQLite — nothing
                lives only inside a conversation.
              </p>
            </div>
            <div>
              <div className="display-face text-xl font-semibold">Traceable by design</div>
              <p className="mt-2 text-[14px] text-paper2/70 leading-relaxed">
                Every agent cites the upstream fact or artifact its recommendation is
                built on, or flags it as an assumption.
              </p>
            </div>
            <div>
              <div className="display-face text-xl font-semibold">Human accountable</div>
              <p className="mt-2 text-[14px] text-paper2/70 leading-relaxed">
                The Guardrails agent holds an explicit go-live veto no other agent in the
                pipeline can override.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/12 px-6 py-10">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/40">
            FDE OS — Agentic Delivery Operating System
          </span>
          <span className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/40">
            MIT Licensed
          </span>
        </div>
      </footer>
    </div>
  );
}

const phaseCopy: Record<string, string> = {
  qualification: "Fit score, prospect research, effort estimate — before a single billable hour.",
  assessment: "Process classification, AI architecture blueprint, estimated ROI.",
  context: "Ingestion, retrieval design, connector map, golden-set specification.",
  engineering: "Orchestration pattern, architecture, guardrails, independent QA gate.",
  scale: "Observability, realized ROI, incident runbook, retainer case, Company IQ compounding.",
};
