import type { Goal } from "./types/Goal"

import type { Strategy } from "./types/Strategy"

import type { WorldKnowledge } from "./types/WorldKnowledge"

import type { InventoryKnowledge } from "./types/InventoryKnowledge"

import type { CharacterState } from "./types/CharacterState"

import type { RiskAssessment } from "./types/RiskAssessment"

import type { ReasoningResult } from "./types/Reasoning"

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