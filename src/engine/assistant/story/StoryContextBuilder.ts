import type { Character } from "../../../types/character"
import type { RPGTurn } from "../../../types/turn"

import type { CampaignState } from "../state/CampaignState"

import type { StoryContext } from "../../writer/story/types/StoryContext"

export class StoryContextBuilder {

  static build(

    campaign: CampaignState,

    turns: RPGTurn[],

    characters: Character[],

  ): StoryContext {

    return {

      // ======================================
      // Histórico
      // ======================================

      recentTurns:

        turns
          .slice(-5)
          .map(
            turn => turn.content,
          ),

      recentFacts: [],

      lastActions: [],

      lastDialogues: [],

      // ======================================
      // Situação atual
      // ======================================

      currentSituation:

        campaign.activeEvents.length > 0

          ? campaign.activeEvents.join(", ")

          : "Nenhum evento importante.",

      currentLocation: undefined,

      sceneMood: "neutral",

      activeEvents: [
        ...campaign.activeEvents,
      ],

      // ======================================
      // Narrativa
      // ======================================

      unresolvedThreads: [],

      unansweredQuestions: [],

      topics: [],

      // ======================================
      // Personagens
      // ======================================

      mentionedCharacters:

        characters.map(
          character => character.name,
        ),

      focusedCharacter: undefined,

      lastDialogue: undefined,

      // ======================================
      // Objetivos
      // ======================================

      activeObjectives: [],

      discoveredLocations: [],

      activeQuests: [],

    }

  }

}