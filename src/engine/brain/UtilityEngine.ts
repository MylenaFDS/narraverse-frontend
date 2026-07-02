import type { BrainProfile } from "./BrainProfile"
import type { UtilityScore } from "./UtilityTypes"

export class UtilityEngine {

  static evaluate(

    profile: BrainProfile,

  ): UtilityScore[] {

    const actions: UtilityScore[] = []

    actions.push({

      action: "attack",

      score:

        profile.emotions.anger +

        profile.personality.courage,

      reasons: [

        "Raiva",

        "Coragem",

      ],

    })

    actions.push({

      action: "flee",

      score:

        profile.emotions.fear -

        profile.personality.courage,

      reasons: [

        "Medo",

      ],

    })

    actions.push({

      action: "talk",

      score:

        profile.personality.empathy +

        profile.emotions.trust,

      reasons: [

        "Empatia",

        "Confiança",

      ],

    })

    return actions.sort(

      (a, b) =>

        b.score - a.score,

    )

  }

}