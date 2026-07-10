import { useEffect, useState, useRef, type ReactNode } from "react"

import {
  getTurns,
  createTurn,
  deleteTurn,
  getSheetFields,
  createTimelineEvent,
  getLore,
  getTimelineCategories,
type TimelineCategory,
} from "../../services/api"

import {
  getCharacters,
  getCharacterSheet,
  getMyCharacters
} from "../../services/characters"

import type { RPGTurn } from "../../types/turn"
import type {
  Character,
  CharacterSheetValue,
  RPGSheetField,
} from "../../types/character"
import type { Lore } from "../../types/lore"

import { useLocation, useNavigate } from "react-router-dom"

type Props = {
  rpgId: number
  rpgOwnerId: number
  highlightedTurnId: number | null
}

type TurnWithReplies = RPGTurn & {
  replies: TurnWithReplies[]
}

function getAvatarColor(name: string) {
  const colors = [
    "from-red-500 to-red-700",
    "from-purple-500 to-purple-700",
    "from-green-500 to-green-700",
    "from-blue-500 to-blue-700",
    "from-yellow-500 to-yellow-700",
    "from-pink-500 to-pink-700",
  ]

  const index =
    name.length % colors.length

  return colors[index]
}

export default function Turns({
  rpgId,
  rpgOwnerId,
  highlightedTurnId,
}: Props) {
  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [loading, setLoading] = useState(true)

  const [newTurn, setNewTurn] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const [allCharacters, setAllCharacters] = useState<Character[]>([])
const [myCharacters, setMyCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  // turno principal
const [showDropdown, setShowDropdown] = useState(false)
const [filtered, setFiltered] = useState<Character[]>([])

// reply
const [showReplyDropdown, setShowReplyDropdown] = useState(false)
const [filteredReply, setFilteredReply] = useState<Character[]>([])
  const [mentions, setMentions] = useState<number[]>([])

  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [sheetData, setSheetData] = useState<Record<number, string>>({})
  const [collapsed, setCollapsed] =useState<Record<number, boolean>>({})
  const [newTurnIds, setNewTurnIds] =useState<number[]>([])
  const [timelineLoading, setTimelineLoading] =
  useState<number | null>(null)
  const [timelineDraft, setTimelineDraft] =
  useState<RPGTurn | null>(null)

const [timelineTitle, setTimelineTitle] =
  useState("")

const [timelineContent, setTimelineContent] =
  useState("")

const [timelineLoreId, setTimelineLoreId] =
  useState<number | "">("")
  const [lore, setLore] =
  useState<Lore[]>([])
  const [timelineCategories, setTimelineCategories] =
  useState<TimelineCategory[]>([])

const [timelineCategoryId, setTimelineCategoryId] =
  useState<number | "">("")
  
  const wsRef = useRef<WebSocket | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const worldLore = lore.filter(
  (item) =>
    item.category === "Mundo"
)
  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    async function fetchAll() {
      try {
        const [
  turnsData,
  allChars,
  myChars,
  fields,
  loreData,
  timelineCategoriesData,
] = await Promise.all([
  getTurns(rpgId),
  getCharacters(rpgId),
  getMyCharacters(),
  getSheetFields(rpgId),
  getLore(rpgId),
  getTimelineCategories(rpgId),
])

setTurns(turnsData)
setAllCharacters(allChars)
setMyCharacters(myChars)
setSheetFields(fields)
setLore(loreData)
setTimelineCategories(
  timelineCategoriesData
)

if (myChars.length > 0) {
  setSelectedCharacterId(myChars[0].id)
}
      } finally {
        setLoading(false)
      }
    }

    fetchAll(
    )
  }, [rpgId],)

  // ===============================
  // WEBSOCKET
  // ===============================
  useEffect(() => {
  const token = localStorage.getItem("token")
  if (!token) return

  let ws: WebSocket | null = null
  let isMounted = true
  let reconnectTimeout: number | null = null

  function connect() {
    // evita conexão duplicada
    if (
      ws &&
      (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      )
    ) {
      return
    }

    ws = new WebSocket(
      `ws://127.0.0.1:8001/ws/rpg/${rpgId}/turns?token=${token}`
    )

    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ WS conectado (turns)")
      
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      console.log("📩 WS RECEBIDO:", message)

      if (message.type === "new_turn") {
        setTurns((prev) => {
          const exists = prev.some(
            (t) => t.id === message.data.id
          )

          if (exists) return prev
          setNewTurnIds((prev) => [
  ...prev,
  message.data.id,
])

setTimeout(() => {
  setNewTurnIds((prev) =>
    prev.filter(
      (id) => id !== message.data.id
    )
  )
}, 3500)

          const updated = [
            ...prev,
            message.data,
          ]

          return updated.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
        })
      }
    }

    ws.onerror = () => {
      console.log("🔥 WS erro")
    }

    ws.onclose = (event) => {
  console.log(
  "🔌 WS turns fechado",
  event.code
)

  wsRef.current = null
  
  if (!isMounted) return

  // 🚫 NÃO reconecta se token inválido
  if (
  event.code === 1008 ||
  event.code === 1006
) {
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
  return
}

  reconnectTimeout = window.setTimeout(() => {
    connect()
  }, 2000)
}
  }

  connect()

  function handleTokenRefresh() {
  console.log("🔄 Token renovado → reconectando WS")

  ws?.close()

  setTimeout(() => {
    connect()
  }, 300)
}

window.addEventListener(
  "token-refreshed",
  handleTokenRefresh
)

// 👇 cleanup
  return () => {
    isMounted = false

    if (reconnectTimeout) {
      clearTimeout(
        reconnectTimeout
      )
    }

    window.removeEventListener(
      "token-refreshed",
      handleTokenRefresh
    )

  wsRef.current?.close()
    wsRef.current = null
}
}, [rpgId])

useEffect(() => {
  if (!location.hash || turns.length === 0) return

  const id = location.hash.replace("#turn-", "")

  setTimeout(() => {
    const el = document.getElementById(`turn-${id}`)

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, 100)
}, [location, turns])
  // ===============================
  // AUTOCOMPLETE
  // ===============================
  function handleChange(value: string, isReply = false) {
  if (isReply) setReplyContent(value)
  else setNewTurn(value)

  const match = value.match(/@(\w*)$/)

  if (match) {
    const search = match[1].toLowerCase()

    const results = allCharacters.filter((c) =>
      c.name.toLowerCase().includes(search)
    )

    if (isReply) {
      setFilteredReply(results)
      setShowReplyDropdown(true)
    } else {
      setFiltered(results)
      setShowDropdown(true)
    }
  } else {
    if (isReply) setShowReplyDropdown(false)
    else setShowDropdown(false)
  }
}

  function handleSelectMention(char: Character, isReply = false) {
    if (isReply) {
      setReplyContent(replyContent.replace(/@\w*$/, `@${char.name} `))
    } else {
      setNewTurn(newTurn.replace(/@\w*$/, `@${char.name} `))
    }

    setMentions((prev) => [...new Set([...prev, char.id])])
    setShowDropdown(false)
  }

  // ===============================
  // AÇÕES
  // ===============================
  async function handleSendTurn() {
    if (!newTurn.trim()) return

    await createTurn(rpgId, {
      content: newTurn,
      reply_to_turn_id: null,
      mentioned_characters: mentions,
      character_id: selectedCharacterId ?? undefined,
    })

    setNewTurn("")
    setMentions([])
  }

  async function handleSendReply(parentId: number) {
  if (!replyContent.trim()) return

  const parentTurn = turns.find((t) => t.id === parentId)

  if (!parentTurn || !canReply(parentTurn)) {
    alert("Você não pode responder este turno.")
    return
  }

  await createTurn(rpgId, {
    content: replyContent,
    reply_to_turn_id: parentId,
    mentioned_characters: mentions,
    character_id: selectedCharacterId ?? undefined,
  })

  setReplyContent("")
  setReplyTo(null)
  setMentions([])
}

  async function handleDeleteTurn(turnId: number) {
    await deleteTurn(turnId)
    setTurns((prev) => prev.filter((t) => t.id !== turnId))
  }
  
  async function handleAddToTimeline() {
  if (!timelineDraft) return

  try {
    setTimelineLoading(timelineDraft.id)

    await createTimelineEvent(
      rpgId,
      {
  title: timelineTitle,
  content: timelineContent,
  date_label: "Narrativa",
  turn_id: timelineDraft.id,
  lore_id:
    timelineLoreId === ""
      ? null
      : Number(timelineLoreId),
  category_id:
  timelineCategoryId === ""
    ? null
    : Number(timelineCategoryId),
}
    )

    alert("Evento adicionado à Timeline!")

    setTimelineDraft(null)
    setTimelineTitle("")
    setTimelineContent("")
  } catch (err) {
    console.error(err)
    alert("Erro ao adicionar à Timeline.")
  } finally {
    setTimelineLoading(null)
  }
}
  // ===============================
  // FICHA
  // ===============================
  async function handleOpenCharacter(name: string) {
    const char = allCharacters.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    )

    if (!char) return

    setSelectedCharacter(char)

    const sheet = await getCharacterSheet(char.id)

    const formatted: Record<number, string> = {}

    sheet.forEach((item: CharacterSheetValue) => {
      formatted[item.field.id] = item.value
    })

    setSheetData(formatted)
  }

  function renderContent(content: string) {
    const parts = content.split(/(@\w+)/g)

    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const name = part.slice(1)

        return (
          <span
            key={i}
            onClick={() => handleOpenCharacter(name)}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            {part}
          </span>
        )
      }

      return part
    })
  }

  function getCharacterName(characterId?: number | null) {
    if (!characterId) return null
    return allCharacters.find((c) => c.id === characterId)?.name
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }
  function getAllowedCharacters(turn: RPGTurn): Character[] {
  const mentioned = turn.mentioned_characters ?? []

  return myCharacters.filter((char) =>
    mentioned.includes(char.id)
  )
}
  // ===============================
  // THREAD
  // ===============================
  function buildThreads(turns: RPGTurn[]): TurnWithReplies[] {
    const map = new Map<number, TurnWithReplies>()

    turns.forEach((t) => {
      map.set(t.id, { ...t, replies: [] })
    })

    const roots: TurnWithReplies[] = []

    map.forEach((t) => {
      if (t.reply_to_turn_id) {
        map.get(t.reply_to_turn_id)?.replies.push(t)
      } else {
        roots.push(t)
      }
    })

    return roots
  }

  const threadedTurns = buildThreads(turns)

  function canReply(turn: RPGTurn): boolean {
  const mentioned = turn.mentioned_characters ?? []

  if (mentioned.length === 0) return false

  return myCharacters.some((c) =>
    mentioned.includes(c.id)
  )
}
  function renderTurn(turn: TurnWithReplies, depth = 0): ReactNode {
  const name =
    getCharacterName(turn.character_id) || `Usuário ${turn.user_id}`
  const isHighlighted =
  location.hash === `#turn-${turn.id}` ||
  highlightedTurnId === turn.id
  const loggedUserId = Number(localStorage.getItem("user_id"))

const isMe = turn.user_id === loggedUserId
  return (
    <div
  id={`turn-${turn.id}`}
  key={turn.id}
  style={{
  marginLeft: depth * 28,
  borderLeft:
    depth > 0
      ? "2px solid rgba(224,169,109,.15)"
      : "none",
  paddingLeft: depth > 0 ? 14 : 0,
}}
  onClick={() => {
  if (location.hash !== `#turn-${turn.id}`) {
    navigate(`/rpg/${rpgId}#turn-${turn.id}`)
  }
}}
  className={`
  cursor-pointer
  transition-all
  duration-300
  ${
    isHighlighted
      ? `
        ring-2
        ring-yellow-500/50
        shadow-[0_0_30px_rgba(224,169,109,.15)]
        rounded-2xl
      `
      : ""
  }
`}
>

      <div className="flex items-start gap-3 mt-2">

        {/* AVATAR */}
        <div
  className={`
    w-11 h-11 rounded-full
    bg-gradient-to-br
    ${getAvatarColor(name)}
    flex items-center justify-center
    text-black font-bold
    text-sm
    border border-black/20
    shadow-lg shrink-0
  `}
>
          {getInitials(name)}
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1">

          <div
  className={`
    p-4 rounded-2xl
    transition-all duration-300
    border backdrop-blur-sm
    shadow-md
    hover:shadow-xl
    hover:-translate-y-[1px]
    hover:border-[#7a5442]

    ${
  newTurnIds.includes(turn.id)
    ? "ring-2 ring-green-500/40"
    : ""
}

${isHighlighted
        ? "ring-2 ring-yellow-500/50 shadow-[0_0_30px_rgba(224,169,109,.15)]"
        : `
          border-[#3a2a2a]
          bg-gradient-to-br
          from-[#211616]/90
          to-[#161010]/90
          hover:border-[#5a3c2d]
        `
    }
  `}
  style={{ fontFamily: "Georgia, serif" }}
>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
  <div className="flex items-center gap-2">
    <span className="font-semibold text-[#e0a96d] tracking-wide text-[15px]">
      {name}
    </span>

    {turn.user_id === rpgOwnerId ? (
      <span className="
        text-[10px]
        px-2 py-[2px]
        rounded-full
        bg-yellow-700/20
        text-yellow-400
        border border-yellow-700/40
      ">
        Mestre
      </span>
    ) : (
      <span className="
        text-[10px]
        px-2 py-[2px]
        rounded-full
        bg-[#2a2a2a]
        text-gray-400
      ">
        Jogador
      </span>
    )}
  </div>

  <span className="text-[11px] text-gray-500">
    Personagem ativo
  </span>
</div>

              {isMe && (
  <button
    onClick={(e) => {
      e.stopPropagation()
      handleDeleteTurn(turn.id)
    }}
    className="text-red-400 text-xs opacity-70 hover:opacity-100"
  >
    Deletar
  </button>
)}
{turn.user_id === rpgOwnerId && (
  <button
    onClick={(e) => {
      e.stopPropagation()

      setTimelineDraft(turn)

setTimelineTitle(
  turn.content.length > 40
    ? turn.content.slice(0, 40) + "..."
    : turn.content
)

setTimelineContent(turn.content)
setTimelineLoreId("")
setTimelineCategoryId("")
    }}
    disabled={
      timelineLoading === turn.id
    }
    className="
      text-xs
      text-[#e0a96d]
      opacity-70
      hover:opacity-100
    "
  >
    {timelineLoading === turn.id
      ? "..."
      : "📜 Timeline"}
  </button>
)}
            </div>

            {/* TEXTO */}
            <p className="leading-relaxed text-[15px]">
              {renderContent(turn.content)}
            </p>
          </div>

          {/* RESPONDER */}
          {canReply(turn) && (
  <button
    onClick={(e) => {
  e.stopPropagation()

  const allowed = getAllowedCharacters(turn)

  setSelectedCharacterId(allowed[0]?.id ?? null)
  setReplyTo(turn.id)
  setReplyContent("")

  setShowDropdown(false)
  setShowReplyDropdown(false)

  
}}
    className="
  text-xs
  text-[#c99755]
  hover:text-[#e0a96d]
  mt-2
  transition
  font-medium
"
  >
    ↳ Responder
  </button>
)}
        </div>
      </div>

      {/* INPUT RESPOSTA */}
      {replyTo === turn.id && (
  <div className="flex flex-col gap-2 mt-2 relative ml-12">

    {/* 🔥 SELECT DINÂMICO */}
    <select
      value={selectedCharacterId ?? ""}
      onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
      className="rpg-input"
    >
      {getAllowedCharacters(turn).map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>

    {/* INPUT + BOTÃO */}
    <div className="flex gap-2 relative">
      <input
        value={replyContent}
        onChange={(e) => handleChange(e.target.value, true)}
        className="rpg-input flex-1"
      />

      <button
        onClick={() => handleSendReply(turn.id)}
        className="rpg-btn"
      >
        Enviar
      </button>
    </div>

    {/* DROPDOWN MENÇÃO */}
    {showReplyDropdown && filteredReply.length > 0 && (
      <div className="absolute top-full left-0 w-full bg-[#1f1f1f] border mt-1 rounded z-10 shadow-lg">
        {filteredReply.map((char) => (
          <div
            key={char.id}
            onClick={() => handleSelectMention(char, true)}
            className="p-2 cursor-pointer hover:bg-[#2b2d31]"
          >
            @{char.name}
          </div>
        ))}
      </div>
    )}
  </div>
)}

{turn.replies.length > 0 && (
  <button
    onClick={(e) => {
      e.stopPropagation()

      setCollapsed((prev) => ({
        ...prev,
        [turn.id]:
          !prev[turn.id],
      }))
    }}
    className="
      text-xs
      text-gray-500
      hover:text-[#e0a96d]
      mt-2
    "
  >
    {collapsed[turn.id]
      ? `Mostrar respostas (${turn.replies.length})`
      : `Ocultar respostas`}
  </button>
)}
      {/* REPLIES */}
      {!collapsed[turn.id] &&
  turn.replies.map((r) =>
    renderTurn(r, depth + 1)
)}
    </div>
  )
}


  return (
    <>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        threadedTurns.map((t) => renderTurn(t))
      )}

      {/* INPUT */}
      <div className="mt-8 flex gap-3 flex-col relative border-t border-[#3a2a2a] pt-5">
        <select
          value={selectedCharacterId ?? ""}
          onChange={(e) => setSelectedCharacterId(Number(e.target.value))}
          className="rpg-input"
        >
          {myCharacters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 relative">
          <input
            value={newTurn}
            onChange={(e) => handleChange(e.target.value)}
            className="rpg-input flex-1"
          />

          <button onClick={handleSendTurn} className="rpg-btn">
            Enviar
          </button>

          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-[#1f1f1f] border mt-1 rounded z-10">
              {filtered.map((char) => (
                <div
                  key={char.id}
                  onClick={() => handleSelectMention(char)}
                  className="p-2 cursor-pointer hover:bg-[#2b2d31]"
                >
                  @{char.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
{selectedCharacter && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div
      className="
        bg-gradient-to-br
        from-[#211616]
        to-[#161010]
        border border-[#4a2f2f]
        p-6
        rounded-3xl
        shadow-2xl
        w-[450px]
        max-h-[80vh]
        overflow-y-auto
      "
    >
      <h2
        className="
          text-2xl
          font-display
          text-[#e0a96d]
          mb-5
        "
      >
        {selectedCharacter.name}
      </h2>

      <div className="space-y-3">
        {Object.entries(sheetData).map(
          ([fieldId, value]) => {
            const fieldName =
              sheetFields.find(
                (f) =>
                  f.id === Number(fieldId)
              )?.name ||
              `Campo ${fieldId}`

            return (
              <div
                key={fieldId}
                className="
                  bg-black/20
                  border border-[#3a2a2a]
                  rounded-xl
                  p-3
                "
              >
                <span className="text-gray-400">
                  {fieldName}:
                </span>

                <p>{value}</p>
              </div>
            )
          }
        )}
      </div>

      <button
        onClick={() =>
          setSelectedCharacter(null)
        }
        className="mt-5 rpg-btn w-full"
      >
        Fechar
      </button>
    </div>
  </div>
)}
{timelineDraft && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#18181b] border border-[#2b2b31] rounded-2xl p-6 w-[460px]">
      <h2 className="text-2xl font-display text-[#e0a96d] mb-4">
        📜 Adicionar à Timeline
      </h2>

      <input
        value={timelineTitle}
        onChange={(e) =>
          setTimelineTitle(e.target.value)
        }
        className="rpg-input mb-3"
        placeholder="Título do evento"
      />

      <textarea
        value={timelineContent}
        onChange={(e) =>
          setTimelineContent(e.target.value)
        }
        className="rpg-input min-h-[140px]"
        placeholder="Resumo do evento"
      />
      <select
  value={timelineCategoryId}
  onChange={(e) =>
    setTimelineCategoryId(
      e.target.value
        ? Number(e.target.value)
        : ""
    )
  }
  className="rpg-input mt-3"
>
  <option value="">
    Categoria do evento
  </option>

  {timelineCategories.map((cat) => (
    <option
      key={cat.id}
      value={cat.id}
    >
      {cat.name}
    </option>
  ))}
</select>
    <select
  value={timelineLoreId}
  onChange={(e) =>
    setTimelineLoreId(
      e.target.value
        ? Number(e.target.value)
        : ""
    )
  }
  className="rpg-input mt-3"
>
  <option value="">
    Região relacionada
  </option>

  {worldLore.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.title}
    </option>
  ))}
</select>
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleAddToTimeline}
          className="rpg-btn"
        >
          Salvar na Timeline
        </button>

        <button
          type="button"
          onClick={() =>
            setTimelineDraft(null)
          }
          className="text-red-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </>
  )
  
}
  