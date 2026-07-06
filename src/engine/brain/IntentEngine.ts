import type { Decision } from "./DecisionTypes"
import type { Intent } from "./IntentTypes"

export class IntentEngine {

  static create(
    decision: Decision,
  ): Intent {

    switch (decision.action) {

      case "attack":

        return {

          primary: "Atacar",

          fallback: "Recuar",

          success: "Eliminar ameaça",

        }

      case "defend":

        return {

          primary: "Defender",

          fallback: "Reposicionar",

          success: "Sobreviver",

        }

      case "talk":

        return {

          primary: "Negociar",

          fallback: "Encerrar conversa",

          success: "Convencer",

        }

      case "escape":

        return {

          primary: "Fugir",

          fallback: "Esconder-se",

          success: "Sobreviver",

        }

      default:

        return {

          primary: decision.action,

        }

    }

  }

}