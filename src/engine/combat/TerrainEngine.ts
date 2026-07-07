import type { WorldContext } from "../context/ContextEngine"

export interface TerrainData {

  name: string

  attackModifier: number

  defenseModifier: number

}

export class TerrainEngine {

  static current(
    context: WorldContext,
  ): TerrainData {

    const terrain =
      context.currentScene?.terrain?.toLowerCase()

    switch (terrain) {

      case "floresta":

        return {
          name: "Floresta",
          attackModifier: -2,
          defenseModifier: 2,
        }

      case "montanha":

        return {
          name: "Montanha",
          attackModifier: 1,
          defenseModifier: 3,
        }

      default:

        return {
          name: "Normal",
          attackModifier: 0,
          defenseModifier: 0,
        }

    }

  }

}