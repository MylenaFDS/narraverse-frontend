import type { WriterPrompt } from "./WriterPrompt"
import { EmotionInterpreterEngine } from "../emotion/EmotionInterpreterEngine"

export class DescriptionEngine {

  static describe(
    prompt: WriterPrompt,
  ): string {

    const parts: string[] = []


    // Nome do personagem

    parts.push(
      `${prompt.characterName} pensa:`
    )


    // Objetivo

    if (prompt.goal) {

      parts.push(
        `Meu objetivo continua sendo ${prompt.goal.toLowerCase()}.`
      )

    }


    // Decisão

    if (prompt.decision) {

      parts.push(
        `Decido ${prompt.decision.action.toLowerCase()}.`
      )

    }


    // Razão da decisão

    if (prompt.decision.reason) {

      parts.push(
        `Essa escolha acontece porque ${prompt.decision.reason.toLowerCase()}.`
      )

    }


    // Plano

if (prompt.plan) {

  parts.push(
    `Minha estratégia é ${prompt.plan.strategy.toLowerCase()}.`
  )

}


    // Estado emocional

    if (prompt.emotion) {

      const emotion = EmotionInterpreterEngine.describe(
  prompt.emotion
)

      parts.push(
        `Meu estado emocional é marcado por ${emotion}.`
      )

    }


    return parts.join(" ")

  }


  

}