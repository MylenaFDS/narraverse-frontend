import type { WorldContext } from "./context/ContextEngine"

import { WorldReasoningEngine } from "./brain/WorldReasoningEngine"
import { CharacterStateEngine } from "./brain/CharacterStateEngine"
import { InventoryReasoningEngine } from "./brain/InventoryReasoningEngine"

export interface RuleResult {

  allowed: boolean

  score: number

  reasons: string[]

}

export class RuleEngine {

  static evaluate(
    context: WorldContext,
  ): RuleResult {

    let score = 100

    const reasons: string[] = []

    // ============================
    // Mundo
    // ============================

    const world =
      WorldReasoningEngine.analyze(
        context,
      )

    if (world.hasDanger) {

      score -= 10

      reasons.push(
        "Ambiente perigoso.",
      )

    }

    // ============================
    // Estado do personagem
    // ============================

    const state =
      CharacterStateEngine.build(
        context.profile.character,
      )

    if (state.health < 20) {

      score -= 30

      reasons.push(
        "Personagem gravemente ferido.",
      )

    }

    // ============================
    // Inventário
    // ============================

    const inventory =
      InventoryReasoningEngine.analyze(
        context.inventory,
      )

    if (!inventory.hasWeapon) {

      score -= 10

      reasons.push(
        "Sem arma equipada.",
      )

    }

    if (!inventory.hasFood) {

      score -= 5

      reasons.push(
        "Sem comida.",
      )

    }

    return {

      allowed:
        score > 0,

      score,

      reasons,

    }

  }

}