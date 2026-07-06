import type { Decision } from "./types/Decision"

import type { Consequence } from "./types/Consequence"

export class ConsequenceEngine {

  static predict(

    decision: Decision,

  ): Consequence {

    switch (decision.action) {

      case "attack":

        return {

          immediate:

            "Combate iniciado.",

          shortTerm:

            "O inimigo reagirá.",

          longTerm:

            "A relação entre as partes pode mudar.",

        }

      case "talk":

        return {

          immediate:

            "Conversa iniciada.",

          shortTerm:

            "O alvo responderá.",

          longTerm:

            "A confiança poderá aumentar ou diminuir.",

        }

      case "escape":

        return {

          immediate:

            "Distância criada.",

          shortTerm:

            "Perseguição possível.",

          longTerm:

            "Sobrevivência aumentada.",

        }

      default:

        return {

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