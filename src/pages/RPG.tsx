import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Turns from "../components/RPG/Turns"
import { getRPG } from "../services/api"

type Tab = "turns" | "chat" | "characters" | "lore"

type RPGType = {
  id: number
  name: string
  description?: string
}

export default function RPG() {
  const { id } = useParams()
  const navigate = useNavigate()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")
  const [rpg, setRpg] = useState<RPGType | null>(null)

  const isValid = id && !isNaN(rpgId)

  useEffect(() => {
    if (!isValid) return

    getRPG(rpgId)
      .then(setRpg)
      .catch(() => setRpg(null))
  }, [rpgId, isValid])

  if (!isValid) return <div>RPG inválido</div>

  if (!rpg) return <div>Carregando RPG...</div>

  return (
    <div className="rpg-bg min-h-screen p-6">

      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        {/* 🔥 AQUI ESTÁ A MUDANÇA */}
        <div className="text-xl font-bold font-display text-[#e0a96d]">
          <h2>{rpg.name}</h2>
        </div>

        <div className="flex gap-3 mt-4 text-x2 font-display text-[#e0a96d]">
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

        <div className="rpg-sidebar">
          <div className="rpg-panel text-xl font-display text-[#e0a96d]">
            Jogadores
          </div>
          <div className="rpg-panel text-xl font-display text-[#e0a96d]">
            Anotações
          </div>
        </div>

      </div>
    </div>
  )
}