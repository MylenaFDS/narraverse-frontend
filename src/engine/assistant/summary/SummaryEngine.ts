import type {
  StoryAnalysis,
} from "../analysis/StoryAnalysisEngine"

export class SummaryEngine {

  static build(
    analysis: StoryAnalysis,
  ): string {

    if (
      analysis.currentTopic
    ) {

      return analysis.currentTopic

    }

    return "Nenhum evento importante aconteceu recentemente."

  }

}