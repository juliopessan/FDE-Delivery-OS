import Link from "next/link";
import { StatusStrip } from "@/components/StatusStrip";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/Eyebrow";
import { WordReveal } from "@/components/WordReveal";
import { AGENT_ROSTER } from "@/lib/agents/roster";

/**
 * The nine stages, described by the outcome each one produces rather than by
 * the agent that runs it — the roster in lib/agents/roster.ts stays the source
 * of truth for execution; this is how the same sequence reads to a buyer.
 */
const STAGES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Qualification",
    body: "Determine whether the problem is measurable, sponsored, accessible, mature enough, and safe to pursue.",
  },
  {
    n: "02",
    title: "Capacity Planning",
    body: "Estimate effort, delivery duration, critical path, reinforcement needs, and resourcing risk.",
  },
  {
    n: "03",
    title: "Assessment",
    body: "Translate operational pain into a quantified value hypothesis and technical feasibility view.",
  },
  {
    n: "04",
    title: "Context Engineering",
    body: "Define the data, retrieval, knowledge, and evaluation strategy required for reliable results.",
  },
  {
    n: "05",
    title: "Solution Architecture",
    body: "Select the right pattern: deterministic automation, targeted AI, human-in-the-loop, or a combination.",
  },
  {
    n: "06",
    title: "Security & Guardrails",
    body: "Define identity, data boundaries, action permissions, auditability, residency, and production vetoes.",
  },
  {
    n: "07",
    title: "Quality Assurance",
    body: "Challenge assumptions, inspect cross-artifact consistency, define acceptance criteria, and maintain a delivery punch list.",
  },
  {
    n: "08",
    title: "Scale & Value Operations",
    body: "Connect observability, FinOps, operational metrics, incident response, and value realization.",
  },
  {
    n: "09",
    title: "Compound Intelligence",
    body: "Capture reusable patterns, validated business rules, institutional knowledge, and delivery learning for future engagements.",
  },
];

const TRACEABLE_TO = [
  "source evidence",
  "explicit assumptions",
  "technical decisions",
  "security boundaries",
  "delivery dependencies",
  "measurable business outcomes",
  "the next accountable action",
];

const MODEL_WORK = [
  "unstructured document interpretation",
  "context synthesis",
  "schema normalization",
  "entity disambiguation",
  "exception explanation",
  "architectural reasoning",
];

const DETERMINISTIC_WORK = [
  "calculations",
  "thresholds",
  "matching",
  "duplicate detection",
  "integrations",
  "approvals",
  "state changes",
  "financial transactions",
];

const PACKAGE_CONTENTS = [
  "qualification decision",
  "value hypothesis",
  "technical feasibility assessment",
  "architecture decision records",
  "security and guardrail verdict",
  "quality gate and punch list",
  "delivery capacity model",
  "implementation roadmap",
  "SOW-ready next step",
  "operational and FinOps framework",
  "reusable organizational knowledge",
];

const AP_DECISION = [
  "deterministic workflow orchestration",
  "Azure Document Intelligence for extraction",
  "targeted LLM use for normalization and explanation",
  "mathematical 2-way and 3-way matching in code",
  "human review for exceptions",
  "SAP staging through a restricted parked-document interface",
  "no autonomous payment execution",
  "production deployment blocked until validation gates are passed",
];

const AUDIENCES = [
  "Forward-Deployed Engineers",
  "AI Solutions Architects",
  "enterprise innovation teams",
  "AI platform and architecture leaders",
  "consulting and delivery organizations",
  "product teams turning field learning into reusable capability",
];

const COMPOUNDING = [
  "business rules",
  "exception taxonomies",
  "architecture decisions",
  "reusable delivery patterns",
  "evaluation scenarios",
  "operational signals",
  "lessons learned",
];

const OPERATING_MODEL = [
  { figure: "Minutes", label: "To produce the first delivery hypothesis." },
  { figure: "1–2 days", label: "To create a decision-ready engagement pack." },
  {
    figure: "4–8 hours",
    label: "Of expert review instead of dozens of fragmented analysis hours.",
  },
  {
    figure: "One traceable state",
    label: "From intake to qualification, architecture, governance, and SOW.",
  },
];

function TickList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 items-baseline">
          <span
            className={`mono-face text-[10px] shrink-0 ${dark ? "text-lime" : "text-rust"}`}
            aria-hidden="true"
          >
            —
          </span>
          <span
            className={`text-[15px] leading-relaxed ${dark ? "text-paper2/80" : "text-ink/70"}`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <StatusStrip />
      <SiteHeader />

      <main>
        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className="max-w-[1180px] mx-auto px-6 pt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-16 items-start">
            <div className="rise">
              <Eyebrow>Agentic delivery operating system</Eyebrow>

              <h1 className="display-face mt-7 text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.95] tracking-[-0.03em] font-bold">
                <WordReveal text="One client problem enters." />
                <WordReveal
                  className="serif-face italic font-normal tracking-[-0.01em] block"
                  text="A governed delivery decision leaves."
                  delay={0.34}
                />
              </h1>

              <p className="mt-7 text-[17px] leading-relaxed text-ink/70 max-w-[52ch]">
                FDE OS compresses enterprise AI discovery from weeks into a
                decision-ready delivery path in days. Qualification, assessment,
                architecture, security, value realization, capacity planning, and
                next-step execution — orchestrated through one traceable
                engagement state.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/new"
                  className="mono-face text-[12px] tracking-[0.12em] uppercase bg-ink text-paper px-6 py-4 hover:bg-rust transition-colors"
                >
                  Start an engagement →
                </Link>
                <a
                  href="#delivery-model"
                  className="mono-face text-[12px] tracking-[0.12em] uppercase border border-ink/25 px-6 py-4 hover:border-ink transition-colors"
                >
                  View the delivery model
                </a>
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
                    <div className="mt-1 text-lg font-semibold">FDE OS</div>
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
                          <div className="text-[14px] font-medium truncate">
                            {agent.name}
                          </div>
                          <div className="mono-face text-[10px] tracking-[0.1em] uppercase text-paper2/45 truncate">
                            {agent.phaseLabel}
                          </div>
                        </div>
                      </div>
                      <span
                        className="w-1.5 h-1.5 rounded-full pipeline-dot shrink-0"
                        style={{
                          animationDelay: `${i * (6600 / AGENT_ROSTER.length)}ms`,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The problem ──────────────────────────────────────────────── */}
        <section className="bg-ink text-paper2">
          <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
            <Eyebrow dark>The gap</Eyebrow>
            <h2 className="display-face mt-5 text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.05] max-w-[22ch]">
              The problem is not a lack of AI ideas.
              <span className="serif-face italic font-normal block mt-2 text-paper2/75">
                It is the time between the idea and the first serious decision.
              </span>
            </h2>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-paper2/12">
              {[
                "Discovery lives in one document.",
                "Architecture lives in another.",
                "Security arrives too late.",
                "The business case sits in a spreadsheet.",
                "Delivery estimates are built from memory.",
              ].map((line, i) => (
                <div key={line} className="bg-ink p-6">
                  <div className="mono-face text-[11px] text-rust">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-paper2/80">
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-12 text-[17px] leading-relaxed text-paper2/70 max-w-[62ch]">
              By the time the sponsor sees the full picture, the opportunity has
              already slowed down.
            </p>
            <p className="display-face mt-8 text-[clamp(1.3rem,2.4vw,1.75rem)] font-semibold leading-snug max-w-[30ch]">
              The report was never the product.
              <span className="serif-face italic font-normal block text-lime">
                The product was a governed path forward.
              </span>
            </p>
          </div>
        </section>

        {/* ─── From problem to decision ─────────────────────────────────── */}
        <section id="delivery-model" className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28 scroll-mt-8">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] max-w-[24ch]">
            From client problem to delivery decision
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16">
            <div>
              <p className="text-[17px] leading-relaxed text-ink/70">
                FDE OS turns the messy front end of enterprise AI delivery into a
                structured operating system. It receives an ambiguous client
                problem and coordinates a sequence of specialist stages that
                transform uncertainty into an actionable engagement package.
              </p>
              <div className="mt-10 pt-8 border-t border-ink/12">
                <p className="display-face text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-snug">
                  No disconnected documents.
                  <br />
                  No hidden reasoning.
                  <br />
                  <span className="serif-face italic font-normal">
                    No architecture theater.
                  </span>
                </p>
              </div>
            </div>

            <div>
              <div className="mono-face text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-5">
                Every recommendation is connected to
              </div>
              <TickList items={TRACEABLE_TO} />
            </div>
          </div>
        </section>

        {/* ─── Target operating model ───────────────────────────────────── */}
        <section className="bg-paper2/60 border-y border-ink/10">
          <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
            <Eyebrow>Target operating model</Eyebrow>
            <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] max-w-[22ch]">
              Designed to move in days, not weeks
            </h2>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {OPERATING_MODEL.map((item) => (
                <div key={item.figure}>
                  <div className="display-face text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.02em] leading-tight">
                    {item.figure}
                  </div>
                  <div className="mt-3 h-px w-10 bg-rust" />
                  <p className="mt-4 text-[14px] leading-relaxed text-ink/65">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-14 text-[13px] leading-relaxed text-ink/50 max-w-[70ch]">
              Actual timing depends on data access, client approvals, and
              validation scope. FDE OS accelerates the reasoning and coordination
              layer; it does not bypass the evidence required for production.
            </p>
          </div>
        </section>

        {/* ─── Nine stages ──────────────────────────────────────────────── */}
        <section className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
          <Eyebrow>The sequence</Eyebrow>
          <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em]">
            Nine governed delivery stages
          </h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/12">
            {STAGES.map((stage) => (
              <div key={stage.n} className="bg-paper p-7">
                <div className="mono-face text-[11px] text-rust">{stage.n}</div>
                <h3 className="mt-3 font-semibold text-[16px] tracking-[-0.01em]">
                  {stage.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink/65">
                  {stage.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Agentic, not autonomous ──────────────────────────────────── */}
        <section className="bg-ink text-paper2">
          <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
            <Eyebrow dark>The design principle</Eyebrow>
            <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] leading-[1.1] max-w-[26ch]">
              Intelligence where ambiguity lives.
              <span className="serif-face italic font-normal block text-lime">
                Deterministic control where consequences live.
              </span>
            </h2>
            <p className="mt-7 text-[17px] leading-relaxed text-paper2/70 max-w-[54ch]">
              FDE OS is agentic by design, not autonomous by default.
            </p>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <div className="mono-face text-[10px] tracking-[0.2em] uppercase text-paper2/50 pb-4 mb-6 border-b border-paper2/15">
                  Language models are used for
                </div>
                <TickList items={MODEL_WORK} dark />
              </div>
              <div>
                <div className="mono-face text-[10px] tracking-[0.2em] uppercase text-paper2/50 pb-4 mb-6 border-b border-paper2/15">
                  Deterministic systems remain responsible for
                </div>
                <TickList items={DETERMINISTIC_WORK} dark />
              </div>
            </div>

            <p className="display-face mt-16 text-[clamp(1.2rem,2.2vw,1.6rem)] font-semibold max-w-[30ch]">
              The result is faster delivery without surrendering control.
            </p>
          </div>
        </section>

        {/* ─── What leaves ──────────────────────────────────────────────── */}
        <section className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
            <div>
              <Eyebrow>The output</Eyebrow>
              <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] max-w-[18ch]">
                Every engagement leaves with something that can move
              </h2>
              <p className="mt-7 text-[16px] leading-relaxed text-ink/70 max-w-[46ch]">
                FDE OS produces a consolidated, evidence-linked delivery package.
              </p>
              <p className="display-face mt-10 text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-snug">
                The output is not just a report.
                <span className="serif-face italic font-normal block">
                  It is the next move.
                </span>
              </p>
            </div>
            <div className="lg:pt-14">
              <TickList items={PACKAGE_CONTENTS} />
            </div>
          </div>
        </section>

        {/* ─── Worked example ───────────────────────────────────────────── */}
        <section className="bg-paper2/60 border-y border-ink/10">
          <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
            <Eyebrow>Worked example</Eyebrow>
            <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.4rem)] font-bold tracking-[-0.02em]">
              Accounts Payable automation
            </h2>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
              <div>
                <p className="text-[16px] leading-relaxed text-ink/70">
                  A finance organization processes approximately 12,000 supplier
                  invoices every month through fragmented mailboxes, SharePoint
                  folders, manual verification, and SAP. The business wants to
                  reduce manual effort without increasing financial, operational,
                  or security risk.
                </p>
                <p className="mt-6 text-[16px] leading-relaxed text-ink/70">
                  FDE OS does not immediately recommend an autonomous agent. It
                  produces a governed delivery decision.
                </p>
                <p className="display-face mt-10 text-[clamp(1.1rem,1.9vw,1.4rem)] font-semibold leading-snug max-w-[32ch]">
                  A credible Phase 1 path
                  <span className="serif-face italic font-normal block">
                    instead of an attractive but unsafe AI experiment.
                  </span>
                </p>
              </div>
              <div>
                <div className="mono-face text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-5">
                  The decision it produces
                </div>
                <TickList items={AP_DECISION} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Who it is for ────────────────────────────────────────────── */}
        <section className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
            <div>
              <Eyebrow>Who it is for</Eyebrow>
              <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.4rem)] font-bold tracking-[-0.02em] max-w-[20ch]">
                Built for teams that deliver AI in the real world
              </h2>
              <p className="mt-8 text-[16px] leading-relaxed text-ink/70 max-w-[44ch]">
                Because the hard part of enterprise AI is rarely the model. It is
                aligning the problem, the people, the systems, the controls, and
                the economics.
              </p>
            </div>
            <div className="lg:pt-14">
              <TickList items={AUDIENCES} />
            </div>
          </div>
        </section>

        {/* ─── Compounding ──────────────────────────────────────────────── */}
        <section className="bg-ink text-paper2">
          <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
              <div>
                <Eyebrow dark>Compound intelligence</Eyebrow>
                <h2 className="display-face mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold tracking-[-0.02em] max-w-[16ch]">
                  Make every engagement compound
                </h2>
                <p className="mt-7 text-[16px] leading-relaxed text-paper2/70 max-w-[44ch]">
                  One engagement should not disappear when the project ends. FDE
                  OS captures the validated patterns behind the work.
                </p>
                <p className="display-face mt-10 text-[clamp(1.2rem,2vw,1.5rem)] font-semibold leading-snug max-w-[26ch]">
                  The organization becomes more capable with every engagement.
                  <span className="serif-face italic font-normal block text-lime">
                    Not just more automated.
                  </span>
                </p>
              </div>
              <div className="lg:pt-14">
                <TickList items={COMPOUNDING} dark />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Closing CTA ──────────────────────────────────────────────── */}
        <section className="max-w-[1180px] mx-auto px-6 py-24 sm:py-32">
          <h2 className="display-face text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.05] max-w-[24ch]">
            Stop producing disconnected assessments.
            <span className="serif-face italic font-normal block">
              Start producing governed delivery paths.
            </span>
          </h2>
          <p className="mt-7 text-[17px] leading-relaxed text-ink/70 max-w-[58ch]">
            Turn the next ambiguous client problem into a clear technical
            decision, a defensible business case, and an executable next step.
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
              Request a walkthrough →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/12 px-6 py-12">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mono-face text-[12px] tracking-[0.24em] font-medium">
              FDE OS
            </div>
            <div className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/40 mt-1.5">
              Agentic Delivery Operating System
            </div>
          </div>
          <div className="mono-face text-[10px] tracking-[0.14em] uppercase text-ink/40 flex flex-wrap gap-x-3 gap-y-1">
            <span>Model-agnostic.</span>
            <span>Evidence-led.</span>
            <span>Production-gated.</span>
            <span>Built for delivery.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
