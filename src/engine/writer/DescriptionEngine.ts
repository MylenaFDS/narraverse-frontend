import type { WriterPrompt } from "./WriterPrompt"

export class DescriptionEngine {

  static describe(
    prompt: WriterPrompt,
  ): string {

    const parts: string[] = []

    // Objetivo

    if (prompt.objective !== "Nenhum") {

      parts.push(

        `Meu objetivo continua sendo ${prompt.objective.toLowerCase()}.`

      )

    }

    // Estratégia

    if (prompt.strategy !== "Livre") {

      parts.push(

        `Decido agir utilizando uma estratégia de ${prompt.strategy.toLowerCase()}.`

      )

    }

    // Plano

    if (prompt.plan.length > 0) {

      parts.push(

        `Pretendo ${prompt.plan[0].toLowerCase()}.`

      )

    }

    // Tática

    parts.push(

      `Minha postura é ${prompt.tactical.toLowerCase()}.`

    )

    return parts.join(" ")

  }

}