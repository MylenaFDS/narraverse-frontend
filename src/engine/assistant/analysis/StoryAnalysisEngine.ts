import type { AssistantContext } from "../AssistantContext"

export interface StoryAnalysis {

  // História

  currentSituation: string

  currentLocation?: string

  sceneMood: string

  topics: string[]

  recentEvents: string[]

  // Conflitos

  activeConflicts: string[]

  unresolvedThreads: string[]

  unansweredQuestions: string[]

  // Personagens

  activeCharacters: string[]

  deadCharacters: string[]

  focusedCharacter?: string

  // Objetivos

  activeObjectives: string[]

  activeQuests: string[]

  // Estado

  tensionLevel:
    "low"
    | "medium"
    | "high"

}
export class StoryAnalysisEngine {

  static analyze(
    context: AssistantContext,
  ): StoryAnalysis {

    const tensionLevel =

      context.story.activeEvents.length > 3
        ? "high"

        : context.story.activeEvents.length > 0
          ? "medium"
          : "low"

    return {

      currentSituation:
        context.story.currentSituation,

      currentLocation:
        context.story.currentLocation,

      sceneMood:
        context.story.sceneMood,

      topics:
        context.story.topics,

      recentEvents:
        context.story.recentTurns,

      activeConflicts:
        context.story.activeEvents,

      unresolvedThreads:
        context.story.unresolvedThreads,

      unansweredQuestions:
        context.story.unansweredQuestions,

      activeCharacters:

        context.characters.map(
          character => character.name,
        ),

      deadCharacters:

        context.campaignState.deadCharacters,

      focusedCharacter:
        context.story.focusedCharacter,

      activeObjectives:
        context.story.activeObjectives,

      activeQuests:
        context.story.activeQuests,

      tensionLevel,

    }

  }

}