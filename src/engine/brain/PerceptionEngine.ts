import type { AIContext } from "./AIContext"

import type {
  PerceptionResult,
} from "./types/Perception"


export class PerceptionEngine {

  static perceive(
    context: AIContext,
  ): PerceptionResult {

    return {

      visibleCharacters:
        context.nearbyCharacters.map(
          character =>
            character.id,
        ),

      visibleNPCs:
        context.nearbyNPCs.map(
          npc =>
            npc.id,
        ),

      audibleCharacters:
        context.nearbyCharacters.map(
          character =>
            character.id,
        ),

      visibleLore:
        context.nearbyLore.map(
          lore =>
            lore.id,
        ),

      visibleFactions:
        context.nearbyFactions.map(
          faction =>
            faction.id,
        ),

      nearbyObjects: [],

      weather:
        typeof context.currentWeather === "string"
          ? context.currentWeather
          : undefined,

      light:
        undefined,

      terrain:
        typeof context.currentTerrain === "string"
          ? context.currentTerrain
          : undefined,

      time:
        context.timeOfDay,

    }

  }

}