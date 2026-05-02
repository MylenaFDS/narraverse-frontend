import { useEffect, useRef, useCallback, type ReactNode } from "react"
import Navbar from "./Navbar"
import { Link } from "react-router-dom"
import NotificationToast from "./NotificationToast"
import { useNotifications } from "../contexts/useNotifications"

export default function Layout({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications()

  const wsRef = useRef<WebSocket | null>(null)
  const hasConnected = useRef(false)

  const connectWSRef = useRef<() => void>(() => {})

  const connectWS = useCallback(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const ws = new WebSocket(
      `ws://127.0.0.1:8001/ws/notifications?token=${token}`
    )

    wsRef.current = ws

    ws.onopen = () => {
      console.log("🔔 WS NOTIFICATIONS conectado")
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.type === "notification") {
          addNotification(msg.message, {
            meta: {
              turn_id: msg.turn_id,
              rpg_id: msg.rpg_id,
              isNew: true,
            },
          })
        }
      } catch (err) {
        console.error("Erro ao processar notificação:", err)
      }
    }

    ws.onerror = () => {
      console.log("⚠️ WS erro")
      ws.close()
    }

    ws.onclose = () => {
      console.log("❌ WS caiu — reconectando em 3s...")
      setTimeout(() => {
        connectWSRef.current()
      }, 3000)
    }
  }, [addNotification])

  // ✅ AGORA CORRETO
  useEffect(() => {
    connectWSRef.current = connectWS
  }, [connectWS])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (hasConnected.current) return
    hasConnected.current = true

    connectWS()

    return () => {
      wsRef.current?.close()
      hasConnected.current = false
    }
  }, [connectWS])

  return (
    <div className="min-h-screen bg-[#1a0f12] text-[#f5e9e2]">
      <header className="border-b border-[#3a1f24] bg-[#2a1519] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-display text-[#e0a96d]">
          <Link to="/home">
            <h1>Narraverse</h1>
          </Link>
        </h1>

        <Navbar />
        <NotificationToast />
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  )
}