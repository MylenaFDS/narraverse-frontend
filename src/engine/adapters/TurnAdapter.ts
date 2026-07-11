import type { RPGTurn } from "../../types/turn"
import type { CurrentTurn } from "../brain/types/CurrentTurn"

export class TurnAdapter {

  static toCurrent(
    turn: RPGTurn,
  ): CurrentTurn {

    return {

      id: turn.id,

      summary:
        turn.content,

      participants:
        turn.character_id
          ? [turn.character_id]
          : [],

    }

  }
  
  static toAI(
  turns: RPGTurn[],
): CurrentTurn[] {
  return turns.map((turn) =>
    this.toCurrent(turn),
  )
}
}