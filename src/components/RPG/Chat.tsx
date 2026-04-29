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

  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const typingTimeoutRef = useRef<number | null>(null)
  const typingRef = useRef(false)

  const myUserId = Number(localStorage.getItem("user_id"))

  // ===============================
  // FETCH INICIAL
  // ===============================
  useEffect(() => {
    fetch(`http://localhost:8000/rpg-chat/${rpgId}`)
      .then((res) => res.json())
      .then((data: Message[]) => {
        setMessages(data)

        // scroll inicial
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView()
        }, 50)
      })
  }, [rpgId])

  // ===============================
  // SCROLL HELPER
  // ===============================
  function isNearBottom() {
    const el = containerRef.current
    if (!el) return true

    return el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  // ===============================
  // WEBSOCKET
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
          const shouldScroll = isNearBottom()

          setMessages((prev) => {
            const map = new Map(prev.map((m) => [m.id, m]))
            map.set(data.data.id, data.data)
            return Array.from(map.values())
          })

          // scroll só se estiver no fim
          if (shouldScroll) {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }, 50)
          }
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
  // DIGITANDO
  // ===============================
  function handleTyping() {
    if (!wsRef.current) return

    if (!typingRef.current) {
      wsRef.current.send(JSON.stringify({ type: "typing_start" }))
      typingRef.current = true
    }

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
    <div className="rpg-panel flex flex-col h-[500px] bg-gradient-to-b from-[#1a0f12] to-[#0f0709]">

      {/* HEADER */}
      <div className="border-b border-[#3a1f24] pb-2 mb-2">
        <h2 className="text-xl font-display text-[#e0a96d]">
          Chat do RPG
        </h2>
      </div>

      {/* MENSAGENS */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
      >
        {messages.map((msg, index) => {
          const prev = messages[index - 1]
          const sameUser = isSameUser(prev || null, msg)
          const isMe = msg.user_id === myUserId

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!sameUser && !isMe && (
                <div className="w-8 h-8 rounded-full bg-yellow-600 text-black flex items-center justify-center text-xs font-bold">
                  {getInitials(msg.username)}
                </div>
              )}

              <div className="flex flex-col">

                {!sameUser && !isMe && (
                  <div className="text-sm text-yellow-500 font-semibold">
                    {msg.username || "Usuário"}
                  </div>
                )}

                <div
                  className={`
                    px-3 py-2 rounded-lg text-sm max-w-[70%]
                    ${isMe
                      ? "bg-yellow-600 text-black rounded-br-none"
                      : "bg-[#2a1519] border border-[#3a1f24] rounded-bl-none"
                    }
                  `}
                >
                  {msg.content}
                </div>

                <div className="text-[10px] text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* DIGITANDO */}
      {typingUsers.length > 0 && (
        <div className="text-xs text-yellow-500 italic mt-1 animate-pulse">
          {typingUsers.length === 1
            ? `${typingUsers[0]} está digitando...`
            : `${typingUsers.join(", ")} estão digitando...`}
        </div>
      )}

      {/* INPUT */}
      <div className="mt-3 flex gap-2 items-end">
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
          className="
            flex-1 resize-none
            bg-[#1a0f12]
            border border-[#3a1f24]
            rounded-xl px-4 py-2
            focus:outline-none focus:border-yellow-600
          "
          placeholder="Digite uma mensagem..."
        />

        <button
          onClick={sendMessage}
          className="
            bg-yellow-600 hover:bg-yellow-500
            text-black font-bold
            px-4 py-2 rounded-xl
            transition
          "
        >
          ➤
        </button>
      </div>
    </div>
  )
}