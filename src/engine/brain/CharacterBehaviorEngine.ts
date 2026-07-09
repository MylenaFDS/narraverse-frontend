import type { Personality } from "./types/Personality"
import type { Intent } from "./types/Intent"
import type { EmotionState } from "./types/Emotion"

import type { CharacterBehavior } from "./types/Behavior"

export class CharacterBehaviorEngine {

  static build(

    personality: Personality,

    emotion: EmotionState,

    intent: Intent,

  ): CharacterBehavior {

    const behavior: CharacterBehavior = {

      tone: "calmo",

      posture: "neutra",

      pacing: "normal",

      riskTaking: "moderado",

    }

    const dominant =
      Object.entries(emotion)
        .sort(
          (a, b) =>
            b[1] - a[1],
        )[0][0]

    if (personality.courage >= 70) {

      behavior.riskTaking = "alto"

    }

    if (personality.empathy >= 70) {

      behavior.tone = "gentil"

    }

    if (personality.cruelty >= 70) {

      behavior.tone = "agressivo"

    }

    if (dominant === "anger") {

      behavior.posture = "hostil"

    }

    if (dominant === "fear") {

      behavior.posture = "defensiva"

    }

    if (

      intent.primary === "Atacar"

    ) {

      behavior.pacing = "rápido"

    }

    return behavior

  }

}