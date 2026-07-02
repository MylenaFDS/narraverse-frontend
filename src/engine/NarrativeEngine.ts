import type { Decision } from "./WorldDecisionEngine"

import { MemoryEngine } from "./MemoryEngine"

import type { AIContext } from "./brain/AIContext"

import type { PerceptionResult } from "./brain/PerceptionTypes"

export interface NarrativeContext {

  actor?: string

  target?: string

  location?: string

  action: string

  result?: string

}

export interface NarrativeComposeInput {

  decision: Decision

  context: AIContext

  perception: PerceptionResult

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

        return (
          context.result ??
          "Algo aconteceu."
        )

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

    return memories
      .map(

        memory =>
          `• ${memory.title}`,

      )
      .join("\n")

  }

  static explainDecision(
    decision: Decision,
  ) {

    return decision.reason

  }

  // =====================================================
  // NOVO
  // =====================================================

  static compose(

    input: NarrativeComposeInput,

  ): string {

    const {

      decision,

      context,

      perception,

    } = input

    const profile =
      context.profile

    const self =
      context.self

    const visibleCharacters =
      perception.visibleCharacters
        .map(

          id =>

            context.nearbyCharacters.find(

              c => c.id === id,

            )?.name,

        )
        .filter(Boolean)
        .join(", ")

    const visibleNPCs =
      perception.visibleNPCs
        .map(

          id =>

            context.nearbyNPCs.find(

              npc => npc.id === id,

            )?.name,

        )
        .filter(Boolean)
        .join(", ")

    const memories =
      MemoryEngine
        .getRecent(5)
        .map(

          memory =>
            `• ${memory.title}`,

        )
        .join("\n")

    return `

Você interpreta ${self.name}.

==========================
PERSONALIDADE
==========================

${profile.personality}

==========================
OBJETIVOS
==========================

${profile.currentGoal?.title ?? "Sem objetivo"}

==========================
ESTADO EMOCIONAL
==========================

${profile.currentEmotion}

==========================
O QUE VOCÊ VÊ
==========================

Personagens:
${visibleCharacters || "Ninguém"}

NPCs:
${visibleNPCs || "Nenhum"}

==========================
MEMÓRIAS IMPORTANTES
==========================

${memories || "Nenhuma"}

==========================
DECISÃO TOMADA
==========================

${decision.action}

Motivo:

${decision.reason}

==========================
INSTRUÇÕES
==========================

Escreva um turno em primeira pessoa.

Mantenha coerência com a personalidade.

Não invente personagens que não estejam visíveis.

Não utilize informações que o personagem não poderia conhecer.

Escreva apenas o turno.

`.trim()

  }

}