import type { AIContext } from "./AIContext"

import type {
  PerceptionResult,
} from "./PerceptionTypes"

export class PerceptionEngine {

  static perceive(

    context: AIContext,

  ): PerceptionResult {

    return {

      visibleCharacters:

        context.nearbyCharacters.map(

          character => character.id,

        ),

      visibleNPCs:

        context.nearbyNPCs.map(

          npc => npc.id,

        ),

      visibleLore: [],

      visibleFactions: [],

      audibleCharacters:

        context.nearbyCharacters.map(

          character => character.id,

        ),

      nearbyObjects: [],

    }

  }

}