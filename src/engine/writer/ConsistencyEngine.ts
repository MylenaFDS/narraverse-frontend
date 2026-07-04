import type { BrainProfile } from "../brain/BrainProfile"

import type { ActionSequence }

from "../brain/ActionSequence"

import type { ConsistencyResult }

from "./ConsistencyResult"

export class ConsistencyEngine {

  static validate(

    profile: BrainProfile,

    actions: ActionSequence,

  ): ConsistencyResult {

    const issues = []

    // =======================
    // Personagem vivo?
    // =======================

    if (

      profile.character.health <= 0

    ) {

      issues.push({

        severity: "error",

        message:

          "Personagem morto.",

      })

    }

    // =======================
    // Objetivos
    // =======================

    if (

      profile.goals.length === 0

    ) {

      issues.push({

        severity: "warning",

        message:

          "Sem objetivo definido.",

      })

    }

    // =======================
    // Memória

    // =======================

    if (

      profile.memories.length === 0

    ) {

      issues.push({

        severity: "info",

        message:

          "Nenhuma memória relevante.",

      })

    }

    // =======================

    return {

      valid:

        issues.every(

          i =>

            i.severity !== "error",

        ),

      issues,

    }

  }

}