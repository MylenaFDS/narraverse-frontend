import type {
  DiceOutcome,
} from "../engine/dice/DiceTypes"


export interface TurnDice {

  expression: string

  rolls: number[]

  modifier: number

  total: number

  difficulty: number

  success: boolean

  outcome: DiceOutcome

  margin: number

}


export interface RPGTurn {

  id: number

  content: string

  user_id: number

  created_at: string

  reply_to_turn_id?: number | null

  mentioned_participants?: number[]

  mentioned_characters?: number[]

  character_id?: number | null

  dice?: TurnDice | null

  user?: {

    id: number

    username: string

  }

}