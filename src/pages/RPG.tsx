import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getTurns, createTurn } from "../services/api"
import type { RPGTurn } from "../types/turn"

type Tab = "turns" | "chat" | "characters" | "lore"

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")
  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [newTurn, setNewTurn] = useState("")
  const [loading, setLoading] = useState(true)

  // ✅ Hook SEMPRE no topo
  useEffect(() => {
    async function fetchTurns() {
      if (!id || isNaN(rpgId)) return

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
  }, [id, rpgId])

  async function handleSendTurn() {
    if (!newTurn.trim()) return

    try {
      const created = await createTurn(rpgId, newTurn)

      // adiciona no topo
      setTurns((prev) => [created, ...prev])
      setNewTurn("")
    } catch (err) {
      console.error("Erro ao enviar turno:", err)
    }
  }

  // ✅ AGORA sim pode validar
  if (!id || isNaN(rpgId)) {
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
                  {turns.map((turn) => (
                    <div key={turn.id} className="rpg-turn">
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

                      <p className="text-sm text-textSoft">
                        {turn.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* INPUT */}
              <div className="mt-6 rpg-action">
                <input
                  value={newTurn}
                  onChange={(e) => setNewTurn(e.target.value)}
                  placeholder="Digite sua ação..."
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