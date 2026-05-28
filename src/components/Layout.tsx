import {
  useEffect,
  useRef,
  useCallback,
  
} from "react"
import Navbar from "./Navbar"
import { Outlet, Link } from "react-router-dom"
import NotificationToast from "./NotificationToast"
import { useNotifications } from "../contexts/useNotifications"


export default function Layout() {
  const { addNotification } =
    useNotifications()

  const wsRef =
    useRef<WebSocket | null>(null)

const handleNotification =
  useCallback(
    (
      message: string,
      meta?: {
        turn_id?: number
        chat_message_id?: number
        rpg_id?: number
        isNew?: boolean
      }
    ) => {
      addNotification(message, {
        meta,
      })
    },
    [addNotification]
  )
useEffect(() => {
  console.log("🟢 Layout montou")

  return () => {
    console.log("🔴 Layout desmontou")
  }
}, [])

 
 useEffect(() => {
  const token = localStorage.getItem("token")

  if (!token) return

  // 🚫 evita duplicar conexão
  if (
    wsRef.current &&
    (
      wsRef.current.readyState === WebSocket.OPEN ||
      wsRef.current.readyState === WebSocket.CONNECTING
    )
  ) {
    return
  }

  const ws = new WebSocket(
    `ws://127.0.0.1:8001/ws/notifications?token=${token}`
  )

  wsRef.current = ws

  ws.onopen = () => {
    console.log(
      "🔔 WS NOTIFICATIONS conectado"
    )
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(
        event.data
      )

      if (
        msg.type === "notification"
      ) {
        handleNotification(
  msg.message,
  {
    turn_id:
      msg.turn_id,
    chat_message_id:
      msg.chat_message_id,
    rpg_id:
      msg.rpg_id,
    isNew: true,
  }
)
      }
    } catch (err) {
      console.error(
        "Erro WS:",
        err
      )
    }
  }

  ws.onerror = (event) => {
    console.log(
      "⚠️ WS erro",
      event
    )
  }

  ws.onclose = (event) => {
  console.log(
    "❌ WS caiu",
    event.code,
    event.reason
  )

  wsRef.current = null

  if (
    event.code === 1008 ||
    event.code === 403
  ) {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
  }
}

  return () => {
    console.log(
      "🧹 cleanup ws"
    )

    ws.close()

    wsRef.current = null
  }
}, [handleNotification])

  return (
    <div className="min-h-screen bg-[#1a0f12] text-[#f5e9e2]">
      <header className="border-b border-[#3a1f24] bg-[#2a1519] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-display text-[#e0a96d]">
          <Link to="/search">
            <h1>
              Narraverse
            </h1>
          </Link>
        </h1>

        <Navbar />
        <NotificationToast />
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}