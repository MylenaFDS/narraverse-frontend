import { useContext } from "react"
import { NotificationContext } from "./NotificationContext"

export function useNotifications() {
  const ctx = useContext(NotificationContext)

  if (!ctx) {
    throw new Error("useNotifications fora do provider")
  }

  return ctx
}
