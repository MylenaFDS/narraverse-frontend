import type { BrainProfile } from "../brain/BrainProfile"

import type { ConsistencyIssue } from "./ConsistencyIssue"

import type { ConsistencyResult }

from "./ConsistencyResult"

export class ConsistencyEngine {

  static validate(

    profile: BrainProfile,


  ): ConsistencyResult {

    const issues: ConsistencyIssue[] = []

    // =======================
    // Personagem vivo?
    // =======================

    {

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