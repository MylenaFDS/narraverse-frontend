import { useNotifications } from "../contexts/useNotifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Notification } from "../types/notification"




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
  console.log("CLIQUEI", n)

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

      {/* 🔔 Toast atual */}
      <div
        onClick={() => handleClick(current)}
        className="bg-[#2a2a2a] text-white px-4 py-3 rounded shadow-lg cursor-pointer hover:bg-[#3a3a3a] cursor:pointer hover:opacity-90"
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