import { useEffect, useState, useRef, type ReactNode } from "react"

import {
  getTurns,
  createTurn,
  deleteTurn,
  getSheetFields,
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

type Props = {
  rpgId: number
}

type TurnWithReplies = RPGTurn & {
  replies: TurnWithReplies[]
}

export default function Turns({ rpgId }: Props) {
  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [loading, setLoading] = useState(true)

  const [newTurn, setNewTurn] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const [allCharacters, setAllCharacters] = useState<Character[]>([])
const [myCharacters, setMyCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  const [filtered, setFiltered] = useState<Character[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [mentions, setMentions] = useState<number[]>([])

  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [sheetData, setSheetData] = useState<Record<number, string>>({})

  const wsRef = useRef<WebSocket | null>(null)

  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    async function fetchAll() {
      try {
        const [turnsData, allChars, myChars, fields] = await Promise.all([
  getTurns(rpgId),
  getCharacters(rpgId),  // TODOS (menções)
  getMyCharacters(),     // SÓ SEUS (turno)
  getSheetFields(rpgId),
])

setTurns(turnsData)
setAllCharacters(allChars)
setMyCharacters(myChars)
setSheetFields(fields)

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
    const ws = new WebSocket(`ws://localhost:8000/ws/rpg/${rpgId}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === "new_turn") {
        setTurns((prev) => {
          if (prev.some((t) => t.id === msg.data.id)) return prev
          return [...prev, msg.data]
        })
      }

      if (msg.type === "delete_turn") {
        setTurns((prev) => prev.filter((t) => t.id !== msg.turn_id))
      }
    }

    return () => ws.close()
  }, [rpgId])

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

      setFiltered(results)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
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
      formatted[item.field_id] = item.value
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

  function renderTurn(turn: TurnWithReplies, depth = 0): ReactNode {
  const name =
    getCharacterName(turn.character_id) || `Usuário ${turn.user_id}`

  const isMe = false // 👉 depois você pode ligar com user logado

  return (
    <div key={turn.id} style={{ marginLeft: depth * 20 }}>

      <div className="flex items-start gap-3 mt-2">

        {/* AVATAR */}
        <div className="
          w-9 h-9 rounded-full 
          bg-gradient-to-br from-yellow-500 to-yellow-700
          text-black flex items-center justify-center 
          text-xs font-bold shadow-md
        ">
          {getInitials(name)}
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1">

          <div
            className={`
              p-3 rounded-lg transition-all duration-200
              border border-[#3a2a2a]
              ${isMe
                ? "bg-transparent"
                : "bg-transparent hover:bg-[#2a2a2a]"
              }
            `}
            style={{ fontFamily: "Georgia, serif" }}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-yellow-500 tracking-wide">
                {name}
              </span>

              <button
                onClick={() => handleDeleteTurn(turn.id)}
                className="text-red-400 text-xs opacity-70 hover:opacity-100"
              >
                Deletar
              </button>
            </div>

            {/* TEXTO */}
            <p className="leading-relaxed text-[15px]">
              {renderContent(turn.content)}
            </p>
          </div>

          {/* RESPONDER */}
          <button
            onClick={() => {
              setReplyTo(turn.id)
              setReplyContent("")
            }}
            className="text-xs text-yellow-600 hover:text-yellow-400 mt-1 transition"
          >
            Responder
          </button>
        </div>
      </div>

      {/* INPUT RESPOSTA */}
      {replyTo === turn.id && (
        <div className="flex gap-2 mt-2 relative ml-12">
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

          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-[#1f1f1f] border mt-1 rounded z-10 shadow-lg">
              {filtered.map((char) => (
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

      {/* REPLIES */}
      {turn.replies.map((r) => renderTurn(r, depth + 1))}
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
      <div className="mt-4 flex gap-2 flex-col relative">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1f1f1f] p-6 rounded w-[400px]">
            <h2 className="text-lg mb-4">{selectedCharacter.name}</h2>

            {Object.entries(sheetData).map(([fieldId, value]) => {
              const fieldName =
                sheetFields.find((f) => f.id === Number(fieldId))?.name ||
                `Campo ${fieldId}`

              return (
                <div key={fieldId} className="mb-2">
                  <span className="text-gray-400">{fieldName}:</span>
                  <p>{value}</p>
                </div>
              )
            })}

            <button
              onClick={() => setSelectedCharacter(null)}
              className="mt-4 rpg-btn w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
