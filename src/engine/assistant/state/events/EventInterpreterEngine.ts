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

export class EventInterpreterEngine {

  static interpret(
    turn: RPGTurn,
  ): StoryEvent[] {

    console.log(
      "INTERPRETING:",
      turn.content,
    )

    const events: StoryEvent[] = []

    events.push(
      ...CombatInterpreter.interpret(
        turn,
      ),
    )

    events.push(
      ...MovementInterpreter.interpret(
        turn,
      ),
    )

    events.push(
      ...DialogueInterpreter.interpret(
        turn,
      ),
    )

    events.push(
      ...LoreInterpreter.interpret(
        turn,
      ),
    )

    events.push(
      ...RelationshipInterpreter.interpret(
        turn,
      ),
    )

    events.push(
      ...QuestInterpreter.interpret(
        turn,
      ),
    )

    console.log(
      "EVENTS GENERATED:",
      events,
    )

    return events

  }

}