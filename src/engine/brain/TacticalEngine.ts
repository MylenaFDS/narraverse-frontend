import type { TacticalState } from "./types/Tactical"
import type { TacticalDecision } from "./types/TacticalDecision"

export class TacticalEngine {

  static decide(

    state: TacticalState,

  ): TacticalDecision {

    if (

      state.health < 20 &&

      state.enemiesNearby > 0

    ) {

      return {

        action: "retreat",

        confidence: 95,

        reason: "Vida crítica",

      }

    }

    if (

      state.enemiesNearby >

      state.alliesNearby + 2

    ) {

      return {

        action: "defend",

        confidence: 85,

        reason: "Inferioridade numérica",

      }

    }

    if (

      state.hasCover

    ) {

      return {

        action: "cover",

        confidence: 75,

        reason: "Cobertura disponível",

      }

    }

    if (

      state.distanceToTarget > 10

    ) {

      return {

        action: "approach",

        confidence: 80,

        reason: "Alvo distante",

      }

    }

    return {

      action: "attack",

      confidence: 90,

      reason: "Situação favorável",

    }

  }

}