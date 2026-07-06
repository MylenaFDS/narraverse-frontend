import type { Goal, Strategy,TacticalDecision,Decision,Plan } from "."


export interface BrainResult {

  goal: Goal | null

  strategy: Strategy | null

  tactical: TacticalDecision

  decision: Decision

  plan: Plan | null

}