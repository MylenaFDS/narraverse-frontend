import type {
  RPGTurn,
} from "../../../../types/turn"


import type {
  StoryEvent,
} from "./StoryEvent"


import { CombatInterpreter } from "./interpreters/CombatInterpreter"
import { DialogueInterpreter } from "./interpreters/DialogueInterpreter"
import { MovementInterpreter } from "./interpreters/MovementInterpreter"
import { LoreInterpreter } from "./interpreters/LoreInterpreter"
import { RelationshipInterpreter } from "./interpreters/RelationshipInterpreter"
import { QuestInterpreter } from "./interpreters/QuestInterpreter"
import { DeathInterpreter } from "./interpreters/DeathInterpreter"



export class EventInterpreterEngine {


  static interpret(
    turn:RPGTurn,
  ):StoryEvent[] {


    console.log(
      "INTERPRETING:",
      turn.content,
    )


    const interpreters = [

      DeathInterpreter,

      CombatInterpreter,

      RelationshipInterpreter,

      DialogueInterpreter,

      LoreInterpreter,

      MovementInterpreter,

      QuestInterpreter,

    ]



    const events:StoryEvent[] = []



    for(
      const interpreter of interpreters
    ){


      const result =
        interpreter.interpret(
          turn,
        )


      events.push(
        ...result,
      )

    }



    const unique =
      this.removeDuplicates(
        events,
      )



    console.log(
      "EVENTS GENERATED:",
      unique,
    )


    return unique

  }





  private static removeDuplicates(
    events:StoryEvent[],
  ){


    const map =
      new Map<string,StoryEvent>()



    for(
      const event of events
    ){


      const key =
        `${event.type}-${event.description}-${event.turnId}`



      map.set(
        key,
        event,
      )

    }



    return [
      ...map.values(),
    ]

  }


}