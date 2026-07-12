import type { AIContext } from "./AIContext"

import type { WorldKnowledge } from "./types/WorldKnowledge"

export class WorldReasoningEngine {

  static analyze(

    context: AIContext,

  ): WorldKnowledge {

    const scene = context.scene

    const terrain =

      scene?.terrain
        ?.toLowerCase()
        .trim() ?? ""

    const weather =

      scene?.weather
        ?.toLowerCase()
        .trim() ?? ""

    const light =

      scene?.light
        ?.toLowerCase()
        .trim() ?? ""

    const time =

      scene?.time
        ?.toLowerCase()
        .trim() ?? ""

    return {

      isNight:

        time === "night",

      isRaining:

        weather.includes("chuva"),

      isSnowing:

        weather.includes("neve"),

      isFoggy:

        weather.includes("névoa") ||

        weather.includes("neblina"),

      isDark:

        light === "dark",

      isIndoor:

        terrain.includes("interior") ||

        terrain.includes("castelo") ||

        terrain.includes("caverna"),

      isOutdoor:

        !(
          terrain.includes("interior") ||
          terrain.includes("castelo") ||
          terrain.includes("caverna")
        ),

      hasFire:

        terrain.includes("fogo"),

      hasWater:

        terrain.includes("rio") ||
        terrain.includes("lago") ||
        terrain.includes("mar"),

      hasDanger:

        context.nearbyNPCs.length > 0,

      hasEnemiesNearby:

        context.nearbyNPCs.length > 0,

      hasAlliesNearby:

        context.nearbyCharacters.length > 1,

      locationType:

        terrain,

    }

  }

}