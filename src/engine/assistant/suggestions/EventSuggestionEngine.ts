import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysisEngine"

export class EventSuggestionEngine {

  static build(
    analysis: StoryAnalysis,
  ): string[] {

    const events: string[] = []

    if (
      analysis.activeConflicts.length
    ) {

      events.push(
        "Chegada de reforços",
      )

      events.push(
        "Mudança repentina no clima",
      )

      events.push(
        "O inimigo muda de estratégia",
      )

    } else {

      events.push(
        "Um viajante misterioso aparece",
      )

      events.push(
        "Uma pista importante é encontrada",
      )

    }

    return events

  }

}