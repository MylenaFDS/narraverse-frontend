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

  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  const [filtered, setFiltered] = useState<Character[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [mentions, setMentions] = useState<number[]>([])

  const [sheetFields, setSheetFields] = useState<RPGSheetField[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [sheetData, setSheetData] = useState<Record<number, string>>({})

  const wsRef = useRef<WebSocket | null>(null)

  // ===============================
  // FETCH INICIAL
  // ===============================
  useEffect(() => {
    async function fetchAll() {
      try {
        const [turnsData, chars, fields] = await Promise.all([
          getTurns(rpgId),
          getCharacters(rpgId),
          getSheetFields(rpgId),
        ])

        setTurns(turnsData)
        setCharacters(chars)
        setSheetFields(fields)

        if (chars.length > 0) {
          setSelectedCharacterId(chars[0].id)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [rpgId])

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

      const results = characters.filter((c) =>
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

    setMentions((prev) => [...prev, char.id])
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
      mentioned_participants: mentions,
      character_id: selectedCharacterId,
    })

    setNewTurn("")
    setMentions([])
  }

  async function handleSendReply(parentId: number) {
    if (!replyContent.trim()) return

    await createTurn(rpgId, {
      content: replyContent,
      reply_to_turn_id: parentId,
      mentioned_participants: mentions,
      character_id: selectedCharacterId,
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
    const char = characters.find(
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
    return characters.find((c) => c.id === characterId)?.name
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
    return (
      <div key={turn.id} style={{ marginLeft: depth * 20 }}>
        <div className="rpg-turn p-2 rounded hover:bg-[#2b2d31]">
          <div className="flex justify-between">
            <span className="font-bold text-purple-400">
              {getCharacterName(turn.character_id) || `Usuário ${turn.user_id}`}
            </span>

            <button
              onClick={() => handleDeleteTurn(turn.id)}
              className="text-red-400 text-xs"
            >
              Deletar
            </button>
          </div>

          <p>{renderContent(turn.content)}</p>
        </div>

        <button
          onClick={() => {
            setReplyTo(turn.id)
            setReplyContent("")
          }}
          className="text-xs text-accent"
        >
          Responder
        </button>

        {replyTo === turn.id && (
          <div className="flex gap-2 mt-2 relative">
            <input
              value={replyContent}
              onChange={(e) => handleChange(e.target.value, true)}
              className="rpg-input flex-1"
            />

            <button onClick={() => handleSendReply(turn.id)} className="rpg-btn">
              Enviar
            </button>

            {showDropdown && filtered.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-[#1f1f1f] border mt-1 rounded z-10">
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
          {characters.map((c) => (
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