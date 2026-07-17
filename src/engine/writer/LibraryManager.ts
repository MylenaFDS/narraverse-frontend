import type { NarrativeEvent } from "./planner/NarrativeEvent"

import { ActionLibrary } from "./libraries/ActionLibrary"
import { ConnectorLibrary } from "./libraries/ConnectorLibrary"
import { DialogueLibrary } from "./libraries/DialogueLibrary"
import { EmotionLibrary } from "./libraries/EmotionLibrary"
import { EndingLibrary } from "./libraries/EndingLibrary"

export class LibraryManager {

  static compose(
    events: NarrativeEvent[],
  ): string[] {

    const fragments: string[] = []

    for (const event of events) {

      switch (event.type) {

        case "observation": {

          fragments.push(
            ConnectorLibrary.randomObservation(),
          )

          break

        }

        case "emotion": {

          fragments.push(
            EmotionLibrary.random(
              String(event.payload),
            ),
          )

          break

        }

        case "action": {

          fragments.push(
            ActionLibrary.random(
              String(event.payload),
            ),
          )

          break

        }

        case "dialogue": {

          fragments.push(
            DialogueLibrary.random(
              String(event.payload),
            ),
          )

          break

        }

        case "ending": {

          fragments.push(
            EndingLibrary.random(),
          )

          break

        }

        default: {

          break

        }

      }

    }

    return fragments.filter(
      Boolean,
    )

  }

}