import { createContext } from "react"

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

export type ContextType = {
  notifications: Notification[]
  addNotification: (
    msg: string,
    data?: {
      meta?: {
        turn_id?: number
        rpg_id?: number
        isNew?: boolean
      }
    }
  ) => void
  markAllAsRead: () => void
}

export const NotificationContext = createContext<ContextType | null>(null)
