import { useState, useEffect } from "react"
import { NotificationContext, type Notification } from "./NotificationContext"

const STORAGE_KEY = "notifications"

export function NotificationProvider({ children }: { children: React.ReactNode }) {

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // ✅ AGORA COMPATÍVEL COM ContextType
  function addNotification(
    message: string,
    data?: {
      meta?: {
        turn_id?: number
        rpg_id?: number
        isNew?: boolean
      }
    }
  ) {
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        read: false,
        meta: data?.meta, // 🔥 aqui é o ponto importante
      },
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
      value={{
        notifications,
        addNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}