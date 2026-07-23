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

      activeQuests: [
        ...state.activeQuests,
      ],

      discoveredLocations: [
        ...state.discoveredLocations,
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
            event.description,
          )

          if (
            event.actorId !== undefined
          ) {

            const characterId =
              String(
                event.actorId,
              )

            next.aliveCharacters =
              next.aliveCharacters.filter(
                name =>
                  name !== characterId,
              )

            if (
              !next.deadCharacters.includes(
                characterId,
              )
            ) {

              next.deadCharacters.push(
                characterId,
              )

            }

          }

          break

        case "movement":

          this.addEvent(
            next,
            event.description,
          )

          if (
            event.location &&
            !next.discoveredLocations.includes(
              event.location,
            )
          ) {

            next.discoveredLocations.push(
              event.location,
            )

          }

          break

        case "dialogue":

          this.addEvent(
            next,
            event.description,
          )

          break

        case "quest":

          this.addEvent(
            next,
            event.description,
          )

          if (
            !next.activeQuests.includes(
              event.description,
            )
          ) {

            next.activeQuests.push(
              event.description,
            )

          }

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

      description.trim() !== "" &&

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