import type { CampaignState } from "../state/CampaignState"

import type {
  StoryContext,
} from "../../writer/story/types/StoryContext"


export class StoryContextAdapter {


  // ==========================================================
  // CONVERTER CAMPAIGN STATE
  // ==========================================================

  static toStoryContext(
    state: CampaignState,
  ): StoryContext {

    const history =
      state.history ?? []


    const activeEvents =
      state.activeEvents ?? []


    const aliveCharacters =
      state.aliveCharacters ?? []


    const deadCharacters =
      state.deadCharacters ?? []


    // ========================================================
    // ÚLTIMOS EVENTOS
    // ========================================================

    const recentHistory =
      history.slice(-10)


    // ========================================================
    // AÇÕES
    // ========================================================

    const lastActions =
      recentHistory
        .filter(
          event =>
            event.type === "attack" ||
            event.type === "movement",
        )
        .map(
          event =>
            event.description,
        )


    // ========================================================
    // DIÁLOGOS
    // ========================================================

    const lastDialogues =
      recentHistory
        .filter(
          event =>
            event.type === "dialogue",
        )
        .map(
          event =>
            event.description,
        )


    // ========================================================
    // FATOS RECENTES
    // ========================================================

    const recentFacts =
      recentHistory.map(
        event =>
          event.description,
      )


    // ========================================================
    // PERSONAGENS MENCIONADOS
    // ========================================================

    const mentionedCharacters =
      [
        ...aliveCharacters,
        ...deadCharacters,
      ]


    // ========================================================
    // SITUAÇÃO ATUAL
    // ========================================================

    const currentSituation =
      activeEvents.length > 0
        ? activeEvents.join(". ")
        : "Nenhum evento importante está acontecendo no momento."


    // ========================================================
    // CONTEXTO
    // ========================================================

    return {

      // ======================================
      // Histórico
      // ======================================

      recentTurns: [],

      recentFacts,

      lastActions,

      lastDialogues,


      // ======================================
      // Continuidade
      // ======================================

      previousSummary:
        undefined,

      previousScene:
        undefined,

      previousLocation:
        undefined,

      previousMood:
        undefined,


      // ======================================
      // Estado atual
      // ======================================

      currentSituation,

      currentLocation:
        undefined,

      sceneMood:
        "unknown",

      activeEvents,


      // ======================================
      // Estrutura narrativa
      // ======================================

      storyArc:
        undefined,

      chapter:
        undefined,

      sceneNumber:
        undefined,

      storyPhase:
        undefined,

      storyTempo:
        undefined,


      // ======================================
      // Dramaturgia
      // ======================================

      narrativeTension:
        0,

      dominantEmotion:
        undefined,

      dramaticQuestion:
        undefined,

      expectedClimax:
        undefined,

      lastMajorEvent:
        recentFacts[
          recentFacts.length - 1
        ],

      lastTurningPoint:
        undefined,

      currentConflict:
        undefined,

      currentGoal:
        undefined,

      currentMystery:
        undefined,

      recentConsequences: [],


      // ======================================
      // Continuidade
      // ======================================

      unresolvedThreads: [],

      unansweredQuestions: [],

      topics:
        activeEvents,


      // ======================================
      // Personagens
      // ======================================

      mentionedCharacters,

      focusedCharacter:
        undefined,

      lastDialogue:
        lastDialogues[
          lastDialogues.length - 1
        ],


      // ======================================
      // Mundo
      // ======================================

      discoveredLocations: [],

      discoveredFactions: [],

      discoveredItems: [],


      // ======================================
      // Objetivos
      // ======================================

      activeObjectives: [],

      activeQuests: [],

      completedObjectives: [],

      completedQuests: [],


      // ======================================
      // Resumo dinâmico
      // ======================================

      keywords: [],

      themes: [],

      narrativeHooks: [],

    }

  }

}