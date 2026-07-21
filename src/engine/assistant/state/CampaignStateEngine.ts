import type {
  CampaignState,
} from "./CampaignState"

import type {
  StoryEvent,
} from "./events/StoryEvent"

export class CampaignStateEngine {

  static update(

    state: CampaignState,

    events: StoryEvent[],

  ): CampaignState {

    const next = {

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
            "Combate em andamento",
          )

          break

        case "death":

          next.activeEvents.push(
            "Uma morte ocorreu",
          )

          break

        case "movement":

          next.activeEvents.push(
            "Personagem mudou de local",
          )

          break

        case "dialogue":

          next.activeEvents.push(
            "Diálogo importante",
          )

          break

        case "quest":

          next.activeEvents.push(
            event.description,
          )

          break

      }

    }

    return next

  }

}