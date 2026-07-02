import type { BrainProfile } from "./BrainProfile"
import type { Decision } from "./DecisionTypes"

import { UtilityEngine } from "./UtilityEngine"

export class DecisionEngine {

  static decide(

    profile: BrainProfile,

    goal: string | null,

    emotion: string,

  ): Decision {

    const utilities =
      UtilityEngine.evaluate(
        profile,
      )

    const best =
      utilities[0]

    let probability = Math.min(
      100,
      best.score,
    )

    // ==========================
    // Influência emocional
    // ==========================

    switch (
      emotion.toLowerCase()
    ) {

      case "raiva":

        probability += 10
        break

      case "medo":

        probability -= 15
        break

      case "tristeza":

        probability -= 5
        break

      case "confiança":

        probability += 5
        break

      case "felicidade":

        probability += 3
        break

    }

    probability = Math.max(
      5,
      Math.min(
        100,
        probability,
      ),
    )

    return {

      action: best.action,

      probability,

      reason: [

        ...(goal
          ? [`Objetivo: ${goal}`]
          : []),

        `Emoção: ${emotion}`,

        ...best.reasons,

      ].join(", "),

    }

  }

}