import type { Goal } from "./GoalTypes"

import type { Strategy } from "./StrategyTypes"

import type { WorldKnowledge } from "./WorldKnowledge"

import type { InventoryKnowledge } from "./InventoryKnowledge"

import type { CharacterState } from "./CharacterState"

import type { RiskAssessment } from "./RiskAssessmentTypes"

import type { ReasoningResult } from "./ReasoningTypes"

export class ReasoningEngine {

  static think(

    goal: Goal | null,

    strategy: Strategy | null,

    state: CharacterState,

    world: WorldKnowledge,

    inventory: InventoryKnowledge,

    risk: RiskAssessment,

  ): ReasoningResult {

    const priorities: string[] = []

    const warnings: string[] = []

    if (goal) {

      priorities.push(

        goal.title,

      )

    }

    if (

      world.hasEnemiesNearby

    ) {

      priorities.push(

        "Observar inimigos",

      )

    }

    if (

      inventory.hasHealing

    ) {

      priorities.push(

        "Preservar item de cura",

      )

    }

    if (

      !state.canFight

    ) {

      warnings.push(

        "Combate não recomendado",

      )

    }

    if (

      risk.level === "critical"

    ) {

      warnings.push(

        "Situação crítica",

      )

    }

    return {

      summary:

        strategy?.description ??

        "Sem estratégia",

      priorities,

      warnings,

    }

  }

}