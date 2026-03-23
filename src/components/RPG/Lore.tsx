import { useEffect, useState } from "react"
import { getLore, createLore } from "../../services/api"
import type { Lore } from "../../types/lore"

type Props = {
  rpgId: number
}

export default function Lore({ rpgId }: Props) {
  const [lore, setLore] = useState<Lore[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    async function fetchLore() {
      const data = await getLore(rpgId)
      setLore(data)
    }

    fetchLore()
  }, [rpgId])

  async function handleCreate() {
    if (!title || !content) return

    await createLore(rpgId, { title, content })

    setTitle("")
    setContent("")

    const data = await getLore(rpgId)
    setLore(data)
  }

  return (
    <div>
      <div className="mb-6">
        <input
          placeholder="Título"
          className="w-full p-2 mb-2 bg-gray-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Conteúdo"
          className="w-full p-2 bg-gray-800 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="mt-2 bg-purple-600 px-4 py-2 rounded"
        >
          Criar lore
        </button>
      </div>

      <div className="space-y-4">
        {lore.map((item) => (
          <div key={item.id} className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}