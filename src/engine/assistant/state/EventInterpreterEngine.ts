import type { RPGTurn } from "../../../types/turn"

import type { StoryEvent } from "./StoryEvent"

export class EventInterpreterEngine {

  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {

    const events: StoryEvent[] = []

    const text =
      turn.content.toLowerCase()

    if (
      text.includes("ataque")
      ||
      text.includes("atac")
    ) {

      events.push({

        type: "attack",

        description:
          turn.content,

      })

    }

    if (
      text.includes("morreu")
      ||
      text.includes("morte")
    ) {

      events.push({

        type: "death",

        description:
          turn.content,

      })

    }

    if (
      text.includes("caminhei")
      ||
      text.includes("entrei")
      ||
      text.includes("viajei")
    ) {

      events.push({

        type: "movement",

        description:
          turn.content,

      })

    }

    if (
      turn.content.includes("—")
    ) {

      events.push({

        type: "dialogue",

        description:
          turn.content,

      })

    }

    return events

  }

}