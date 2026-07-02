import type { WorldContext } from "./ContextEngine"

import { RuleEngine } from "./RuleEngine"
import { DecisionEngine } from "./WorldDecisionEngine"
import { NarrativeEngine } from "./NarrativeEngine"

export interface SimulationResult {

  valid: boolean

  score: number

  decisions: string[]

  narrative: string[]

  warnings: string[]
}

export class SimulationEngine {

  static simulate(
    context: WorldContext,
  ): SimulationResult {

    const validation =
      RuleEngine.evaluate(context)

    const decisionList =
      DecisionEngine.decide(context)

    const narrative =
      decisionList.map(
        decision =>
          NarrativeEngine.describe({
            action: decision.action,
            result: decision.reason,
          })
      )

    return {

      valid:
        validation.allowed,

      score:
        validation.score,

      warnings:
        validation.reasons,

      decisions:
        decisionList.map(
          d => d.action
        ),

      narrative,
    }
  }

}