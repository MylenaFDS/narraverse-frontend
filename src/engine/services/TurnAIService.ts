import { generateTurnWithAI } from "../../services/ai"

export class TurnAIService {

  static async generate(
    characterId: number,
    rpgId: number,
  ): Promise<string> {

    const response =
      await generateTurnWithAI({

        character_id: characterId,

        rpg_id: rpgId,

      })

    // compatibilidade com backend atual
    if (typeof response === "string") {
      return response
    }

    if (response.turn) {
      return response.turn
    }

    if (response.response) {
      return response.response
    }

    return ""
  }

}