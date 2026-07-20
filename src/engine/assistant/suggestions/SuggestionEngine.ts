import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysisEngine"

export class SuggestionEngine {

  static build(
    analysis: StoryAnalysis,
  ): string[] {

    const suggestions: string[] = []

    if (
      analysis.activeConflicts.length
    ) {

      suggestions.push(
        "Atacar o inimigo",
      )

      suggestions.push(
        "Proteger um aliado",
      )

      suggestions.push(
        "Recuar estrategicamente",
      )

    } else {

      suggestions.push(
        "Conversar com outro personagem",
      )

      suggestions.push(
        "Explorar o ambiente",
      )

      suggestions.push(
        "Refletir sobre os acontecimentos",
      )

    }

    return suggestions

  }

}