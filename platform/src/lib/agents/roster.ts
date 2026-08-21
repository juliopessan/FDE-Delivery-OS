import rosterData from "../../../../engine/fde_engine/prompts/roster.json";

/**
 * The nine agents, as the interface needs to show them.
 *
 * The engine owns this list — `engine/fde_engine/prompts/roster.json` is the
 * same file its pipeline reads, imported here rather than copied. What the
 * agents are *told* stays in the engine entirely; none of that is needed to
 * draw a row on the dashboard, and importing it here would drag 52k characters
 * of prompt into the browser bundle for nothing.
 *
 * Reading across the directory boundary is deliberate. A copy would drift the
 * first time an agent was renamed, and the drift would be invisible: the
 * dashboard would go on showing a name the pipeline no longer uses.
 */

export interface AgentDefinition {
  key: string;
  name: string;
  phaseKey: string;
  phaseLabel: string;
  mission: string;
  model: string;
  /**
   * Present-continuous verbs shown while this agent's phase run is active.
   * Several per agent, cycled in the UI, so a long-running phase reads as work
   * in progress rather than a stuck label. Drawn from the vocabulary of the
   * discipline the agent actually practises.
   */
  activeVerbs: string[];
}

export const AGENT_ROSTER: AgentDefinition[] = rosterData;
