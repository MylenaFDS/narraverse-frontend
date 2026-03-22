import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getTurns, createTurn } from "../services/api"
import type { RPGTurn } from "../types/turn"

export default function RPG() {
  const { id } = useParams()
  const rpgId = Number(id)

  const [turns, setTurns] = useState<RPGTurn[]>([])
  const [content, setContent] = useState("")

  async function loadTurns() {
  const data = await getTurns(rpgId)
  setTurns(data)
}

 useEffect(() => {
  async function fetchTurns() {
    const data = await getTurns(rpgId)
    setTurns(data)
  }

  fetchTurns()
}, [rpgId])

  async function handleCreateTurn() {
    if (!content) return

    await createTurn(rpgId, content)
    setContent("")
    loadTurns()
  }

  return (
    <div className="max-w-2xl mx-auto">

      <h2 className="text-2xl mb-4">RPG #{id}</h2>

      {/* Criar turno */}
      <div className="mb-6">
        <textarea
          className="w-full p-3 rounded bg-gray-800"
          placeholder="Escreva seu turno..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleCreateTurn}
          className="mt-2 bg-purple-600 px-4 py-2 rounded hover:bg-purple-500"
        >
          Enviar turno
        </button>
      </div>

      {/* Lista de turnos */}
      <div className="space-y-4">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className="bg-gray-800 p-4 rounded-xl"
          >
            <p>{turn.content}</p>

            <span className="text-sm text-gray-400">
              Usuário: {turn.user_id}
            </span>

            {/* 🔥 resposta */}
            {turn.reply_to_turn_id && (
              <p className="text-xs text-purple-400">
                Respondendo ao turno #{turn.reply_to_turn_id}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}