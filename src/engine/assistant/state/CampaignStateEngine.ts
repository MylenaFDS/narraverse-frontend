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

      history: [
        ...state.history,
      ],

      activeEvents: [
        ...state.activeEvents,
      ],

      aliveCharacters: [
        ...state.aliveCharacters,
      ],

      deadCharacters: [
        ...state.deadCharacters,
      ],

      knownCharacters: [
        ...state.knownCharacters,
      ],

      discoveredLocations: [
        ...state.discoveredLocations,
      ],

      knownLocations: [
        ...state.knownLocations,
      ],

      activeQuests: [
        ...state.activeQuests,
      ],

      completedQuests: [
        ...state.completedQuests,
      ],

      activeObjectives: [
        ...state.activeObjectives,
      ],

      recentDialogues: [
        ...state.recentDialogues,
      ],

      recentActions: [
        ...state.recentActions,
      ],

      recentFacts: [
        ...state.recentFacts,
      ],

      unresolvedThreads: [
        ...state.unresolvedThreads,
      ],

    }

    for (
      const event of events
    ) {

      next.history.push(
        event,
      )

      // =============================
      // Personagens conhecidos
      // =============================

      if (
        event.actorName &&
        !next.knownCharacters.includes(
          event.actorName,
        )
      ) {

        next.knownCharacters.push(
          event.actorName,
        )

      }

      if (
        event.targetName &&
        !next.knownCharacters.includes(
          event.targetName,
        )
      ) {

        next.knownCharacters.push(
          event.targetName,
        )

      }

      // =============================
      // Locais conhecidos
      // =============================

      if (
        event.location
      ) {

        if (
          !next.knownLocations.includes(
            event.location,
          )
        ) {

          next.knownLocations.push(
            event.location,
          )

        }

        if (
          !next.discoveredLocations.includes(
            event.location,
          )
        ) {

          next.discoveredLocations.push(
            event.location,
          )

        }

      }

      switch (
        event.type
      ) {

        case "attack":

          this.addEvent(
            next,
            event.description,
          )

          next.recentActions.push(
            event.sourceText ??
            event.description,
          )

          break

        case "defense":

          next.recentActions.push(
            event.sourceText ??
            event.description,
          )

          break

        case "movement":

          this.addEvent(
            next,
            event.description,
          )

          next.recentActions.push(
            event.sourceText ??
            event.description,
          )

          break

        case "dialogue":

          next.recentDialogues.push(
            event.sourceText ??
            event.description,
          )

          break

        case "death":

          this.addEvent(
            next,
            event.description,
          )

          next.recentFacts.push(
            event.sourceText ??
            event.description,
          )

          if (
            event.actorName
          ) {

            next.aliveCharacters =
              next.aliveCharacters.filter(
                character =>
                  character !==
                  event.actorName,
              )

            if (
              !next.deadCharacters.includes(
                event.actorName,
              )
            ) {

              next.deadCharacters.push(
                event.actorName,
              )

            }

          }

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

        case "prophecy":

  next.recentFacts.push(
    event.sourceText ??
    event.description,
  )

  break



case "promise":

  next.recentFacts.push(
    event.sourceText ??
    event.description,
  )

  break



case "alliance":

  next.recentFacts.push(
    event.sourceText ??
    event.description,
  )

  break



case "relationship":

  next.recentFacts.push(
    event.sourceText ??
    event.description,
  )

  break



case "discovery":

  next.recentFacts.push(
    event.sourceText ??
    event.description,
  )

  break

      }

    }
  next.activeEvents =
  [
    ...new Set(
      next.activeEvents,
    ),
  ]

next.recentDialogues =
  next.recentDialogues.slice(-10)

next.recentActions =
  next.recentActions.slice(-10)

next.recentFacts =
  next.recentFacts.slice(-10)

next.history =
  next.history.slice(-50)
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