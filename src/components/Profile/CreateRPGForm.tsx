import { useState } from "react"
import { createRPG } from "../../services/api"

type Props = {
  onCreated?: () => void
}

export default function CreateRPGForm({ onCreated }: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [allowJoinRequests, setAllowJoinRequests] = useState(true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) return

    await createRPG({
      name,
      description,
      allow_join_requests: allowJoinRequests,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    setName("")
    setDescription("")
    setTags("")
    setAllowJoinRequests(true)

    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="rpg-panel space-y-4">
      <h2 className="text-2xl font-display text-[#e0a96d]">
        Criar novo mundo
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do mundo"
        className="rpg-input w-full"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição do mundo"
        className="rpg-input w-full min-h-[120px] resize-y"
      />

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags: Fantasia, Romance, Terror..."
        className="rpg-input w-full"
      />

      <label className="flex items-center gap-2 text-[#c9ada7]">
        <input
          type="checkbox"
          checked={allowJoinRequests}
          onChange={(e) => setAllowJoinRequests(e.target.checked)}
        />
        Permitir pedidos de entrada
      </label>

      <button type="submit" className="rpg-btn">
        Criar mundo
      </button>
    </form>
  )
}