import { useNotifications } from "../contexts/useNotifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Notification } from "../types/notification"

export default function NotificationToast() {
  const { notifications, markAsNotNew } = useNotifications()
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)

  const newNotifications = notifications.filter(n => n.meta?.isNew)
  const current = newNotifications[index]

  useEffect(() => {
    if (!current) return

    const timeout = setTimeout(() => {
      markAsNotNew(current.id) // 🔥 agora correto
      setIndex((i) => i + 1)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [current, markAsNotNew])

  function handleClick(n: Notification) {
    const rpgId = n.meta?.rpg_id
    const turnId = n.meta?.turn_id

    if (rpgId && turnId) {
      navigate(`/rpg/${rpgId}`)

      setTimeout(() => {
        window.location.hash = `turn-${turnId}`
      }, 50)
    }
  }

  if (!current) return null

  return (
    <div className="fixed bottom-5 right-5 w-80 space-y-2">
      <div
        onClick={() => handleClick(current)}
        className="bg-[#2a2a2a] text-white px-4 py-3 rounded shadow-lg cursor-pointer hover:bg-[#3a3a3a]"
      >
        🔔 {current.message}
      </div>

      <div className="bg-[#1f1f1f] rounded shadow p-2 max-h-40 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className="cursor-pointer hover:bg-[#2a2a2a] p-2 rounded text-sm"
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  )
}