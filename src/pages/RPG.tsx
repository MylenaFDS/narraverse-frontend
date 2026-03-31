import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { getTurns, createTurn } from "../services/api"
import type { RPGTurn } from "../types/turn"

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
  const [loading, setLoading] = useState(true)

  const isValid = id && !isNaN(rpgId)

  // 🔥 FETCH
  useEffect(() => {
    if (!isValid) return

    async function fetchTurns() {
      try {
        const data = await getTurns(rpgId)
        setTurns(data)
      } catch (err) {
        console.error("Erro ao buscar turnos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTurns()
  }, [rpgId, isValid])

  // 🔥 SEND
  async function handleSendTurn() {
    if (!newTurn.trim()) return

    try {
      const created = await createTurn(rpgId, {
        content: newTurn,
        reply_to_turn_id: replyTo,
      })

      setTurns((prev) => [created, ...prev])
      setNewTurn("")
      setReplyTo(null)
    } catch (err) {
      console.error("Erro ao enviar turno:", err)
    }
  }

  // 🔥 THREAD BUILDER
  function buildThreads(turns: RPGTurn[]): TurnWithReplies[] {
    const map = new Map<number, TurnWithReplies>()

    turns.forEach((t) => {
      map.set(t.id, { ...t, replies: [] })
    })

    const roots: TurnWithReplies[] = []

    map.forEach((turn) => {
      if (turn.reply_to_turn_id) {
        const parent = map.get(turn.reply_to_turn_id)
        parent?.replies.push(turn)
      } else {
        roots.push(turn)
      }
    })

    return roots
  }

  const threadedTurns = buildThreads(turns)

  // 🔥 RENDER TURN (DISCORD STYLE)
  function renderTurn(turn: TurnWithReplies, depth = 0) {
    return (
      <div key={turn.id} className="relative">

        {/* linha lateral */}
        {depth > 0 && (
          <div
            className="absolute left-2 top-0 bottom-0 w-[2px] bg-border"
            style={{ marginLeft: depth * 16 }}
          />
        )}

        <div
          style={{ marginLeft: depth * 20 }}
          className="space-y-1"
        >
          <div className="rpg-turn">

            <div className="rpg-turn-header">
              <div className="flex items-center gap-2">
                <div className="rpg-avatar">
                  {turn.user_id}
                </div>

                <span className="font-bold">
                  Usuário {turn.user_id}
                </span>
              </div>

              <span className="text-xs text-textSoft">
                {new Date(turn.created_at).toLocaleTimeString()}
              </span>
            </div>

            {/* preview de reply */}
            {turn.reply_to_turn_id && (
              <div className="text-xs text-accent mb-1">
                ↳ respondendo a #{turn.reply_to_turn_id}
              </div>
            )}

            <p className="text-sm text-textSoft">
              {turn.content}
            </p>
          </div>

          {/* botão fora do card */}
          <button
            onClick={() => setReplyTo(turn.id)}
            className="text-xs text-accent hover:underline ml-2"
          >
            Responder
          </button>

          {/* replies */}
          {turn.replies.map((reply) =>
            renderTurn(reply, depth + 1)
          )}
        </div>
      </div>
    )
  }

  if (!isValid) {
    return <div>RPG inválido</div>
  }

  return (
    <div className="rpg-bg min-h-screen p-6">

      {/* HEADER */}
      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-display text-accent">
          RPG #{rpgId}
        </h2>

        <p className="text-textSoft">
          História em andamento...
        </p>

        {/* TABS */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button onClick={() => setActiveTab("turns")} className="tab">Turnos</button>
          <button onClick={() => setActiveTab("chat")} className="tab">Chat</button>
          <button onClick={() => setActiveTab("characters")} className="tab">Fichas</button>
          <button onClick={() => setActiveTab("lore")} className="tab">Enciclopédia</button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="rpg-layout max-w-5xl mx-auto">

        {/* ESQUERDA */}
        <div className="rpg-panel">

          {activeTab === "turns" && (
            <>
              <h3 className="text-xl font-display text-accent mb-4">
                Turnos
              </h3>

              {loading ? (
                <p className="text-textSoft">Carregando...</p>
              ) : (
                <div className="space-y-4">
                  {threadedTurns.length > 0 ? (
                    threadedTurns.map((turn) => renderTurn(turn))
                  ) : (
                    <p className="text-textSoft">
                      Nenhum turno ainda...
                    </p>
                  )}
                </div>
              )}

              {/* 🔥 MOSTRA RESPOSTA ATIVA */}
              {replyTo && (
                <div className="text-sm text-accent mt-3">
                  Respondendo ao turno #{replyTo}
                  <button
                    onClick={() => setReplyTo(null)}
                    className="ml-2 text-red-400"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* INPUT */}
              <div className="mt-6 rpg-action">
                <input
                  value={newTurn}
                  onChange={(e) => setNewTurn(e.target.value)}
                  placeholder={
                    replyTo
                      ? `Respondendo ao turno #${replyTo}...`
                      : "Digite sua ação..."
                  }
                  className="rpg-input flex-1"
                />

                <button onClick={handleSendTurn} className="rpg-btn">
                  Enviar
                </button>
              </div>
            </>
          )}

          {activeTab === "chat" && <div>Chat em construção...</div>}
          {activeTab === "characters" && <div>Fichas em construção...</div>}
          {activeTab === "lore" && <div>Enciclopédia em construção...</div>}

        </div>

        {/* DIREITA */}
        <div className="rpg-sidebar">

          <div className="rpg-panel">
            <h3 className="font-display text-accent mb-3">
              Jogadores
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rpg-avatar">U</div>
                <span>Usuário</span>
              </div>
            </div>
          </div>

          <div className="rpg-panel">
            <h3 className="font-display text-accent mb-3">
              Anotações
            </h3>

            <textarea
              className="rpg-input"
              placeholder="Anotações do mestre..."
            />

            <button className="rpg-btn mt-2 w-full">
              Salvar
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}