import { QUALIFIER_PROMPT } from "./prompts/qualifier";
import { CAPACITY_PLANNER_PROMPT } from "./prompts/capacity-planner";
import { ASSESSOR_PROMPT } from "./prompts/assessor";
import { CONTEXT_ENGINEER_PROMPT } from "./prompts/context-engineer";
import { ARCHITECT_PROMPT } from "./prompts/architect";
import { GUARDRAILS_PROMPT } from "./prompts/guardrails";
import { QA_PROMPT } from "./prompts/qa";
import { SCALE_OPS_PROMPT } from "./prompts/scale-ops";
import { COMPOUND_INTELLIGENCE_PROMPT } from "./prompts/compound-intelligence";

export type AgentKey =
  | "qualifier"
  | "capacity-planner"
  | "assessor"
  | "context-engineer"
  | "architect"
  | "guardrails"
  | "qa"
  | "scale-ops"
  | "compound-intelligence";

export interface AgentDefinition {
  key: AgentKey;
  name: string;
  phaseKey: string;
  phaseLabel: string;
  mission: string;
  systemPrompt: string;
  /** Informational only — actual routing/fallback lives in lib/agents/llm-client.ts */
  model: string;
  /**
   * Present-continuous verbs shown while this agent's phase run is active.
   * Several per agent, cycled in the UI, so a long-running phase reads as
   * work in progress rather than a stuck label. Drawn from the vocabulary of
   * the discipline the agent actually practises.
   */
  activeVerbs: string[];
}

/**
 * The execution roster of FDE OS. Each agent owns one phase (or a
 * cross-cutting concern) of the delivery pipeline. Phases carry plain,
 * functional English names rather than an acronym.
 */
export const AGENT_ROSTER: AgentDefinition[] = [
  {
    key: "qualifier",
    name: "Qualification Agent",
    phaseKey: "qualification",
    phaseLabel: "Qualification",
    mission: "Fit score, prospect research, GO/NO-GO recommendation",
    activeVerbs: ["Qualifying", "Scoring fit", "Probing sponsorship", "Sizing the pain", "Testing access", "Weighing risk"],
    systemPrompt: QUALIFIER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "capacity-planner",
    name: "Capacity Planning Agent",
    phaseKey: "qualification",
    phaseLabel: "Qualification",
    mission: "WBS + PERT effort estimate, solo-vs-reinforcement call",
    activeVerbs: ["Estimating", "Breaking down work", "Running PERT", "Tracing critical path", "Sizing the crew", "Costing the weeks"],
    systemPrompt: CAPACITY_PLANNER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "assessor",
    name: "Assessment Agent",
    phaseKey: "assessment",
    phaseLabel: "Assessment",
    mission: "Process classification, AI architecture blueprint, estimated ROI",
    activeVerbs: ["Assessing", "Shadowing the process", "Quantifying effort", "Modelling value", "Testing feasibility", "Baselining volumes"],
    systemPrompt: ASSESSOR_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "context-engineer",
    name: "Context Engineering Agent",
    phaseKey: "context",
    phaseLabel: "Context Engineering",
    mission: "Ingestion, RAG/vector design, connector map, golden set",
    activeVerbs: ["Ingesting", "Mapping sources", "Designing retrieval", "Chunking context", "Curating the golden set", "Wiring connectors"],
    systemPrompt: CONTEXT_ENGINEER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "architect",
    name: "Solution Architecture Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Orchestration pattern, model routing, system architecture, ADR",
    activeVerbs: ["Architecting", "Choosing the pattern", "Placing the seams", "Weighing determinism", "Drafting the ADR", "Rejecting swarms"],
    systemPrompt: ARCHITECT_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "guardrails",
    name: "Security & Guardrails Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Autonomy matrix, guardrails, audit trail, go-live veto",
    activeVerbs: ["Hardening", "Drawing boundaries", "Scoping permissions", "Auditing residency", "Blocking autonomy", "Writing the veto"],
    systemPrompt: GUARDRAILS_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "qa",
    name: "Quality Assurance Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Independent Go/No-Go quality gate",
    activeVerbs: ["Validating", "Challenging assumptions", "Cross-checking artifacts", "Setting acceptance", "Building the punch list", "Hunting contradictions"],
    systemPrompt: QA_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "scale-ops",
    name: "Scale & Value Operations Agent",
    phaseKey: "scale",
    phaseLabel: "Scale",
    mission: "Observability plan, realized ROI, runbook, retainer case",
    activeVerbs: ["Operating", "Wiring observability", "Realising value", "Costing the run", "Drafting the runbook", "Structuring the retainer"],
    systemPrompt: SCALE_OPS_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "compound-intelligence",
    name: "Compound Intelligence Agent",
    phaseKey: "scale",
    phaseLabel: "Scale",
    mission: "Company IQ extraction, cross-stack governance, pattern reuse, continuous improvement loop",
    activeVerbs: ["Compounding", "Extracting patterns", "Naming the rules", "Partitioning IP", "Banking the learning", "Building Company IQ"],
    systemPrompt: COMPOUND_INTELLIGENCE_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
];

export function getAgent(key: AgentKey): AgentDefinition {
  const agent = AGENT_ROSTER.find((a) => a.key === key);
  if (!agent) throw new Error(`Unknown agent: ${key}`);
  return agent;
}

export const PHASES = [
  { key: "qualification", label: "Qualification" },
  { key: "assessment", label: "Assessment" },
  { key: "context", label: "Context Engineering" },
  { key: "engineering", label: "Engineering" },
  { key: "scale", label: "Scale" },
] as const;
