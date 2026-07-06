import type { CharacterState } from "./types/CharacterState"

import type { WorldKnowledge } from "./types/WorldKnowledge"

import type { InventoryKnowledge } from "./types/InventoryKnowledge"

import type { RiskAssessment } from "./types/RiskAssessment"

export class RiskAssessmentEngine {

  static analyze(

    state: CharacterState,

    world: WorldKnowledge,

    inventory: InventoryKnowledge,

  ): RiskAssessment {

    let score = 0

    const reasons: string[] = []

    // ==========================
    // Vida
    // ==========================

    if (!state.alive) {

      return {

        score: 100,

        level: "critical",

        reasons: [

          "Personagem morto",

        ],

      }

    }

    if (state.wounded) {

      score += 30

      reasons.push(

        "Ferido",

      )

    }

    // ==========================
    // Consciência
    // ==========================

    if (!state.conscious) {

      score += 40

      reasons.push(

        "Inconsciente",

      )

    }

    // ==========================
    // Movimento
    // ==========================

    if (!state.canMove) {

      score += 20

      reasons.push(

        "Imobilizado",

      )

    }

    // ==========================
    // Arma
    // ==========================

    if (!inventory.hasWeapon) {

      score += 15

      reasons.push(

        "Sem arma",

      )

    }

    // ==========================
    // Cura
    // ==========================

    if (!inventory.hasHealing) {

      score += 10

      reasons.push(

        "Sem itens de cura",

      )

    }

    // ==========================
    // Inimigos
    // ==========================

    if (world.hasEnemiesNearby) {

      score += 20

      reasons.push(

        "Inimigos próximos",

      )

    }

    // ==========================
    // Sem aliados
    // ==========================

    if (!world.hasAlliesNearby) {

      score += 10

      reasons.push(

        "Sem aliados",

      )

    }

    // ==========================
    // Ambiente
    // ==========================

    if (world.isDark) {

      score += 5

      reasons.push(

        "Pouca visibilidade",

      )

    }

    if (world.isRaining) {

      score += 5

      reasons.push(

        "Chuva",

      )

    }

    if (world.isFoggy) {

      score += 5

      reasons.push(

        "Névoa",

      )

    }

    score = Math.min(

      score,

      100,

    )

    let level: RiskAssessment["level"]

    if (score < 25) {

      level = "low"

    }

    else if (score < 50) {

      level = "medium"

    }

    else if (score < 75) {

      level = "high"

    }

    else {

      level = "critical"

    }

    return {

      score,

      level,

      reasons,

    }

  }

}