import type { WorldContext } from "../context/ContextEngine"

export interface WeatherData {

  name: string

  attackModifier: number

  defenseModifier: number

}

export class WeatherEngine {

  static current(
    context: WorldContext,
  ): WeatherData {

    const weather =
      context.currentScene?.weather?.toLowerCase()

    switch (weather) {

      case "chuva":

        return {
          name: "Chuva",
          attackModifier: -2,
          defenseModifier: 0,
        }

      case "tempestade":

        return {
          name: "Tempestade",
          attackModifier: -4,
          defenseModifier: -1,
        }

      case "neve":

        return {
          name: "Neve",
          attackModifier: -1,
          defenseModifier: 1,
        }

      case "neblina":

        return {
          name: "Neblina",
          attackModifier: -3,
          defenseModifier: 2,
        }

      default:

        return {
          name: "Clima limpo",
          attackModifier: 0,
          defenseModifier: 0,
        }

    }

  }

}