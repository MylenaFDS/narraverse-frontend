import { useParams } from "react-router-dom"
import { useState } from "react"

import Turns from "../components/RPG/Turns"
import Lore from "../components/RPG/Lore"

type Tab = "turns" | "chat" | "characters" | "lore" | "notes"

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState<Tab>("turns")

  if (!id || isNaN(rpgId)) {
    return <div>RPG inválido</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="title mb-4">RPG #{rpgId}</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button onClick={() => setActiveTab("turns")} className="tab">Turnos</button>
        <button onClick={() => setActiveTab("chat")} className="tab">Chat</button>
        <button onClick={() => setActiveTab("characters")} className="tab">Fichas</button>
        <button onClick={() => setActiveTab("lore")} className="tab">Enciclopédia</button>
        <button onClick={() => setActiveTab("notes")} className="tab">Anotações</button>
      </div>

      {activeTab === "turns" && <Turns rpgId={rpgId} />}
      {activeTab === "lore" && <Lore rpgId={rpgId} />}

      {activeTab === "chat" && <div>Em construção...</div>}
      {activeTab === "characters" && <div>Em construção...</div>}
      {activeTab === "notes" && <div>Em construção...</div>}
    </div>
  )
}