import type {
  StoryAnalysis,
} from "./analysis/StoryAnalysisEngine"

export class CharacterStatusEngine {

  static alive(
    analysis: StoryAnalysis,
  ): string[] {

    return [
      ...analysis.activeCharacters,
    ]

  }

  static dead(
    analysis: StoryAnalysis,
  ): string[] {

    return [
      ...analysis.deadCharacters,
    ]

  }

}