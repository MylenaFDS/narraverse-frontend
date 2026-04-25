import { useState, useEffect } from "react"
import { NotificationContext, type Notification } from "./NotificationContext"

const STORAGE_KEY = "notifications"

export function NotificationProvider({ children }: { children: React.ReactNode }) {

  // ✅ inicialização correta (sem efeito)
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // ===============================
  // SALVAR QUANDO MUDAR
  // ===============================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // ===============================
  // AÇÕES
  // ===============================
  function addNotification(message: string) {
    setNotifications((prev) => {
      // evita duplicadas

      return [
        {
          id: Date.now(),
          message,
          read: false,
        },
        ...prev,
      ]
    })
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