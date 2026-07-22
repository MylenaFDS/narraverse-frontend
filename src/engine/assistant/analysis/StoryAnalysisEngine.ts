import type { AssistantContext } from "../AssistantContext"

export interface StoryAnalysis {

  activeConflicts: string[]

  currentSituation: string

  activeCharacters: string[]

  deadCharacters: string[]

  recentEvents: string[]

  unresolvedThreads: string[]

}

export class StoryAnalysisEngine {

  static analyze(
    context: AssistantContext,
  ): StoryAnalysis {

    return {

      // Eventos ainda em andamento

      activeConflicts:
        context.story.activeEvents,

      // Situação atual da campanha

      currentSituation:
        context.story.currentSituation,

      // Personagens presentes

      activeCharacters:

        context.characters.map(
          character =>
            character.name,
        ),

      // Ainda será alimentado pelo CampaignStateEngine

      deadCharacters: [],

      // Últimos acontecimentos

      recentEvents:
        context.story.recentTurns,

      // Pontas soltas da narrativa

      unresolvedThreads:
        context.story.unresolvedThreads,

    }

  }

}