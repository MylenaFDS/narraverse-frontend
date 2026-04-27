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
  markAsNotNew: (id: number) => void // 👈 adicionar
}

export const NotificationContext = createContext<ContextType>({
  notifications: [],
  addNotification: () => {},
  markAllAsRead: () => {},
  markAsNotNew: () => {},
})

