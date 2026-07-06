import type { Decision, Prediction } from "./types"

export class PredictionEngine {

  static predict(
    decision: Decision,
  ): Prediction {

    switch (decision.action) {

      case "attack":

        return {

          successChance: 70,

          summary: "O combate tem boas chances de sucesso.",

        }

      case "flee":

        return {

          successChance: 80,

          summary: "Há grande chance de escapar em segurança.",

        }

      case "advance_goal":

        return {

          successChance: 75,

          summary: "O objetivo provavelmente avançará.",

        }

      default:

        return {

          successChance: 50,

          summary: "Resultado imprevisível.",

        }

    }

  }

}