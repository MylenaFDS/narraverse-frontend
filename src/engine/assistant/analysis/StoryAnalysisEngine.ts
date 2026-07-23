import type {
  AssistantContext,
} from "../AssistantContext"
import type {
  StoryAnalysis,
} from "./StoryAnalysis"

export class StoryAnalysisEngine {


  static analyze(
    context: AssistantContext,
  ): StoryAnalysis {


    return {


      activeConflicts:

        context.story.activeEvents,


      currentSituation:

        context.story.currentSituation,


      activeCharacters:

        context.characters.map(
          character =>
            character.name,
        ),


      deadCharacters:

        context.campaignState.deadCharacters,


      recentEvents:

        context.story.recentTurns,


      unresolvedThreads:

        context.story.unresolvedThreads,

      sceneMood:

        context.story.sceneMood,


    }


  }


}