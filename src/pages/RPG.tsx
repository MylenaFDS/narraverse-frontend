import { useParams } from "react-router-dom"
import { useState } from "react"

type Tab = "turns" | "chat" | "characters" | "lore"

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")

  if (!id || isNaN(rpgId)) {
    return <div>RPG inválido</div>
  }

  return (
    <div className="rpg-bg min-h-screen p-6">

      {/* HEADER */}
      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-display text-accent">
          Império das Sombras
        </h2>
        <p className="text-textSoft">
          Intrigas políticas em um reino decadente.
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

              {/* Lista de turnos */}
              <div className="space-y-4">

                <div className="rpg-turn">
                  <div className="rpg-turn-header">
                    <div className="flex items-center gap-2">
                      <div className="rpg-avatar">R</div>
                      <span className="font-bold">Ragnar</span>
                    </div>
                    <span className="text-xs text-textSoft">3 min</span>
                  </div>

                  <p className="text-sm text-textSoft">
                    Com a tocha em punho, Ragnar avança pela caverna sombria.
                    Ele ouve um ruído à frente, um baixo rosnado...
                  </p>
                </div>

                <div className="rpg-turn">
                  <div className="rpg-turn-header">
                    <div className="flex items-center gap-2">
                      <div className="rpg-avatar">Y</div>
                      <span className="font-bold">Your turn</span>
                    </div>
                    <span className="text-xs text-accent">Agora</span>
                  </div>

                  <p className="text-sm text-textSoft">
                    Sua ação aqui...
                  </p>
                </div>

              </div>

              {/* Input ação */}
              <div className="mt-6 rpg-action">
                <input
                  placeholder="Digite sua ação..."
                  className="rpg-input flex-1"
                />
                <button className="rpg-btn">Enviar</button>
              </div>
            </>
          )}

          {activeTab === "chat" && <div>Chat em construção...</div>}
          {activeTab === "characters" && <div>Fichas em construção...</div>}
          {activeTab === "lore" && <div>Enciclopédia em construção...</div>}

        </div>

        {/* DIREITA */}
        <div className="rpg-sidebar">

          {/* Jogadores */}
          <div className="rpg-panel">
            <h3 className="font-display text-accent mb-3">
              Jogadores
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rpg-avatar">R</div>
                <span>Ragnar</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="rpg-avatar">Y</div>
                <span>Você</span>
              </div>
            </div>
          </div>

          {/* Anotações */}
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