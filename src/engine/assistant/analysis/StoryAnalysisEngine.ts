import type {
  AssistantContext,
} from "../AssistantContext"

import type {
  StoryAnalysis,
} from "./StoryAnalysis"

import type {
  StoryEvent,
} from "../state/events/StoryEvent"

export class StoryAnalysisEngine {

  static analyze(
    context: AssistantContext,
  ): StoryAnalysis {

    const events: StoryEvent[] =
      context.campaignState.history
        ?.slice(-20)
      ?? []

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

      narrativeTension:
        context.story.narrativeTension ?? 0,

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
      // Eventos
      // ======================================

      events,

      // ======================================
      // Estatísticas narrativas
      // ======================================

      eventCount:
        events.length,

      importantEventCount:
        events.filter(
          event =>
            event.type === "death"
            ||
            event.type === "prophecy"
            ||
            event.type === "discovery"
            ||
            event.type === "relationship",
        ).length,

      hasDeaths:
        events.some(
          event =>
            event.type === "death",
        ),

      hasDialogue:
        events.some(
          event =>
            event.type === "dialogue",
        ),

      hasCombat:
        events.some(
          event =>
            event.type === "combat"
            ||
            event.type === "attack",
        ),

      hasRelationships:
        events.some(
          event =>
            event.type === "relationship",
        ),

      hasRevelations:
        events.some(
          event =>
            event.type === "prophecy"
            ||
            event.type === "discovery",
        ),

        

    }

  }

}