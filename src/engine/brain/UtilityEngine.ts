import type { BrainProfile } from "./BrainProfile"
import type { UtilityScore } from "./UtilityScore"

export class UtilityEngine {

  static evaluate(
    profile: BrainProfile,
  ): UtilityScore[] {

    const scores: UtilityScore[] = []

    const goal =
      profile.goals
        .filter(
          (g) => !g.completed,
        )
        .sort(
          (a, b) =>
            b.priority - a.priority,
        )[0]

    // =====================================
    // Caso ainda não exista objetivo
    // =====================================

    if (!goal) {

      scores.push({
        action: "observe",
        score: 10,
        reasons: [
          "Nenhum objetivo definido",
        ],
      })

      return scores

    }

    // =====================================
    // Explorar
    // =====================================

    scores.push({

      action: "explore",

      score:
        profile.personality.curiosity,

      reasons: [
        "Curiosidade",
      ],

    })

    // =====================================
    // Conversar
    // =====================================

    scores.push({

      action: "talk",

      score:
        profile.personality.empathy +
        profile.personality.loyalty,

      reasons: [
        "Empatia",
        "Lealdade",
      ],

    })

    // =====================================
    // Atacar
    // =====================================

    scores.push({

      action: "attack",

      score:
        profile.personality.courage +
        profile.personality.ambition -
        profile.personality.empathy,

      reasons: [
        "Coragem",
        "Ambição",
      ],

    })

    // =====================================
    // Fugir
    // =====================================

    scores.push({

      action: "retreat",

      score:
        profile.emotions.fear * 1.5,

      reasons: [
        "Medo",
      ],

    })

    // =====================================
    // Defender
    // =====================================

    scores.push({

      action: "defend",

      score:
        profile.personality.loyalty +
        profile.personality.honor,

      reasons: [
        "Honra",
        "Lealdade",
      ],

    })

    // =====================================

    return scores.sort(
      (a, b) =>
        b.score - a.score,
    )

  }

}