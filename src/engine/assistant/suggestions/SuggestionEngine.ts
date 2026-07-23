import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

import type {
  AssistantSuggestion,
} from "../types/AssistantSuggestion"

export class SuggestionEngine {

  static build(
    analysis: StoryAnalysis,
  ): AssistantSuggestion[] {

    const suggestions:
      AssistantSuggestion[] = []

    this.buildConflictSuggestions(
      analysis,
      suggestions,
    )

    this.buildCharacterSuggestions(
      analysis,
      suggestions,
    )

    this.buildObjectiveSuggestions(
      analysis,
      suggestions,
    )

    this.buildQuestSuggestions(
      analysis,
      suggestions,
    )

    this.buildExplorationSuggestions(
      analysis,
      suggestions,
    )

    this.buildStorySuggestions(
      analysis,
      suggestions,
    )

    this.buildFallback(
      suggestions,
    )

    return suggestions

  }

  // ==================================
  // Combates
  // ==================================

  private static buildConflictSuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (
      analysis.activeConflicts.length === 0
    ) {
      return
    }

    suggestions.push({

      title:
        "Buscar vantagem tática",

      description:
        "Use cobertura, terreno e aliados antes de agir.",

      type:
        "strategy",

    })

    suggestions.push({

      title:
        "Proteger um aliado",

      description:
        "Alguém pode precisar de ajuda imediatamente.",

      type:
        "action",

    })

    suggestions.push({

      title:
        "Mudar a estratégia",

      description:
        "Recuar, negociar ou criar uma distração pode alterar completamente o combate.",

      type:
        "strategy",

    })

  }

  // ==================================
  // Personagens
  // ==================================

  private static buildCharacterSuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (
      analysis.deadCharacters.length > 0
    ) {

      suggestions.push({

        title:
          "Reagir à perda",

        description:
          "A morte recente pode mudar a motivação dos personagens.",

        type:
          "character",

      })

    }

    if (
      analysis.recentDialogue.length > 0
    ) {

      suggestions.push({

        title:
          "Responder ao diálogo",

        description:
          "As últimas palavras ainda podem influenciar a narrativa.",

        type:
          "character",

      })

    }

    if (
      analysis.activeCharacters.length > 1
    ) {

      suggestions.push({

        title:
          "Criar interação",

        description:
          "Outro personagem pode agir por conta própria.",

        type:
          "character",

      })

    }

  }

  // ==================================
  // Objetivos
  // ==================================

  private static buildObjectiveSuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (
      analysis.activeObjectives.length === 0
    ) {
      return
    }

    suggestions.push({

      title:
        "Avançar o objetivo",

      description:
        analysis.activeObjectives[0],

      type:
        "strategy",

    })

  }

  // ==================================
  // Missões
  // ==================================

  private static buildQuestSuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (
      analysis.activeQuests.length === 0
    ) {
      return
    }

    suggestions.push({

      title:
        "Continuar a missão",

      description:
        analysis.activeQuests[0],

      type:
        "event",

    })

  }

  // ==================================
  // Exploração
  // ==================================

  private static buildExplorationSuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (

      analysis.activeConflicts.length === 0

    ) {

      suggestions.push({

        title:
          "Explorar o cenário",

        description:
          "O ambiente pode esconder novas pistas.",

        type:
          "action",

      })

    }

    if (

      analysis.discoveredLocations.length > 0

    ) {

      suggestions.push({

        title:
          "Visitar outro local",

        description:
          analysis.discoveredLocations[0],

        type:
          "event",

      })

    }

  }

  // ==================================
  // Narrativa
  // ==================================

  private static buildStorySuggestions(

    analysis: StoryAnalysis,

    suggestions: AssistantSuggestion[],

  ) {

    if (

      analysis.unansweredQuestions.length > 0

    ) {

      suggestions.push({

        title:
          "Buscar respostas",

        description:
          analysis.unansweredQuestions[0],

        type:
          "strategy",

      })

    }

    if (

      analysis.unresolvedThreads.length > 0

    ) {

      suggestions.push({

        title:
          "Retomar um acontecimento",

        description:
          analysis.unresolvedThreads[0],

        type:
          "event",

      })

    }

  }

  // ==================================
  // Segurança
  // ==================================

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
        "Continuar explorando",

      description:
        "Observe o ambiente e permita que a história evolua naturalmente.",

      type:
        "action",

    })

  }

}