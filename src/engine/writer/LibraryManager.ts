import type { NarrativeEvent } from "./planner/NarrativeEvent"
import type { NarrativeFragment } from "./planner/NarrativeFragment"

import { ActionLibrary } from "./libraries/ActionLibrary"
import { ConnectorLibrary } from "./libraries/ConnectorLibrary"
import { DialogueLibrary } from "./libraries/DialogueLibrary"
import { EmotionLibrary } from "./libraries/EmotionLibrary"
import { EndingLibrary } from "./libraries/EndingLibrary"


export class LibraryManager {


  static compose(
    events: NarrativeEvent[],
  ): NarrativeFragment[] {


    const fragments: NarrativeFragment[] = []


    for (const event of events) {


      switch(event.type) {


        case "observation":

          fragments.push({

            type: "observation",

            text:
              ConnectorLibrary.randomObservation(),

          })

          break



        case "emotion":

          fragments.push({

            type: "emotion",

            text:
              EmotionLibrary.random(
                String(event.payload),
              ),

          })

          break



        case "action":

          fragments.push({

            type: "action",

            text:
              ActionLibrary.random(
                String(event.payload),
              ),

          })

          break



        case "dialogue":

          fragments.push({

            type: "dialogue",

            text:
              DialogueLibrary.random(
                String(event.payload),
              ),

          })

          break



        case "ending":

          fragments.push({

            type: "ending",

            text:
              EndingLibrary.random(),

          })

          break

      }

    }


    return fragments

  }

}