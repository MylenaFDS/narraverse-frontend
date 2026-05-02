import { useEffect, useState } from "react"
import {
  getLore,
  createLore,
  updateLore,
  deleteLore,
} from "../../services/api"
import type { Lore } from "../../types/lore"

type Props = {
  rpgId: number
}

export default function Lore({ rpgId }: Props) {
  const [lore, setLore] = useState<Lore[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)

  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchLore() {
      try {
        setLoading(true)
        const data = await getLore(rpgId)
        setLore(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Erro ao carregar lore:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLore()
  }, [rpgId])

  async function handleCreate() {
    if (!title.trim() || !content.trim()) return

    try {
      setCreating(true)

      const newLore = await createLore(rpgId, { title, content })

      setLore((prev) => [newLore, ...prev])

      setTitle("")
      setContent("")
    } catch (err) {
      console.error("Erro ao criar lore:", err)
    } finally {
      setCreating(false)
    }
  }

  function startEdit(item: Lore) {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditContent(item.content)
  }

  async function handleSaveEdit(id: number) {
    try {
      setSavingEdit(true)

      const updated = await updateLore(id, {
        title: editTitle,
        content: editContent,
      })

      setLore((prev) =>
        prev.map((l) => (l.id === id ? updated : l))
      )

      setEditingId(null)
    } catch (err) {
      console.error("Erro ao editar:", err)
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("Excluir esta lore?")
    if (!confirmDelete) return

    try {
      setDeletingId(id)

      await deleteLore(id)

      setLore((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      console.error("Erro ao deletar:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* CRIAÇÃO */}
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
          disabled={creating}
          className="mt-2 bg-purple-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {creating ? "Criando..." : "Criar lore"}
        </button>
      </div>

      {/* LISTA */}
      {loading ? (
        <p className="text-gray-400">Carregando lore...</p>
      ) : lore.length === 0 ? (
        <p className="text-gray-400">Nenhuma lore ainda</p>
      ) : (
        <div className="space-y-4">
          {lore.map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded">
              {editingId === item.id ? (
                <>
                  <input
                    className="w-full p-2 mb-2 bg-gray-700 rounded"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full p-2 bg-gray-700 rounded"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={savingEdit}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      {savingEdit ? "Salvando..." : "Salvar"}
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-600 px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-purple-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 whitespace-pre-wrap">
                    {item.content}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-400 text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-400 text-sm"
                    >
                      {deletingId === item.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}