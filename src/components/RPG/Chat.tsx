import { useEffect, useRef, useState } from "react"

type Message = {
  id: number
  content: string
  user_id: number
  username?: string
  created_at: string
}

type Props = {
  rpgId: number
}

export default function Chat({ rpgId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ===============================
  // FETCH INICIAL
  // ===============================
  useEffect(() => {
    fetch(`http://localhost:8000/rpg-chat/${rpgId}`)
      .then((res) => res.json())
      .then((data: Message[]) => {
        setMessages(data)
      })
  }, [rpgId])

  // ===============================
  // WEBSOCKET COM RECONEXÃO
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    let isMounted = true

    function connect() {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/rpg/${rpgId}/chat?token=${token}`
      )

      wsRef.current = ws

      ws.onopen = () => {
        console.log("💬 WS chat conectado")
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === "message") {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === data.data.id)
            if (exists) return prev
            return [...prev, data.data]
          })
        }

        else if (data.type === "typing_start") {
  setTypingUsers((prev) => {
    if (prev.includes(data.username)) return prev
    return [...prev, data.username]
  })
}

else if (data.type === "typing_stop") {
  setTypingUsers((prev) =>
    prev.filter((u) => u !== data.username)
  )
}
      }

      ws.onclose = () => {
        console.log("❌ WS chat desconectado")

        if (isMounted) {
          reconnectTimeout.current = window.setTimeout(connect, 2000)
        }
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      isMounted = false
      wsRef.current?.close()

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [rpgId])

  // ===============================
  // SCROLL AUTOMÁTICO
  // ===============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ===============================
  // ENVIAR MENSAGEM
  // ===============================
  async function sendMessage() {
    if (!input.trim()) return

    const token = localStorage.getItem("token")

    await fetch(`http://localhost:8000/rpg-chat/${rpgId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: input }),
    })

    setInput("")
  }

  // ===============================
  // DIGITANDO (OTIMIZADO)
  // ===============================
  const typingTimeoutRef = useRef<number | null>(null)
  const typingRef = useRef(false)
  

  function handleTyping() {
  if (!wsRef.current) return

  // já está digitando → não envia de novo
  if (!typingRef.current) {
    wsRef.current.send(JSON.stringify({ type: "typing_start" }))
    typingRef.current = true
  }

  // reset timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current)
  }

  typingTimeoutRef.current = window.setTimeout(() => {
    wsRef.current?.send(JSON.stringify({ type: "typing_stop" }))
    typingRef.current = false
  }, 1500)
}

  // ===============================
  // UTILS
  // ===============================
  function isSameUser(prev: Message | null, current: Message) {
    return prev?.user_id === current.user_id
  }

  function getInitials(name?: string) {
    if (!name) return "??"

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="rpg-panel flex flex-col h-[500px]">

      {/* HEADER */}
      <div className="border-b border-[#3a1f24] pb-2 mb-2">
        <h2 className="text-xl font-display text-[#e0a96d]">
          Chat do RPG
        </h2>
      </div>

      {/* MENSAGENS */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, index) => {
          const prev = messages[index - 1]
          const sameUser = isSameUser(prev || null, msg)

          return (
            <div key={msg.id} className="flex gap-2">

              {/* AVATAR */}
              {!sameUser && (
                <div className="
                  w-8 h-8 rounded-full
                  bg-gradient-to-br from-yellow-500 to-yellow-700
                  text-black flex items-center justify-center
                  text-xs font-bold
                ">
                  {getInitials(msg.username)}
                </div>
              )}

              <div className="flex-1">

                {/* NOME */}
                {!sameUser && (
                  <div className="text-sm text-yellow-500 font-semibold">
                    {msg.username || "Usuário"}
                  </div>
                )}

                {/* BALÃO */}
                <div className="
                  bg-[#2a1519]
                  border border-[#3a1f24]
                  px-3 py-2 rounded-lg
                  text-sm
                  w-fit max-w-[70%]
                ">
                  {msg.content}
                </div>

                {/* HORA */}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* DIGITANDO */}
      {typingUsers.length > 0 && (
  <div className="text-xs text-gray-400 mt-1">
    {typingUsers.length === 1
      ? `${typingUsers[0]} está digitando...`
      : `${typingUsers.join(", ")} estão digitando...`}
  </div>
)}

      {/* INPUT */}
      <div className="mt-2 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            handleTyping()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          className="rpg-input flex-1 resize-none"
          placeholder="Digite uma mensagem..."
        />

        <button onClick={sendMessage} className="rpg-btn">
          Enviar
        </button>
      </div>
    </div>
  )
}