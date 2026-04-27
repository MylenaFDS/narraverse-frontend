import { useState, useEffect } from "react"
import { NotificationContext, type Notification } from "./NotificationContext"

const STORAGE_KEY = "notifications"

function normalizeNotification(n: unknown): Notification {
  const obj = typeof n === "object" && n !== null
    ? (n as Record<string, unknown>)
    : {}

  const meta =
    typeof obj.meta === "object" && obj.meta !== null
      ? (obj.meta as Record<string, unknown>)
      : {}

  return {
    id: typeof obj.id === "number" ? obj.id : Date.now(),
    message: typeof obj.message === "string" ? obj.message : "",
    read: typeof obj.read === "boolean" ? obj.read : false,
    meta: {
      turn_id: typeof meta.turn_id === "number" ? meta.turn_id : undefined,
      rpg_id: typeof meta.rpg_id === "number" ? meta.rpg_id : undefined,
      isNew: typeof meta.isNew === "boolean" ? meta.isNew : false,
    },
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const parsed: unknown = JSON.parse(stored)

      if (!Array.isArray(parsed)) return []

      return parsed.map(normalizeNotification)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

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
    setNotifications((prev) => {
      const alreadyExists = prev.some(
        (n) =>
          n.message === message &&
          n.meta?.turn_id === data?.meta?.turn_id
      )

      if (alreadyExists) return prev

      return [
        {
          id: Date.now(),
          message,
          read: false,
          meta: data?.meta ?? {},
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

  // 🔥 NOVO: usado pelo Toast
  function markAsNotNew(id: number) {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              meta: { ...n.meta, isNew: false },
            }
          : n
      )
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        markAsNotNew, // 👈 importante
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}