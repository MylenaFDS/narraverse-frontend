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

  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<number[]>([])

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<number | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const typingTimeoutRef = useRef<number | null>(null)
  const typingRef = useRef(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const myUserId = Number(localStorage.getItem("user_id"))

  // ===============================
  // INIT
  // ===============================
  useEffect(() => {
    audioRef.current = new Audio("/notify.mp3")

    let cancelled = false

    async function fetchMessages() {
      try {
        const res = await fetch(`http://localhost:8000/rpg-chat/${rpgId}`)
        const data: Message[] = await res.json()

        if (!cancelled) {
          setMessages(data)

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView()
          }, 50)
        }
      } catch (err) {
        console.error("Erro ao carregar mensagens", err)
      }
    }

    fetchMessages()

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus()
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(focusTimeout)
    }
  }, [rpgId])

  // ===============================
  // SCROLL
  // ===============================
  function isNearBottom() {
    const el = containerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }

  function scrollToBottom(smooth = true) {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    })
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

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === "message") {
          const shouldScroll = isNearBottom()

          setMessages((prev) => {
            const map = new Map(prev.map((m) => [m.id, m]))
            map.set(data.data.id, data.data)
            return Array.from(map.values())
          })

          if (data.data.user_id !== myUserId && document.hidden) {
            audioRef.current?.play().catch(() => {})
          }

          if (!shouldScroll) {
            setHasNewMessages(true)
          } else {
            setTimeout(() => scrollToBottom(true), 50)
          }
        }

        else if (data.type === "typing_start") {
          setTypingUsers((prev) =>
            prev.includes(data.username) ? prev : [...prev, data.username]
          )
        }

        else if (data.type === "typing_stop") {
          setTypingUsers((prev) =>
            prev.filter((u) => u !== data.username)
          )
        }

        else if (data.type === "user_online") {
          setOnlineUsers((prev) => [...new Set([...prev, data.user_id])])
        }

        else if (data.type === "user_offline") {
          setOnlineUsers((prev) =>
            prev.filter((id) => id !== data.user_id)
          )
        }
      }

      ws.onclose = () => {
        if (isMounted) {
          reconnectTimeout.current = window.setTimeout(connect, 2000)
        }
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      isMounted = false
      wsRef.current?.close()
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
    }
  }, [rpgId, myUserId])

  // ===============================
  // SEND
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
      body: JSON.stringify({
        content: input,
        reply_to: replyTo?.id,
      }),
    })

    setInput("")
    setReplyTo(null)
    inputRef.current?.focus()
  }

  // ===============================
  // TYPING
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
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="relative flex flex-col h-[500px] bg-[#0f0709] rounded-xl border border-yellow-900/30">

      {/* HEADER */}
      <div className="border-b border-[#3a1f24] p-2 text-yellow-500">
        Chat do RPG
      </div>

      {/* NOVAS MENSAGENS */}
      {hasNewMessages && (
        <button
          onClick={() => {
            scrollToBottom()
            setHasNewMessages(false)
          }}
          className="absolute bottom-24 right-4 bg-yellow-600 px-3 py-1 rounded"
        >
          ↓ Novas mensagens
        </button>
      )}

      {/* MESSAGES */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-2 space-y-3">
        {messages.map((msg, index) => {
          const prev = messages[index - 1]
          const sameUser = isSameUser(prev || null, msg)
          const isMe = msg.user_id === myUserId

          return (
            <div
              key={msg.id}
              onDoubleClick={() => setReplyTo(msg)}
              className={`flex gap-2 ${isMe ? "justify-end" : ""}`}
            >
              {!sameUser && !isMe && (
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-xs">
                  {getInitials(msg.username)}
                </div>
              )}

              <div>
                {!sameUser && (
                  <div className="text-xs text-yellow-500">
                    {msg.username}
                    {onlineUsers.includes(msg.user_id) && " ●"}
                  </div>
                )}

                <div className="bg-[#2a1519] px-3 py-2 rounded-lg">
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* TYPING */}
      {typingUsers.length > 0 && (
        <div className="text-xs text-yellow-400 px-2">
          {typingUsers.join(", ")} digitando...
        </div>
      )}

      {/* REPLY */}
      {replyTo && (
        <div className="bg-[#2a1519] p-2 text-xs flex justify-between">
          Respondendo: {replyTo.content.slice(0, 40)}
          <button onClick={() => setReplyTo(null)}>✕</button>
        </div>
      )}

      {/* INPUT */}
      <div className="flex p-2 gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            let value = e.target.value

            const LIMIT = 40

            const lines = value.split("\n")
            const lastLine = lines[lines.length - 1]

            if (lastLine.length >= LIMIT && !lastLine.endsWith("\n")) {
              value += "\n"
            }

            setInput(value)
            handleTyping()
          }}
          className="flex-1 bg-[#1a0f12] border p-2 rounded"
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  )
}