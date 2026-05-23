import { useEffect, useRef, useState } from "react"

type Message = {
  id: number
  content: string
  user_id: number
  username?: string
  created_at: string
  updated_at?: string | null
  is_edited?: boolean

  reply_to_message_id?: number | null

  reply_to?: {
    id: number
    content: string
    username: string
  } | null
}

export default function Chat({ rpgId }: { rpgId: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] =useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null)
  const [mentionQuery, setMentionQuery] =
  useState("")

const [showMentionDropdown, setShowMentionDropdown] =
  useState(false)
  const mentionUsers =
  onlineUsers.filter((username) =>
    username
      .toLowerCase()
      .includes(
        mentionQuery.toLowerCase()
      )
  )
  const typingTimeout = useRef<number | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

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
  const token =
    localStorage.getItem("token")

  if (!token) return

  let ws: WebSocket | null =
    null

  let isMounted = true

  let reconnectTimeout:
    number | null = null

  function connect() {
    // evita conexão duplicada
    if (
      ws &&
      (
        ws.readyState ===
          WebSocket.OPEN ||
        ws.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      return
    }

    ws = new WebSocket(
      `ws://127.0.0.1:8001/ws/rpg/${rpgId}/chat?token=${token}`
    )

    wsRef.current = ws

    ws.onopen = () => {
      console.log(
        "✅ WS CHAT conectado"
      )
    }

    ws.onmessage = (
      event
    ) => {
      try {
        const data =
          JSON.parse(
            event.data
          )

        if (
          data.type ===
          "message"
        ) {
          setMessages(
            (prev) => [
              ...prev,
              data.data,
            ]
          )
        }

        else if (
          data.type ===
          "delete"
        ) {
          setMessages(
            (prev) =>
              prev.filter(
                (m) =>
                  m.id !==
                  data.message_id
              )
          )
        }

        else if (
          data.type ===
          "edit"
        ) {
          setMessages(
            (prev) =>
              prev.map(
                (m) =>
                  m.id ===
                  data.data.id
                    ? {
                        ...m,
    content:
      data.data.content,
    is_edited:
  data.data.is_edited,
                      }
                    : m
              )
          )
        }

        else if (
          data.type ===
          "typing_start"
        ) {
          setTypingUsers(
            (prev) => {
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
            }
          )
        }

        else if (
          data.type ===
          "typing_stop"
        ) {
          setTypingUsers(
            (prev) =>
              prev.filter(
                (u) =>
                  u !==
                  data.username
              )
          )
        }
        else if (
  data.type === "user_online"
) {
  setOnlineUsers((prev) => {
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
  data.type === "user_offline"
) {
  setOnlineUsers((prev) =>
    prev.filter(
      (u) =>
        u !== data.username
    )
  )
}
      } catch (err) {
        console.error(
          "Erro WS:",
          err
        )
      }
    }

    ws.onerror = () => {
      console.log(
        "⚠️ WS chat erro"
      )

      ws?.close()
    }

    ws.onclose = (
      event
    ) => {
      console.log(
        "🔌 WS chat fechado",
        event.code
      )

      wsRef.current =
        null

      if (
        !isMounted
      ) {
        return
      }

      // token inválido
      if (
        event.code ===
        1008
      ) {
        console.log(
          "⛔ Token inválido no chat WS"
        )

        return
      }

      const delay =
  ws?.readyState ===
  WebSocket.CLOSED
    ? 4000
    : 2500

reconnectTimeout =
  window.setTimeout(
    () => {
      if (!isMounted) return

      console.log(
        "🔄 Reconectando chat..."
      )

      connect()
    },
    delay
  )
    }
  }

  connect()

  function handleTokenRefresh() {
    console.log(
      "🔄 Token renovado → reconectando chat"
    )

    ws?.close()

    setTimeout(
      () => {
        connect()
      },
      300
    )
  }

  window.addEventListener(
    "token-refreshed",
    handleTokenRefresh
  )

  return () => {
    isMounted = false

    if (
      reconnectTimeout
    ) {
      clearTimeout(
        reconnectTimeout
      )
    }

    window.removeEventListener(
      "token-refreshed",
      handleTokenRefresh
    )

    if (
      typingTimeout.current
    ) {
      clearTimeout(
        typingTimeout.current
      )
    }

    wsRef.current?.close()
    wsRef.current = null
  }
}, [rpgId])

  useEffect(() => {
  const container =
    chatContainerRef.current

  if (!container) return

  // distância até o final
  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight

  // só scrolla se estiver perto do fim
  const isNearBottom =
    distanceFromBottom < 120

  if (isNearBottom) {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }
}, [messages])
  // ===============================
  // SEND
  // ===============================
  async function sendMessage() {
  if (!input.trim()) return

  const token = localStorage.getItem("token")

  try {
    if (editingMessage) {
      await fetch(
        `http://127.0.0.1:8001/rpg-chat/${editingMessage.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: input,
            reply_to_message_id:
              replyingTo?.id ?? null,
          }),
        }
      )

      setEditingMessage(null)

    } else {
      await fetch(
        `http://127.0.0.1:8001/rpg-chat/${rpgId}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: input,
            reply_to_message_id:
              replyingTo?.id ?? null,
          }),
        }
      )
    }

    setInput("")
    setReplyingTo(null)

    inputRef.current?.focus()

  } catch (err) {
    console.error(
      "Erro ao enviar:",
      err
    )
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
  function scrollToMessage(
    messageId: number
  ) {
    const el =
      document.getElementById(
        `message-${messageId}`
      )

    if (!el) return

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })

    setHighlightedMessageId(
      messageId
    )

    setTimeout(() => {
      setHighlightedMessageId(
        null
      )
    }, 2000)
  }

 function formatTime(date: string) {
  const localDate =
    new Date(date + "Z")

  return localDate.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )
}

function getInitials(name?: string) {
  if (!name) return "?"

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function renderMarkdown(
  text: string
) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\|\|[^|]+\|\||@\w+)/g
  )

  return parts.map((part, index) => {

    // menção
    if (
      part.startsWith("@")
    ) {
      return (
        <span
          key={index}
          className="
            text-blue-400
            font-medium
          "
        >
          {part}
        </span>
      )
    }

    // negrito
    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    // itálico
    if (
      part.startsWith("*") &&
      part.endsWith("*")
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      )
    }

    // código
    if (
      part.startsWith("`") &&
      part.endsWith("`")
    ) {
      return (
        <code
          key={index}
          className="
            bg-black/30
            px-1
            py-[1px]
            rounded
            text-yellow-300
            text-sm
          "
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    // spoiler
    if (
      part.startsWith("||") &&
      part.endsWith("||")
    ) {
      return (
        <span
          key={index}
          className="
            bg-black
            text-black
            hover:text-gray-200
            px-1
            rounded
            cursor-pointer
            transition
          "
        >
          {part.slice(2, -2)}
        </span>
      )
    }

    return part
  })
}

  return (
    <div className="flex flex-col h-[500px] bg-transparent rounded-xl border border-yellow-900/30">

      <div className="border-b border-transparent text-xl p-2 flex gap-3 mt-4 font-display text-[#e0a96d]">
        Chat do RPG
      </div>
<div className="text-xs text-green-400">
  {onlineUsers.length === 0
    ? "Ninguém online"
    : `${onlineUsers.length} online • ${onlineUsers.join(", ")}`}
</div>
      <div
  ref={chatContainerRef}
  className="
    flex-1
    overflow-y-auto
    p-2
    
  "
>
        {messages.map((msg, index) => {
  const isMe =
    msg.user_id === myUserId

  const prevMessage =
    messages[index - 1]

  const isGrouped =
  prevMessage?.user_id === msg.user_id &&
  !msg.reply_to

  const showAvatar =
  !isGrouped && !isMe

          return (
            <div
  key={msg.id}
  id={`message-${msg.id}`}
  className={`
    group
    flex
    gap-2
    transition-all
    duration-500
    ${isMe ? "justify-end" : ""}
    ${
      highlightedMessageId ===
      msg.id
        ? "scale-[1.02]"
        : ""
    }
    ${
      isGrouped
        ? "mt-[2px]"
        : "mt-4"
    }
  `}
>
  {showAvatar ? (
    <div
      className="
        w-8
        h-8
        rounded-full
        bg-gradient-to-br
        from-yellow-500
        to-yellow-800
        text-black
        text-xs
        font-bold
        flex
        items-center
        justify-center
        shrink-0
        self-start mt-6
      "
    >
      {getInitials(msg.username)}
    </div>
  ) : (
    !isMe && (
      <div className="w-8 shrink-0" />
    )
  )}

  <div>
                {!isGrouped && (
  <div className="flex gap-2 items-center text-xs mb-1">
    <span className="text-yellow-500">
      {msg.username}
    </span>

    <span className="text-gray-500">
      {formatTime(msg.created_at)}
    </span>
  </div>
)}

                <div
  className={`
    bg-[#2a1519]
    px-3
    py-2
    max-w-[280px]
    
    transition-all

    ${
      isMe
        ? isGrouped
          ? "rounded-2xl rounded-tr-sm"
          : "rounded-2xl rounded-br-sm"
        : isGrouped
          ? "rounded-2xl rounded-tl-sm"
          : "rounded-2xl rounded-bl-sm"
    }
  `}
>

  {msg.reply_to && (
    <button
  type="button"
  onClick={() =>
    scrollToMessage(
      msg.reply_to!.id
    )
  }
  className="
    w-full
    text-left
    mb-2
    border-l-4
  border-yellow-500
  bg-black/20
  rounded-md
  px-3
  py-2
  text-xs
  max-w-full
"
    >
      <div className="text-yellow-500 font-medium">
        {msg.reply_to.username}
      </div>

      <div className="text-gray-300 break-words line-clamp-2">
        {renderMarkdown(msg.reply_to.content)}
      </div>
    </button>
  )}

  <div className="whitespace-pre-wrap break-words">
  {renderMarkdown(msg.content)}

  {msg.is_edited && (
    <span className="ml-2 text-[10px] text-gray-500">
      editado
    </span>
  )}
</div>
</div>

                <div
  className="
    flex
    gap-2
    text-[10px]
    text-gray-400
    mt-1
    opacity-0
    group-hover:opacity-100
    transition
  "
>
{formatTime(msg.created_at)}
  <button
    onClick={() => {
      setReplyingTo(msg)
      inputRef.current?.focus()
    }}
  >
    responder
  </button>

  {isMe && (
    <>
      <button
        onClick={() => {
          setEditingMessage(msg)
          setInput(msg.content)
        }}
      >
        editar
      </button>

      <button
        onClick={() =>
          deleteMessage(msg.id)
        }
      >
        excluir
      </button>
    </>
  )}
  </div>

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
        {replyingTo && (
  <div
    className="
  mb-2
  border-l-4
  border-yellow-500
  bg-black/20
  rounded-md
  px-3
  py-2
  text-xs
  overflow-hidden
"
  >
    <div className="flex justify-between">
      <span className="text-yellow-500">
        Respondendo a
        {" "}
        {replyingTo.username}
      </span>

      <button
        onClick={() =>
          setReplyingTo(null)
        }
        className="text-gray-400"
      >
        ✕
      </button>
    </div>

    <p className="truncate text-gray-300">
      {renderMarkdown(replyingTo.content)}
    </p>
  </div>
)}

{showMentionDropdown &&
  mentionUsers.length > 0 && (
    <div
      className="
        mb-2
        bg-[#1a0f12]
        border
        border-yellow-700/40
        rounded-lg
        overflow-hidden
      "
    >
      {mentionUsers.map(
        (username) => (
          <button
            key={username}
            type="button"
            onClick={() => {
              const newValue =
                input.replace(
                  /@\w*$/,
                  `@${username} `
                )

              setInput(newValue)

              setShowMentionDropdown(false)

              inputRef.current?.focus()
            }}
            className="
              block
              w-full
              text-left
              px-3
              py-2
              hover:bg-yellow-900/20
              transition
            "
          >
            @{username}
          </button>
        )
      )}
    </div>
)}
        <textarea
  ref={inputRef}
  value={input}
  rows={1}
onInput={(e) => {
  e.currentTarget.style.height = "auto"

  e.currentTarget.style.height =
    `${e.currentTarget.scrollHeight}px`
}}
  onKeyDown={(e) => {
    // 🔥 Enter envia
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault()

      sendMessage()
    }
  }}
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

    const match =
  value.match(/@(\w+)$/)

if (match) {
  setMentionQuery(match[1])
  setShowMentionDropdown(true)
} else {
  setShowMentionDropdown(false)
}

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
  className="flex-1 bg-[#1a0f12] border p-2 rounded resize-none overflow-hidden"
/>

        <button onClick={sendMessage}>
          {editingMessage ? "Salvar" : "➤"}
        </button>
      </div>
    </div>
  )
}