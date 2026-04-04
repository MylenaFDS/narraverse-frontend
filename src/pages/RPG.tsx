import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import { getTurns, createTurn, getMe } from "../services/api"
import type { RPGTurn } from "../types/turn"
import {
  getCharacters,
  createCharacter,
  getSheetFields,
  getCharacterSheet,
  saveCharacterSheet,
} from "../services/characters"

import type {
  Character,
  CharacterSheetField,
  CharacterSheetValue,
} from "../types/character"


type Tab = "turns" | "chat" | "characters" | "lore"

type TurnWithReplies = RPGTurn & {
  replies: TurnWithReplies[]
}

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")
  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [newTurn, setNewTurn] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const replyInputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const isValid = id && !isNaN(rpgId)
const [characters, setCharacters] = useState<Character[]>([])
const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
const [newCharacterName, setNewCharacterName] = useState("")

const [fields, setFields] = useState<CharacterSheetField[]>([])
const [sheetValues, setSheetValues] = useState<Record<number, string>>({})
  // ===============================
  // 🔥 GET USER
  // ===============================
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getMe()
        setCurrentUserId(user.id)
      } catch (err) {
  console.error("Erro ao buscar usuário:", err)
}
    }
    fetchUser()
  }, [])

  // ===============================
  // 🔥 FETCH INICIAL
  // ===============================
  useEffect(() => {
    if (!isValid) return

    async function fetchTurns() {
      try {
        const data = await getTurns(rpgId)
        setTurns(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTurns()
  }, [rpgId, isValid])

  // ===============================
  // 🔥 SCROLL AUTO
  // ===============================
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [turns])
  useEffect(() => {
  if (!isValid) return

  async function loadCharacters() {
    const data = await getCharacters(rpgId)
    setCharacters(data)
  }

  loadCharacters()
}, [rpgId,isValid])
  // ===============================
  // 🔥 WEBSOCKET
  // ===============================
  useEffect(() => {
    if (!isValid) return

    const ws = new WebSocket(`ws://localhost:8000/ws/rpg/${rpgId}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === "new_turn") {
        const turn = message.data

        setTurns((prev) => {
          if (prev.some((t) => t.id === turn.id)) return prev
          return [...prev, turn]
        })
      }

      if (message.type === "delete_turn") {
        const id = message.data
        setTurns((prev) => prev.filter((t) => t.id !== id))
      }
    }

    return () => ws.close()
  }, [rpgId, isValid])

  // ===============================
  // 🔥 ENTER = SEND
  // ===============================
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    isReply = false,
    parentId?: number
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isReply && parentId) {
  handleSendReply(parentId)
} else {
  handleSendTurn()
}
    }
  }

  // ===============================
  // 🔥 SEND TURN
  // ===============================
  async function handleSendTurn() {
    if (!newTurn.trim()) return

    await createTurn(rpgId, {
      content: newTurn,
      reply_to_turn_id: null,
    })

    setNewTurn("")
  }

  // ===============================
  // 🔥 SEND REPLY
  // ===============================
  async function handleSendReply(parentId: number) {
    if (!replyContent.trim()) return

    await createTurn(rpgId, {
      content: replyContent,
      reply_to_turn_id: parentId,
    })

    setReplyContent("")
    setReplyTo(null)
  }

  // ===============================
  // 🔥 DELETE TURN
  // ===============================
  async function handleDeleteTurn(turnId: number) {
    try {
      await fetch(`http://localhost:8000/rpg-turns/${turnId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setTurns((prev) => prev.filter((t) => t.id !== turnId))
    } catch (err) {
      console.error("Erro ao deletar:", err)
    }
  }
  async function selectCharacter(char: Character) {
  setSelectedCharacter(char)

  const fieldsData = await getSheetFields(rpgId)
  setFields(fieldsData)

  const values = await getCharacterSheet(char.id)

  const map: Record<number, string> = {}

  values.forEach((v: CharacterSheetValue) => {
    map[v.field_id] = v.value
  })

  setSheetValues(map)
}

async function handleCreateCharacter() {
  if (!newCharacterName.trim()) return

  const char = await createCharacter(rpgId, {
    name: newCharacterName,
  })

  setCharacters((prev) => [...prev, char])
  setNewCharacterName("")
}

async function handleSaveSheet() {
  if (!selectedCharacter) return

  const payload = Object.entries(sheetValues).map(([field_id, value]) => ({
    field_id: Number(field_id),
    value,
  }))

  await saveCharacterSheet(selectedCharacter.id, payload)
}

  // ===============================
  // 🔥 THREADS
  // ===============================
  function buildThreads(turns: RPGTurn[]): TurnWithReplies[] {
    const map = new Map<number, TurnWithReplies>()

    turns.forEach((t) => {
      map.set(t.id, { ...t, replies: [] })
    })

    const roots: TurnWithReplies[] = []

    map.forEach((turn) => {
      if (turn.reply_to_turn_id) {
        map.get(turn.reply_to_turn_id)?.replies.push(turn)
      } else {
        roots.push(turn)
      }
    })

    return roots
  }

  const threadedTurns = buildThreads(turns)

  // ===============================
  // 🔥 AUTO FOCUS REPLY
  // ===============================
  useEffect(() => {
    if (replyTo) {
      replyInputRef.current?.focus()
    }
  }, [replyTo])

  // ===============================
  // 🔥 RENDER TURN
  // ===============================
  function renderTurn(turn: TurnWithReplies, depth = 0) {
    return (
      <div key={turn.id} style={{ marginLeft: depth * 20 }}>

        <div className="rpg-turn hover:bg-[#2b2d31] p-2 rounded">
          <div className="flex justify-between">

            <span className="font-bold">
              Usuário {turn.user_id}
            </span>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-textSoft">
                {new Date(turn.created_at).toLocaleTimeString()}
              </span>

              {turn.user_id === currentUserId && (
                <button
                  onClick={() => handleDeleteTurn(turn.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>

          <p className="text-sm mt-1">{turn.content}</p>
        </div>

        <button
          onClick={() => {
            setReplyTo(turn.id)
            setReplyContent("")
          }}
          className="text-xs text-accent ml-2"
        >
          Responder
        </button>

        {replyTo === turn.id && (
          <div className="mt-2 flex gap-2 ml-2">
            <input
              ref={replyInputRef}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, true, turn.id)}
              className="rpg-input flex-1"
              placeholder="Responder..."
            />

            <button onClick={() => handleSendReply(turn.id)} className="rpg-btn">
              Enviar
            </button>
          </div>
        )}

        {turn.replies.map((r) => renderTurn(r, depth + 1))}
      </div>
    )
  }

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">

      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-display text-accent">
          RPG #{rpgId}
        </h2>

        <div className="flex gap-3 mt-4 flex-wrap">
          <button onClick={() => setActiveTab("turns")} className="tab">Turnos</button>
          <button onClick={() => setActiveTab("chat")} className="tab">Chat</button>
          <button onClick={() => setActiveTab("characters")} className="tab">Fichas</button>
          <button onClick={() => setActiveTab("lore")} className="tab">Enciclopédia</button>
        </div>
      </div>

      <div className="rpg-layout max-w-5xl mx-auto">

        <div className="rpg-panel">

          {activeTab === "turns" && (
            <>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <div ref={listRef} className="space-y-4 max-h-[500px] overflow-y-auto">
                  {threadedTurns.map((t) => renderTurn(t))}
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <input
                  value={newTurn}
                  onChange={(e) => setNewTurn(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  className="rpg-input flex-1"
                  placeholder="Digite sua ação..."
                />

                <button onClick={handleSendTurn} className="rpg-btn">
                  Enviar
                </button>
              </div>
            </>
          )}

        </div>
          {activeTab === "characters" && (
  <div className="space-y-6">

    {/* 🔥 CRIAR PERSONAGEM */}
    <div className="rpg-panel">
      <h3 className="text-accent mb-2">Seus personagens</h3>

      <div className="flex gap-2">
        <input
          value={newCharacterName}
          onChange={(e) => setNewCharacterName(e.target.value)}
          placeholder="Nome do personagem..."
          className="rpg-input flex-1"
        />

        <button onClick={handleCreateCharacter} className="rpg-btn">
          Criar
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => selectCharacter(char)}
            className={`p-2 rounded cursor-pointer ${
              selectedCharacter?.id === char.id
                ? "bg-accent/20"
                : "hover:bg-[#2b2d31]"
            }`}
          >
            {char.name}
          </div>
        ))}
      </div>
    </div>

    {/* 🔥 FICHA DINÂMICA */}
    {selectedCharacter && (
      <div className="rpg-panel">
        <h3 className="text-accent mb-3">
          Ficha de {selectedCharacter.name}
        </h3>

        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="text-sm">{field.name}</label>

              <input
                value={sheetValues[field.id] || ""}
                onChange={(e) =>
                  setSheetValues((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
                className="rpg-input w-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveSheet}
          className="rpg-btn mt-4 w-full"
        >
          Salvar ficha
        </button>
      </div>
    )}

  </div>
)}
        {/* SIDEBAR intacta */}
        <div className="rpg-sidebar">
          <div className="rpg-panel">
            <h3>Jogadores</h3>
          </div>

          <div className="rpg-panel">
            <h3>Anotações</h3>
          </div>
        </div>

      </div>
    </div>
  )
}