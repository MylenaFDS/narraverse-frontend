import { createContext } from "react"

export type Notification = {
  id: number
  message: string
  read: boolean
}

export type ContextType = {
  notifications: Notification[]
  addNotification: (msg: string) => void
  markAllAsRead: () => void
}

export const NotificationContext = createContext<ContextType | null>(null)
