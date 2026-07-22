import type { StoryAnalysis } from "../analysis/StoryAnalysisEngine"

import type { AssistantSuggestion } from "../types/AssistantSuggestion"


export class SuggestionEngine {


  static build(
    analysis: StoryAnalysis,
  ): AssistantSuggestion[] {


    const suggestions:
      AssistantSuggestion[] = []


    if(
      analysis.activeConflicts.length > 0
    ){

      suggestions.push({

        title:
          "Situação perigosa",

        description:
          "Considere uma ação defensiva ou estratégica antes de avançar.",

        type:
          "warning",

      })

    }


    if(
      analysis.activeCharacters.length > 1
    ){

      suggestions.push({

        title:
          "Interação entre personagens",

        description:
          "Um personagem pode ajudar, conversar ou reagir aos acontecimentos.",

        type:
          "strategy",

      })

    }


    return suggestions

  }

}