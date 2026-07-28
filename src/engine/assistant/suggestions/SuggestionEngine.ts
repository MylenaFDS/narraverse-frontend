import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

import type {
  SuggestionContext,
} from "./SuggestionContext"



export class SuggestionEngine {

  static build(
    context: SuggestionContext,
  ): AssistantSuggestion[] {

    const suggestions: AssistantSuggestion[] = []

    this.buildEventSuggestions(
      context,
      suggestions,
    )

    this.buildCharacterSuggestions(
      context,
      suggestions,
    )

    this.buildObjectiveSuggestions(
      context,
      suggestions,
    )

    this.buildQuestSuggestions(
      context,
      suggestions,
    )

    this.buildExplorationSuggestions(
      context,
      suggestions,
    )

    this.buildStorySuggestions(
      context,
      suggestions,
    )

    this.buildFallback(
      suggestions,
    )

    return this.removeDuplicates(
      suggestions,
    )

  }

  // ======================================
  // Eventos
  // ======================================

  private static buildEventSuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    for (
      const event of context.analysis.events.slice(-10)
    ) {

      switch (
        event.type
      ) {

        case "prophecy":

          suggestions.push({

            title:

              event.actorName
                ? `Perguntar a ${event.actorName} sobre a profecia`
                : "Investigar a profecia",

            description:

              event.description,

            type:
              "action",

          })

          break

        case "death":

          suggestions.push({

            title:

              event.actorName
                ? `Reagir à morte de ${event.actorName}`
                : "Reagir à perda recente",

            description:

              event.description,

            type:
              "character",

          })

          break

        case "dialogue":

          suggestions.push({

            title:

              event.actorName
                ? `Responder a ${event.actorName}`
                : "Responder ao diálogo",

            description:

              event.description,

            type:
              "character",

          })

          break

        case "alliance":

          suggestions.push({

            title:
              "Fortalecer a aliança",

            description:
              event.description,

            type:
              "character",

          })

          break

        case "quest":

          suggestions.push({

            title:
              "Avançar a missão",

            description:
              event.description,

            type:
              "strategy",

          })

          break

        case "attack":

          suggestions.push({

            title:
              "Preparar a próxima ação",

            description:
              "O combate continua e exige uma resposta imediata.",

            type:
              "strategy",

          })

          break

        case "discovery":

          suggestions.push({

            title:
              "Investigar a descoberta",

            description:
              event.description,

            type:
              "action",

          })

          break

      }

    }

  }

  // ======================================
  // Personagens
  // ======================================

  private static buildCharacterSuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    const analysis =
      context.analysis

    if (
      analysis.activeCharacters.length > 1
    ) {

      suggestions.push({

        title:
          "Conversar com outro personagem",

        description:
          "Uma interação pode revelar novas informações ou alterar os acontecimentos.",

        type:
          "character",

      })

    }

  }

  // ======================================
  // Objetivos
  // ======================================

  private static buildObjectiveSuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    const objective =
      context.analysis.activeObjectives[0]

    if (
      !objective
    ) {

      return

    }

    suggestions.push({

      title:
        "Dar o próximo passo do objetivo",

      description:
        objective,

      type:
        "strategy",

    })

  }

  // ======================================
  // Missões
  // ======================================

  private static buildQuestSuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    const quest =
      context.analysis.activeQuests[0]

    if (
      !quest
    ) {

      return

    }

    suggestions.push({

      title:
        "Prosseguir com a missão",

      description:
        quest,

      type:
        "event",

    })

  }

  // ======================================
  // Exploração
  // ======================================

  private static buildExplorationSuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    const location =
      context.analysis.currentLocation

    if (
      !location
    ) {

      return

    }

    suggestions.push({

      title:
        `Explorar ${location}`,

      description:
        "O ambiente pode esconder novas pistas.",

      type:
        "action",

    })

  }

  // ======================================
  // Continuidade
  // ======================================

  private static buildStorySuggestions(
    context: SuggestionContext,
    suggestions: AssistantSuggestion[],
  ) {

    const analysis =
      context.analysis

    if (
      analysis.unresolvedThreads.length > 0
    ) {

      suggestions.push({

        title:
          "Retomar uma pendência",

        description:
          analysis.unresolvedThreads[0],

        type:
          "event",

      })

    }

  }

  // ======================================
  // Fallback
  // ======================================

  private static buildFallback(
    suggestions: AssistantSuggestion[],
  ) {

    if (
      suggestions.length > 0
    ) {

      return

    }

    suggestions.push({

      title:
        "Observar o ambiente",

      description:
        "Use o cenário para iniciar naturalmente o próximo turno.",

      type:
        "action",

    })

  }

  private static removeDuplicates(
    suggestions: AssistantSuggestion[],
  ): AssistantSuggestion[] {

    return [
      ...new Map(
        suggestions.map(
          suggestion => [
            suggestion.title,
            suggestion,
          ],
        ),
      ).values(),
    ]

  }

}