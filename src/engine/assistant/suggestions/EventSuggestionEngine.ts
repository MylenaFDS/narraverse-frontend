import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

import type {
  NarrativeState,
} from "../state/NarrativeState"

import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

export class EventSuggestionEngine {

  static build(
    analysis: StoryAnalysis,
    state: NarrativeState,
  ): AssistantSuggestion[] {

    const events: AssistantSuggestion[] = []

    this.buildConflictEvents(
      state,
      events,
    )

    this.buildExplorationEvents(
      state,
      analysis,
      events,
    )

    this.buildCharacterEvents(
      state,
      analysis,
      events,
    )

    this.buildStoryEvents(
      state,
      analysis,
      events,
    )

    return events

  }

  // ==================================
  // Combate
  // ==================================

  private static buildConflictEvents(

    state: NarrativeState,

    events: AssistantSuggestion[],

  ) {

    if (
      state.situation !== "combat"
    ) {

      return

    }

    events.push({

      title:
        "Reforços chegam",

      description:
        "Um novo aliado ou inimigo pode entrar no conflito.",

      type:
        "event",

    })

    events.push({

      title:
        "Mudança no campo de batalha",

      description:
        "O ambiente pode alterar completamente o combate.",

      type:
        "event",

    })

    events.push({

      title:
        "O inimigo muda de estratégia",

      description:
        "O adversário pode surpreender o grupo com uma nova abordagem.",

      type:
        "event",

    })

  }

  // ==================================
  // Exploração
  // ==================================

  private static buildExplorationEvents(

    state: NarrativeState,

    analysis: StoryAnalysis,

    events: AssistantSuggestion[],

  ) {

    if (
      !state.canExplore
    ) {

      return

    }

    events.push({

      title:
        "Nova descoberta",

      description:
        "Uma pista, objeto ou local importante pode ser encontrado.",

      type:
        "event",

    })

    if (
      analysis.discoveredLocations.length > 0
    ) {

      events.push({

        title:
          "Novo caminho",

        description:
          "Uma rota alternativa pode levar a um dos locais conhecidos.",

        type:
          "event",

      })

    }

  }

  // ==================================
  // Personagens
  // ==================================

  private static buildCharacterEvents(
  state: NarrativeState,
  analysis: StoryAnalysis,
  events: AssistantSuggestion[],
) {

  if (!state.canInteract) {
    return
  }

  events.push({
    title: "Reação de personagem",
    description:
      `${analysis.activeCharacters[0]} pode tomar uma decisão inesperada.`,
    type: "character",
  })

}
  // ==================================
  // Narrativa
  // ==================================

  private static buildStoryEvents(

    state: NarrativeState,

    analysis: StoryAnalysis,

    events: AssistantSuggestion[],

  ) {

    if (
      state.hasOpenThreads
    ) {

      events.push({

        title:
          "Retomar uma pendência",

        description:
          analysis.unresolvedThreads[0],

        type:
          "strategy",

      })

    }

    if (
      state.canCreateEvent
    ) {

      events.push({

        title:
          "Introduzir um novo acontecimento",

        description:
          "Um evento inesperado pode movimentar a narrativa.",

        type:
          "event",

      })

    }

  }

}