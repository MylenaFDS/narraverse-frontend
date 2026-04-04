import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef, type ReactNode } from "react"

import { getTurns, createTurn, deleteTurn } from "../services/api"
import type { RPGTurn } from "../types/turn"

type Tab = "turns" | "chat" | "characters" | "lore"

type TurnWithReplies = RPGTurn & {
  replies: TurnWithReplies[]
}

export default function RPG() {
  const { id } = useParams()
  const navigate = useNavigate()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")

  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [newTurn, setNewTurn] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(true)

  const wsRef = useRef<WebSocket | null>(null)

  const isValid = id && !isNaN(rpgId)

  // ===============================
  // 🔥 FETCH
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
  // 🔥 WEBSOCKET
  // ===============================
  useEffect(() => {
    if (!isValid) return

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
  }, [rpgId, isValid])

  // ===============================
  // 🔥 AÇÕES
  // ===============================
  async function handleSendTurn() {
    if (!newTurn.trim()) return

    await createTurn(rpgId, {
      content: newTurn,
      reply_to_turn_id: null,
    })

    setNewTurn("")
  }

  async function handleSendReply(parentId: number) {
    if (!replyContent.trim()) return

    await createTurn(rpgId, {
      content: replyContent,
      reply_to_turn_id: parentId,
    })

    setReplyContent("")
    setReplyTo(null)
  }

  async function handleDeleteTurn(turnId: number) {
    await deleteTurn(turnId)
    setTurns((prev) => prev.filter((t) => t.id !== turnId))
  }

  // ===============================
  // 🧠 THREAD
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
            <span>Usuário {turn.user_id}</span>

            <button
              onClick={() => handleDeleteTurn(turn.id)}
              className="text-red-400 text-xs"
            >
              Deletar
            </button>
          </div>

          <p>{turn.content}</p>
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
          <div className="flex gap-2 mt-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="rpg-input flex-1"
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
        <h2>RPG #{rpgId}</h2>

        <div className="flex gap-3 mt-4">
          <button onClick={() => setActiveTab("turns")}>Turnos</button>
          <button onClick={() => setActiveTab("chat")}>Chat</button>

          {/* 👉 REDIRECIONA */}
          <button onClick={() => navigate(`/rpg/${rpgId}/sheets`)}>
            Fichas
          </button>

          <button onClick={() => setActiveTab("lore")}>
            Enciclopédia
          </button>
        </div>
      </div>

      <div className="rpg-layout max-w-5xl mx-auto">

        <div className="rpg-panel">

          {activeTab === "turns" && (
            <>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                threadedTurns.map((t) => renderTurn(t))
              )}

              <div className="mt-4 flex gap-2">
                <input
                  value={newTurn}
                  onChange={(e) => setNewTurn(e.target.value)}
                  className="rpg-input flex-1"
                />
                <button onClick={handleSendTurn} className="rpg-btn">
                  Enviar
                </button>
              </div>
            </>
          )}

          {activeTab === "chat" && <div>Chat em construção...</div>}
          {activeTab === "lore" && <div>Enciclopédia em construção...</div>}
        </div>

        {/* SIDEBAR */}
        <div className="rpg-sidebar">
          <div className="rpg-panel">Jogadores</div>
          <div className="rpg-panel">Anotações</div>
        </div>

      </div>
    </div>
  )
}