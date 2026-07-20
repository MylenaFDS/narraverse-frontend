import type { AssistantContext } from "../AssistantContext"

export interface StoryAnalysis {

  activeConflicts: string[]

  currentTopic: string | null

  activeCharacters: string[]

}

export class StoryAnalysisEngine {

  static analyze(
    context: AssistantContext,
  ): StoryAnalysis {

    return {

      activeConflicts:
        context.story.activeEvents,

      currentTopic:
        context.story.currentSituation,

      activeCharacters:

        context.characters.map(
          character =>
            character.name,
        ),

    }

  }

}