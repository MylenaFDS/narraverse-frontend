import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

import Turns from "../components/RPG/Turns"
import Chat from "../components/RPG/Chat"
import Lore from "../components/RPG/Lore/Lore"
import RPGSheets from "../components/RPG/RPGSheets"
import { getRPG } from "../services/api"

type Tab = "turns" | "chat" | "characters" | "lore"

type RPGType = {
  id: number
  name: string
  description?: string
}

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  // 🔥 AGORA COMEÇA NA ENCICLOPÉDIA
  const [activeTab, setActiveTab] = useState<Tab>("lore")

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

  function tabClass(tab: Tab) {
    return `
      px-3 py-1 rounded transition
      ${
        activeTab === tab
          ? "bg-[#e0a96d] text-black"
          : "hover:bg-[#2a2a2a]"
      }
    `
  }

  return (
    <div className="rpg-bg min-h-screen p-6">

      {/* HEADER */}
      <div className="rpg-panel max-w-5xl mx-auto mb-6">
        <div className="text-xl font-bold font-display text-[#e0a96d]">
          <h2>{rpg.name}</h2>
        </div>

        {/* 🔥 AGORA TUDO É ABA */}
        <div className="flex gap-3 mt-4 text-xl font-display text-[#e0a96d]">

          <button
            onClick={() => setActiveTab("lore")}
            className={tabClass("lore")}
          >
            Enciclopédia
          </button>

          <button
            onClick={() => setActiveTab("characters")}
            className={tabClass("characters")}
          >
            Fichas
          </button>

          <button
            onClick={() => setActiveTab("turns")}
            className={tabClass("turns")}
          >
            Turnos
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={tabClass("chat")}
          >
            Chat
          </button>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="rpg-layout max-w-5xl mx-auto">

        <div className="rpg-panel">

          {activeTab === "lore" && (
            <div>
              <Lore rpgId={rpgId} />
            </div>
          )}

          {activeTab === "characters" && (
            <div>
              <RPGSheets rpgId={rpgId} />
            </div>
          )}

          {activeTab === "turns" && <Turns rpgId={rpgId} />}

          {/* 🔥 MANTÉM CHAT MONTADO (evita reconectar WS toda hora) */}
          <div style={{ display: activeTab === "chat" ? "block" : "none" }}>
            <Chat rpgId={rpgId} />
          </div>

        </div>

        {/* SIDEBAR */}
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