import { useState } from "react"
import { NotificationContext, type Notification } from "./NotificationContext"

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function addNotification(message: string) {
    setNotifications((prev) => [
      { id: Date.now(), message, read: false },
      ...prev,
    ])
  }

  function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
