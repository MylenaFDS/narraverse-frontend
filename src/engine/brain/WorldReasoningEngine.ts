import type { WorldContext } from "../ContextEngine"

import type { WorldKnowledge } from "./WorldKnowledge"

export class WorldReasoningEngine {

  static analyze(

    context: WorldContext,

  ): WorldKnowledge {

    return {

      isNight:

        context.timeOfDay === "night",

      isRaining:

        context.weather === "rain",

      isSnowing:

        context.weather === "snow",

      isFoggy:

        context.weather === "fog",

      isDark:

        context.light === "dark",

      isIndoor:

        context.locationType === "indoor",

      isOutdoor:

        context.locationType === "outdoor",

      hasFire:

        context.environment.includes("fire"),

      hasWater:

        context.environment.includes("water"),

      hasDanger:

        context.dangerLevel > 0,

      hasEnemiesNearby:

        context.nearbyEnemies.length > 0,

      hasAlliesNearby:

        context.nearbyAllies.length > 0,

      locationType:

        context.locationType,

    }

  }

}