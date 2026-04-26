import { useNotifications } from "../contexts/useNotifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Notification = {
  id: number
  message: string
  read: boolean
  turn_id?: number
  rpg_id?: number
}

export default function NotificationToast() {
  const { notifications } = useNotifications()
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)

  const current = notifications[index]

  useEffect(() => {
    if (!current) return

    const timeout = setTimeout(() => {
      setIndex((i) => i + 1)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [current])

  function handleClick(n: Notification) {
    if (n.rpg_id && n.turn_id) {
      navigate(`/rpg/${n.rpg_id}#turn-${n.turn_id}`)
    }
  }

  if (!current) return null

  return (
    <div className="fixed bottom-5 right-5 w-80 space-y-2">

      {/* 🔔 Toast atual */}
      <div
        onClick={() => handleClick(current)}
        className="bg-[#2a2a2a] text-white px-4 py-3 rounded shadow-lg cursor-pointer hover:bg-[#3a3a3a]"
      >
        🔔 {current.message}
      </div>

      {/* 📜 Histórico */}
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