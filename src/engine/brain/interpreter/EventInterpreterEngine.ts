import type {
  BrainResult,
} from "../types/BrainResult"

import type {
  StoryEvent,
} from "../../assistant/state/events/StoryEvent"

export class EventInterpreterEngine {

  static interpret(
    brain: BrainResult,
  ): StoryEvent[] {

    const events: StoryEvent[] = []

    // ======================================
    // Ação principal
    // ======================================

    events.push({

      type:
        brain.decision.action as StoryEvent["type"],

      actor:
        brain.character.id,

      description:
        brain.decision.action,

    })

    // ======================================
    // Emoção dominante
    // ======================================

    const dominantEmotion =
      Object.entries(
        brain.emotion,
      ).sort(
        (a, b) =>
          b[1] - a[1],
      )[0]?.[0]

    if (
      dominantEmotion
    ) {

      events.push({

        type:
          "emotion",

        actor:
          brain.character.id,

        emotion:
          dominantEmotion,

        description:
          dominantEmotion,

      })

    }

    // ======================================
    // Objetivo
    // ======================================

    if (
      brain.goal
    ) {

      events.push({

        type:
          "quest",

        actor:
          brain.character.id,

        description:
          brain.goal.title,

      })

    }

    return events

  }

}