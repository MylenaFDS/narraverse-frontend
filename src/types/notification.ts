export type Notification = {
  id: number
  message: string
  read: boolean
  meta?: {
    turn_id?: number
    rpg_id?: number
    isNew?: boolean
  }
}