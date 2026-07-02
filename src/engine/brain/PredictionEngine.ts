import type { Decision } from "./DecisionTypes"

export class PredictionEngine {

  static predict(
    decision: Decision,
  ) {

    switch (decision.action) {

      case "attack":

        return [

          "Pode iniciar combate",

          "Pode gerar ferimentos",

        ]

      case "flee":

        return [

          "Pode perder reputação",

          "Pode sobreviver",

        ]

      case "advance_goal":

        return [

          "Objetivo pode avançar",

        ]

      default:

        return []

    }

  }

}