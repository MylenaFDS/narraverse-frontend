import type { Goal } from "./GoalTypes"
import type { Strategy } from "./StrategyTypes"
import type { TacticalDecision } from "./TacticalDecision"
import type { Decision } from "./DecisionTypes"
import type { Plan } from "./PlanningTypes"

export interface BrainResult {

  goal: Goal | null

  strategy: Strategy | null

  tactical: TacticalDecision

  decision: Decision

  plan: Plan | null

}