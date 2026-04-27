import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

import Turns from "../components/RPG/Turns"

type Tab = "turns" | "chat" | "characters" | "lore"

export default function RPG() {
  const { id } = useParams()
  const navigate = useNavigate()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")

  const isValid = id && !isNaN(rpgId)

  if (!isValid) return <div>RPG inválido</div>

  return (
    <div className="rpg-bg min-h-screen p-6">

      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <h2>RPG #{rpgId}</h2>

        <div className="flex gap-3 mt-4 text-xl font-display text-[#e0a96d]">
          <button onClick={() => setActiveTab("turns")}>Turnos</button>
          <button onClick={() => setActiveTab("chat")}>Chat</button>

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

          {activeTab === "turns" && <Turns rpgId={rpgId} />}

          {activeTab === "chat" && <div>Chat em construção...</div>}
          {activeTab === "lore" && <div>Enciclopédia em construção...</div>}
        </div>

        {/* SIDEBAR */}
        <div className="rpg-sidebar">
          <div className="rpg-panel text-xl font-display text-[#e0a96d]">Jogadores</div>
          <div className="rpg-panel text-xl font-display text-[#e0a96d]">Anotações</div>
        </div>

      </div>
    </div>
  )
}