import type { Decision } from "./WorldDecisionEngine"
import { MemoryEngine } from "./MemoryEngine"

export interface NarrativeContext {

  actor?: string

  target?: string

  location?: string

  action: string

  result?: string
}

export class NarrativeEngine {

  static describe(
    context: NarrativeContext,
  ): string {

    switch (context.action) {

      case "attack":

        return `${context.actor} atacou ${context.target}.`

      case "heal":

        return `${context.actor} curou ${context.target}.`

      case "defend":

        return `${context.actor} assumiu posição defensiva.`

      case "generate_event":

        return "Um novo acontecimento alterou os rumos do mundo."

      case "generate_npc":

        return "Uma nova figura apareceu nesta região."

      case "suggest_character":

        return "Novos heróis podem surgir nesta história."

      default:

        return context.result ??
          "Algo aconteceu."
    }
  }

  static summarizeTurn(
    texts: string[],
  ) {

    return texts.join("\n")
  }

  static summarizeRecentEvents() {

    const memories =
      MemoryEngine.getRecent(10)

    return memories.map(
      memory =>
        `• ${memory.title}`
    ).join("\n")
  }

  static explainDecision(
    decision: Decision,
  ) {

    return decision.reason
  }

}