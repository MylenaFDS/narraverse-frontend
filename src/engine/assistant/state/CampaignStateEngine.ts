import type { CampaignState } from "./CampaignState"

import type { StoryEvent } from "./StoryEvent"

export class CampaignStateEngine {

  static update(

    state: CampaignState,

    events: StoryEvent[],

  ): CampaignState {

    const next: CampaignState = {

      ...state,

      turn:
        state.turn + 1,

      activeEvents: [

        ...state.activeEvents,

      ],

    }

    for (
      const event of events
    ) {

      switch (
        event.type
      ) {

        case "attack":

          next.activeEvents.push(
            "Conflito em andamento",
          )

          break

        case "death":

          next.activeEvents.push(
            "Uma morte ocorreu",
          )

          break

        case "movement":

          next.activeEvents.push(
            "Mudança de localização",
          )

          break

        case "dialogue":

          next.activeEvents.push(
            "Diálogo importante",
          )

          break

      }

    }

    return next

  }

}