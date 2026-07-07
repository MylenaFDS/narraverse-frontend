import type { Decision, Consequence } from "./types"

export class ConsequenceEngine {

  static predict(

    decision: Decision,

  ): Consequence {

    switch (decision.action) {

      case "attack":

        return {

          success: true,

          immediate:
            "Combate iniciado.",

          shortTerm:
            "O inimigo reagirá.",

          longTerm:
            "A relação entre as partes pode mudar.",

        }

      case "talk":

        return {

          success: true,

          immediate:
            "Conversa iniciada.",

          shortTerm:
            "O alvo responderá.",

          longTerm:
            "A confiança poderá aumentar ou diminuir.",

        }

      case "escape":

        return {

          success: true,

          immediate:
            "Distância criada.",

          shortTerm:
            "Perseguição possível.",

          longTerm:
            "Sobrevivência aumentada.",

        }

      default:

        return {

          success: false,

          immediate:
            "Ação executada.",

          shortTerm:
            "Consequências desconhecidas.",

          longTerm:
            "Impacto imprevisível.",

        }

    }

  }

}