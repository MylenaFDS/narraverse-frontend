import { useEffect, useRef, useState } from "react"

type Message = {
  id: number
  content: string
  user_id: number
  username?: string
  created_at: string
}

export default function Chat({ rpgId }: { rpgId: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const typingTimeout = useRef<number | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const myUserId = Number(localStorage.getItem("user_id"))

  // ===============================
  // LOAD
  // ===============================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://127.0.0.1:8001/rpg-chat/${rpgId}`)
        const data = await res.json()

        if (Array.isArray(data)) {
          setMessages(data)
        } else {
          console.error("Erro: resposta não é array", data)
          setMessages([])
        }
      } catch (err) {
        console.error("Erro ao carregar chat:", err)
      }
    }

    load()
  }, [rpgId])

  // ===============================
  // WS
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const ws = new WebSocket(
      `ws://127.0.0.1:8001/ws/rpg/${rpgId}/chat?token=${token}`
    )

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "message") {
  setMessages(prev => [...prev, data.data])
}

else if (data.type === "delete") {
  setMessages(prev =>
    prev.filter(
      m => m.id !== data.message_id
    )
  )
}

else if (data.type === "edit") {
  setMessages(prev =>
    prev.map(m =>
      m.id === data.data.id
        ? {
            ...m,
            content:
              data.data.content
          }
        : m
    )
  )
}

else if (
  data.type === "typing_start"
) {
  setTypingUsers((prev) => {
    if (
      prev.includes(
        data.username
      )
    ) {
      return prev
    }

    return [
      ...prev,
      data.username,
    ]
  })
}

else if (
  data.type === "typing_stop"
) {
  setTypingUsers((prev) =>
    prev.filter(
      (u) =>
        u !== data.username
    )
  )
}
      } catch (err) {
        console.error("Erro WS:", err)
      }
    }

    ws.onerror = (err) => {
      console.error("🔥 WS chat erro:", err)
    }

    ws.onclose = (event) => {
      console.log(
  "🔌 WS chat fechado",
  event.code
)
    }

    wsRef.current = ws
    return () => {
  ws.close()

  if (typingTimeout.current) {
    clearTimeout(
      typingTimeout.current
    )
  }
}
  }, [rpgId])

  // ===============================
  // SEND
  // ===============================
  async function sendMessage() {
    if (!input.trim()) return

    const token = localStorage.getItem("token")

    try {
      if (editingMessage) {
        await fetch(`http://127.0.0.1:8001/rpg-chat/${editingMessage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: input }),
        })

        setEditingMessage(null)
      } else {
        await fetch(`http://127.0.0.1:8001/rpg-chat/${rpgId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: input }),
        })
      }

      setInput("")
      inputRef.current?.focus()
    } catch (err) {
      console.error("Erro ao enviar:", err)
    }
  }

  async function deleteMessage(id: number) {
    const token = localStorage.getItem("token")

    try {
      await fetch(`http://127.0.0.1:8001/rpg-chat/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      console.error("Erro ao deletar:", err)
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-transparent rounded-xl border border-yellow-900/30">

      <div className="border-b border-transparent text-xl p-2 flex gap-3 mt-4 font-display text-[#e0a96d]">
        Chat do RPG
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.user_id === myUserId

          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? "justify-end" : ""}`}>
              <div>
                <div className="text-xs text-yellow-500">
                  {msg.username}
                </div>

                <div className="bg-[#2a1519] px-3 py-2 rounded-lg">
                  {msg.content}
                </div>

                {isMe && (
                  <div className="flex gap-2 text-[10px] text-gray-400 mt-1">
                    <button onClick={() => {
                      setEditingMessage(msg)
                      setInput(msg.content)
                    }}>
                      editar
                    </button>

                    <button onClick={() => deleteMessage(msg.id)}>
                      excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
        {typingUsers.length > 0 && (
  <div
    className="
      text-sm
      italic
      text-gray-400
      px-3
      pb-1
      animate-pulse
    "
  >
    {typingUsers.length === 1
  ? `${typingUsers[0]} está digitando...`
  : `${typingUsers.join(", ")} estão digitando...`
}
  </div>
)}
      <div className="flex p-2 gap-2">
        <textarea
          ref={inputRef}
          value={input}
 onChange={(e) => {
  let value = e.target.value

  const LIMIT = 40
  const lines =
    value.split("\n")

  const last =
    lines[lines.length - 1]

  if (last.length >= LIMIT) {
    value += "\n"
  }

  setInput(value)

  // 🔥 typing start
  if (
  wsRef.current?.readyState ===
  WebSocket.OPEN
) {
  wsRef.current.send(
    JSON.stringify({
      type: "typing_start",
    })
  )
}

  // 🔥 limpa timeout antigo
  if (
    typingTimeout.current
  ) {
    clearTimeout(
      typingTimeout.current
    )
  }

  // 🔥 typing stop
  typingTimeout.current =
    window.setTimeout(() => {
      if (
  wsRef.current?.readyState ===
  WebSocket.OPEN
) {
  wsRef.current.send(
    JSON.stringify({
      type: "typing_stop",
    })
  )
}
    }, 1200)
}}
          className="flex-1 bg-[#1a0f12] border p-2 rounded"
        />

        <button onClick={sendMessage}>
          {editingMessage ? "Salvar" : "➤"}
        </button>
      </div>
    </div>
  )
}