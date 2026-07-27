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


      // ======================================
      // Estado atual da narrativa
      // ======================================

      activeConflicts:
        context.story.activeEvents,


      currentSituation:
        context.story.currentSituation,


      sceneMood:
        context.story.sceneMood,



      // ======================================
      // Personagens
      // ======================================

      activeCharacters:
        context.characters.map(
          character =>
            character.name,
        ),


      deadCharacters:
        context.campaignState.deadCharacters,


      focusedCharacter:
        context.story.focusedCharacter,



      // ======================================
      // Histórico recente
      // ======================================

      recentEvents:
        context.story.recentTurns,


      recentDialogue:
        context.story.lastDialogues,


      recentFacts:
        context.story.recentFacts,



      // ======================================
      // Continuidade
      // ======================================

      unresolvedThreads:
        context.story.unresolvedThreads,


      unansweredQuestions:
        context.story.unansweredQuestions,



      // ======================================
      // Cenário
      // ======================================

      currentLocation:
        context.story.currentLocation,


      discoveredLocations:
        context.story.discoveredLocations,


      topics:
        context.story.topics,



      // ======================================
      // Objetivos
      // ======================================

      activeObjectives:
        context.story.activeObjectives,


      activeQuests:
        context.story.activeQuests,



      // ======================================
      // Eventos estruturados
      // ======================================

      events:
        context.campaignState.history?.slice(-20) ?? [],


    }

  }


}