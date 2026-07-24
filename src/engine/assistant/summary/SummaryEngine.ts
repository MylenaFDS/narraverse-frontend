import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysis"

export class SummaryEngine {

  static build(
    analysis: StoryAnalysis,
  ): string {

    if (
      analysis.currentSituation
    ) {

      return analysis.currentSituation

    }

    return "Nenhum evento importante aconteceu recentemente."

  }

}