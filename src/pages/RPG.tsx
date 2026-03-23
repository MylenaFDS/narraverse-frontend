import { useParams } from "react-router-dom"
import { useState } from "react"

import Turns from "../components/RPG/Turns"
import Lore from "../components/RPG/Lore"

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [activeTab, setActiveTab] = useState("turns")

  return (
    <div className="max-w-3xl mx-auto text-white">

      <h2 className="text-2xl mb-4">RPG #{id}</h2>

      {/* MENU */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button onClick={() => setActiveTab("turns")} className="tab">Turnos</button>
        <button onClick={() => setActiveTab("chat")} className="tab">Chat</button>
        <button onClick={() => setActiveTab("characters")} className="tab">Fichas</button>
        <button onClick={() => setActiveTab("lore")} className="tab">Enciclopédia</button>
        <button onClick={() => setActiveTab("notes")} className="tab">Anotações</button>
      </div>

      {/* CONTEÚDO */}
      {activeTab === "turns" && <Turns rpgId={rpgId} />}

      {activeTab === "chat" && <div>Chat em construção...</div>}
      {activeTab === "characters" && <div>Fichas em construção...</div>}
      {activeTab === "lore" && <Lore rpgId={rpgId} />}
      {activeTab === "notes" && <div>Anotações em construção...</div>}
    </div>
  )
}