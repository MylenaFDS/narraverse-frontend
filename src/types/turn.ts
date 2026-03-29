export interface RPGTurn {
  id: number
  content: string
  user_id: number
  created_at: string
  reply_to_turn_id?: number | null
  mentioned_participants?: number[]
}
