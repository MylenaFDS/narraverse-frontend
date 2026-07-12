import type { BrainProfile } from "./BrainProfile"
import type { Decision } from "./types"
import type { EmotionState } from "./types/Emotion"

import { UtilityEngine } from "./UtilityEngine"

export class DecisionEngine {

  static decide(
    profile: BrainProfile,
    goal: string | null,
    emotion: EmotionState,
  ): Decision {

    const utilities =
      UtilityEngine.evaluate(profile)

    // ==========================
    // Nenhuma ação disponível
    // ==========================

    if (utilities.length === 0) {

      return {

        action: "wait",

        probability: 100,

        reason: goal
          ? `Objetivo: ${goal}`
          : "Nenhuma ação disponível",

      }

    }

    const best = utilities[0]

    let probability = Math.min(
      100,
      best.score,
    )

    const dominant =
      Object.entries(emotion)
        .sort(
          (a, b) => b[1] - a[1],
        )[0][0]

    switch (dominant) {

      case "anger":
        probability += 10
        break

      case "fear":
        probability -= 15
        break

      case "sadness":
        probability -= 5
        break

      case "trust":
        probability += 5
        break

      case "happiness":
        probability += 3
        break

    }

    probability = Math.max(
      5,
      Math.min(100, probability),
    )

    return {

      action: best.action,

      probability,

      reason: [

        ...(goal
          ? [`Objetivo: ${goal}`]
          : []),

        `Emoção dominante: ${dominant}`,

        ...best.reasons,

      ].join(", "),

    }

  }

}