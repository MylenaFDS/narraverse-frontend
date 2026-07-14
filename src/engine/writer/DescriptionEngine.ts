import type { WriterPrompt } from "./WriterPrompt"


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

      const emotion = this.getDominantEmotion(
        prompt.emotion
      )

      parts.push(
        `Meu estado emocional é marcado por ${emotion}.`
      )

    }


    return parts.join(" ")

  }


  // ======================================
  // Interpretação emocional
  // ======================================

  private static getDominantEmotion(
    emotion: WriterPrompt["emotion"],
  ): string {

    const values = [

      {
        name: "felicidade",
        value: emotion.happiness,
      },

      {
        name: "tristeza",
        value: emotion.sadness,
      },

      {
        name: "raiva",
        value: emotion.anger,
      },

      {
        name: "medo",
        value: emotion.fear,
      },

      {
        name: "confiança",
        value: emotion.trust,
      },

      {
        name: "curiosidade",
        value: emotion.curiosity,
      },

      {
        name: "surpresa",
        value: emotion.surprise,
      },

      {
        name: "repulsa",
        value: emotion.disgust,
      },

    ]


    const dominant = values.sort(
      (a, b) => b.value - a.value
    )[0]


    return dominant.name

  }

}