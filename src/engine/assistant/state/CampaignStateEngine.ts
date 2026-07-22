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

    const next: CampaignState = {

      ...state,

      turn:
        state.turn + 1,

      activeEvents: [
        ...state.activeEvents,
      ],

      history: [
        ...state.history,
      ],

      aliveCharacters: [
        ...state.aliveCharacters,
      ],

      deadCharacters: [
        ...state.deadCharacters,
      ],

    }

    for (
      const event of events
    ) {

      next.history.push(
        event,
      )

      switch (
        event.type
      ) {

        case "attack":

          this.addEvent(
            next,
            "Combate em andamento",
          )

          break

        case "death":

          this.addEvent(
            next,
            "Uma morte ocorreu",
          )

          if (
            event.character
          ) {

            next.aliveCharacters =
              next.aliveCharacters.filter(
                name =>
                  name !== event.character,
              )

            if (
              !next.deadCharacters.includes(
                event.character,
              )
            ) {

              next.deadCharacters.push(
                event.character,
              )

            }

          }

          break

        case "movement":

          this.addEvent(
            next,
            "Personagem mudou de local",
          )

          break

        case "dialogue":

          this.addEvent(
            next,
            "Diálogo importante",
          )

          break

        case "quest":

          this.addEvent(
            next,
            event.description,
          )

          break

      }

    }

    return next

  }

  private static addEvent(

    state: CampaignState,

    description: string,

  ): void {

    if (

      !state.activeEvents.includes(
        description,
      )

    ) {

      state.activeEvents.push(
        description,
      )

    }

  }

}