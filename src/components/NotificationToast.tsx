import { useNotifications } from "../contexts/useNotifications"
import { useEffect, useState } from "react"

export default function NotificationToast() {
  const { notifications } = useNotifications()

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

  return (
    <div className="fixed bottom-5 right-5 bg-[#2a2a2a] text-white px-4 py-3 rounded shadow-lg">
      🔔 {current.message}
    </div>
  )
}
