import type { CampaignState } from "../state/CampaignState"
import type { StoryContext } from "../../writer/story/types/StoryContext"

export class StoryContextAdapter {

  static toStoryContext(
    state: CampaignState,
  ): StoryContext {

    return {

      recentTurns: [],

      lastActions: [],

      lastDialogues: [],

      unresolvedThreads: [],

      currentSituation:
        state.activeEvents.join(", "),

      activeEvents:
        [...state.activeEvents],

      aliveCharacters:
        [...state.aliveCharacters],

      deadCharacters:
        [...state.deadCharacters],

      activeQuests:
        [...state.activeQuests],

      discoveredLocations:
        [...state.discoveredLocations],

    }

  }

}