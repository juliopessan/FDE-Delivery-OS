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
  /** Present-continuous verb shown in the UI while this agent's phase run is active. */
  activeVerb: string;
}

/**
 * The execution roster of FDE OS. Each agent owns one phase (or a
 * cross-cutting concern) of the delivery pipeline. No agent here is branded
 * against the retired "A.C.E.S." acronym — phases are plain, functional
 * English names.
 */
export const AGENT_ROSTER: AgentDefinition[] = [
  {
    key: "qualifier",
    name: "Qualification Agent",
    phaseKey: "qualification",
    phaseLabel: "Qualification",
    mission: "Fit score, prospect research, GO/NO-GO recommendation",
    activeVerb: "Qualifying",
    systemPrompt: QUALIFIER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "capacity-planner",
    name: "Capacity Planning Agent",
    phaseKey: "qualification",
    phaseLabel: "Qualification",
    mission: "WBS + PERT effort estimate, solo-vs-reinforcement call",
    activeVerb: "Estimating",
    systemPrompt: CAPACITY_PLANNER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "assessor",
    name: "Assessment Agent",
    phaseKey: "assessment",
    phaseLabel: "Assessment",
    mission: "Process classification, AI architecture blueprint, estimated ROI",
    activeVerb: "Assessing",
    systemPrompt: ASSESSOR_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "context-engineer",
    name: "Context Engineering Agent",
    phaseKey: "context",
    phaseLabel: "Context Engineering",
    mission: "Ingestion, RAG/vector design, connector map, golden set",
    activeVerb: "Ingesting",
    systemPrompt: CONTEXT_ENGINEER_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "architect",
    name: "Solution Architecture Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Orchestration pattern, model routing, system architecture, ADR",
    activeVerb: "Architecting",
    systemPrompt: ARCHITECT_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "guardrails",
    name: "Security & Guardrails Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Autonomy matrix, guardrails, audit trail, go-live veto",
    activeVerb: "Hardening",
    systemPrompt: GUARDRAILS_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "qa",
    name: "Quality Assurance Agent",
    phaseKey: "engineering",
    phaseLabel: "Engineering",
    mission: "Independent Go/No-Go quality gate",
    activeVerb: "Validating",
    systemPrompt: QA_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "scale-ops",
    name: "Scale & Value Operations Agent",
    phaseKey: "scale",
    phaseLabel: "Scale",
    mission: "Observability plan, realized ROI, runbook, retainer case",
    activeVerb: "Operating",
    systemPrompt: SCALE_OPS_PROMPT,
    model: "gemini-3.7-flash (fallback: claude-haiku-4-5)",
  },
  {
    key: "compound-intelligence",
    name: "Compound Intelligence Agent",
    phaseKey: "scale",
    phaseLabel: "Scale",
    mission: "Company IQ extraction, cross-stack governance, pattern reuse, continuous improvement loop",
    activeVerb: "Compounding",
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
