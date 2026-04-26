import { useEffect, useRef, type ReactNode } from "react"
import Navbar from "./Navbar"
import { Link } from "react-router-dom"
import NotificationToast from "./NotificationToast"
import { useNotifications } from "../contexts/useNotifications"


export default function Layout({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) return
    
    if (wsRef.current) {
  wsRef.current.close()
}

    const ws = new WebSocket(
      `ws://localhost:8000/ws/notifications?token=${token}`
    )

    wsRef.current = ws
    
  
    ws.onopen = () => {
      console.log("🔔 WS NOTIFICATIONS conectado")
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.type === "notification") {

          // ✅ AGORA COM DADOS COMPLETOS
          addNotification(msg.message, {
            turn_id: msg.turn_id,
            rpg_id: msg.rpg_id,
          })
        }
      } catch (err) {
        console.error("Erro ao processar notificação:", err)
      }
    }

    ws.onerror = (err) => {
      console.error("🔥 WS notifications erro:", err)
    }

    ws.onclose = () => {
      console.log("❌ WS notifications desconectado")
    }

    return () => {
      ws.close()
    }
  }, [addNotification])

  return (
    <div className="min-h-screen bg-[#1a0f12] text-[#f5e9e2]">

      {/* HEADER */}
      <header className="border-b border-[#3a1f24] bg-[#2a1519] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-display text-[#e0a96d]">
          <Link to="/home">Narraverse</Link>
        </h1>

        <Navbar />

        {/* 🔔 Toast global */}
        <NotificationToast />
      </header>

      {/* CONTEÚDO */}
      <main className="p-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  )
}