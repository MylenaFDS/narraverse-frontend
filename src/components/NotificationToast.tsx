import { useNotifications } from "../contexts/useNotifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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

  if (!current) return null

  function handleClick() {
    if (current.meta?.rpg_id && current.meta?.turn_id) {
      navigate(`/rpg/${current.meta.rpg_id}?turn=${current.meta.turn_id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-5 right-5 bg-[#2a2a2a] text-white px-4 py-3 rounded shadow-lg cursor-pointer hover:bg-[#3a3a3a]"
    >
      🔔 {current.message}
    </div>
  )
}