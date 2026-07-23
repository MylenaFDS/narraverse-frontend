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

    const recentTurns =

      turns
        .slice(-5)

    const recentTexts =

      recentTurns.map(
        turn => turn.content,
      )

    const lastDialogues =

      recentTurns

        .filter(
          turn =>
            turn.content.includes("—") ||
            turn.content.includes("\""),
        )

        .map(
          turn => turn.content,
        )

    return {

      // ======================================
      // Histórico
      // ======================================

      recentTurns:
        recentTexts,

      recentFacts:

        campaign.history

          .slice(-10)

          .map(
            event => event.description,
          ),

      lastActions:

        campaign.history

          .slice(-10)

          .filter(
            event =>
              event.type !== "dialogue",
          )

          .map(
            event => event.description,
          ),

      lastDialogues,

      // ======================================
      // Situação atual
      // ======================================

      currentSituation:

        campaign.activeEvents.length > 0

          ? campaign.activeEvents.join(", ")

          : "Nenhum evento importante.",

      currentLocation:

        campaign.discoveredLocations.at(-1),

      sceneMood:

        campaign.activeEvents.length > 2

          ? "tense"

          : "neutral",

      activeEvents: [
        ...campaign.activeEvents,
      ],

      // ======================================
      // Narrativa
      // ======================================

      unresolvedThreads: [],

      unansweredQuestions: [],

      topics: [
        ...campaign.activeEvents,
      ],

      // ======================================
      // Personagens
      // ======================================

      mentionedCharacters:

        characters.map(
          character => character.name,
        ),

      focusedCharacter:

        characters.length > 0

          ? characters[0].name

          : undefined,

      lastDialogue:

        lastDialogues.at(-1),

      // ======================================
      // Objetivos
      // ======================================

      activeObjectives: [
        ...campaign.activeQuests,
      ],

      discoveredLocations: [
        ...campaign.discoveredLocations,
      ],

      activeQuests: [
        ...campaign.activeQuests,
      ],

    }

  }

}