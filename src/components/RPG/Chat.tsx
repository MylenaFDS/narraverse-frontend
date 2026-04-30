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

  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const myUserId = Number(localStorage.getItem("user_id"))

  // ===============================
  // LOAD
  // ===============================
  useEffect(() => {
    fetch(`http://localhost:8000/rpg-chat/${rpgId}`)
      .then(res => res.json())
      .then(setMessages)
  }, [rpgId])

  // ===============================
  // WS
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const ws = new WebSocket(
      `ws://localhost:8000/ws/rpg/${rpgId}/chat?token=${token}`
    )

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "message") {
        setMessages(prev => [...prev, data.data])
      }

      else if (data.type === "delete") {
        setMessages(prev => prev.filter(m => m.id !== data.message_id))
      }

      else if (data.type === "edit") {
        setMessages(prev =>
          prev.map(m =>
            m.id === data.data.id
              ? { ...m, content: data.data.content }
              : m
          )
        )
      }
    }

    wsRef.current = ws
    return () => ws.close()
  }, [rpgId])

  // ===============================
  // SEND / EDIT
  // ===============================
  async function sendMessage() {
    if (!input.trim()) return

    const token = localStorage.getItem("token")

    if (editingMessage) {
      await fetch(`http://localhost:8000/rpg-chat/${editingMessage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: input }),
      })

      setEditingMessage(null)
    } else {
      await fetch(`http://localhost:8000/rpg-chat/${rpgId}`, {
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
  }

  // ===============================
  // DELETE
  // ===============================
  async function deleteMessage(id: number) {
    const token = localStorage.getItem("token")

    await fetch(`http://localhost:8000/rpg-chat/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="flex flex-col h-[500px] bg-[#0f0709] rounded-xl border border-yellow-900/30">

      <div className="border-b border-[#3a1f24] p-2 text-yellow-500">
        Chat do RPG
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.user_id === myUserId

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMe ? "justify-end" : ""}`}
            >
              <div>
                <div className="text-xs text-yellow-500">
                  {msg.username}
                </div>

                <div className="bg-[#2a1519] px-3 py-2 rounded-lg">
                  {msg.content}
                </div>

                {isMe && (
                  <div className="flex gap-2 text-[10px] text-gray-400 mt-1">
                    <button
                      onClick={() => {
                        setEditingMessage(msg)
                        setInput(msg.content)
                      }}
                    >
                      editar
                    </button>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                    >
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

      <div className="flex p-2 gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            let value = e.target.value

            const LIMIT = 40
            const lines = value.split("\n")
            const last = lines[lines.length - 1]

            if (last.length >= LIMIT) value += "\n"

            setInput(value)
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