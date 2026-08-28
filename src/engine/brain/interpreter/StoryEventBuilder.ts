import type { BrainResult } from "../types/BrainResult"
import type { StoryEvent } from "../../assistant/state/events/StoryEvent"

export class StoryEventBuilder {

  static build(
    brain: BrainResult,
  ): StoryEvent[] {

    const events: StoryEvent[] = []

    events.push({

      type:
        brain.decision.action as StoryEvent["type"],

      actorId:
        brain.character.id,

      description:
        brain.decision.reason,

    })

    return events

  }

}