import type { Personality } from "./PersonalityTypes"
import type { Intent } from "./IntentTypes"

import type { CharacterBehavior } from "./BehaviorTypes"

export class CharacterBehaviorEngine {

  static build(

    personality: Personality,

    emotion: string,

    intent: Intent,

  ): CharacterBehavior {

    const behavior: CharacterBehavior = {

      tone: "calmo",

      posture: "neutra",

      pacing: "normal",

      riskTaking: "moderado",

    }

    if (personality.courage >= 70) {

      behavior.riskTaking = "alto"

    }

    if (personality.empathy >= 70) {

      behavior.tone = "gentil"

    }

    if (personality.cruelty >= 70) {

      behavior.tone = "agressivo"

    }

    if (emotion === "Raiva") {

      behavior.posture = "hostil"

    }

    if (emotion === "Medo") {

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