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

      recentTurns:

        turns
          .slice(-5)
          .map(turn => turn.content),

      lastActions: [],

      lastDialogues: [],

      activeEvents:
        [...campaign.activeEvents],

      unresolvedThreads: [],

      currentSituation:

        campaign.activeEvents.length > 0

          ? campaign.activeEvents.join(", ")

          : "Nenhum evento importante.",

      recentFacts: [],

      mentionedCharacters:

        characters.map(
          character => character.name,
        ),

      topics: [],

      sceneMood: "neutral",

      unansweredQuestions: [],

      lastDialogue: undefined,

    }

  }

}