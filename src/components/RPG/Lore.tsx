import { useEffect, useState } from "react"
import { getLore, createLore } from "../../services/api"
import axios from "axios"
import type { Lore } from "../../types/lore"

type Props = {
  rpgId: number
}

export default function Lore({ rpgId }: Props) {
  const [lore, setLore] = useState<Lore[]>([])
  const [suggestions, setSuggestions] = useState<Lore[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [isOwner, setIsOwner] = useState<boolean | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const [draggedId, setDraggedId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token")

        const loreData = await getLore(rpgId)
        setLore(Array.isArray(loreData) ? loreData : [])

        const catRes = await axios.get(
          `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
        )

        const cats = catRes.data || []
        setCategories(cats)

        if (cats.length > 0) setCategory(cats[0])

        // 👑 OWNER
        const res = await axios.get(
          `http://127.0.0.1:8001/rpgs/${rpgId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const owner = res.data.is_owner
        setIsOwner(owner)

        if (owner) {
          const sug = await axios.get(
            `http://127.0.0.1:8001/rpg-lore/${rpgId}/suggestions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          setSuggestions(sug.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [rpgId])

  // ===============================
  // ✍️ CRIAR
  // ===============================
  async function handleCreate() {
    if (!title || !content || !category) return

    await createLore(rpgId, { title, content, category })

    setTitle("")
    setContent("")

    const data = await getLore(rpgId)
    setLore(Array.isArray(data) ? data : [])
  }

  // ===============================
  // ✏️ EDITAR
  // ===============================
  async function handleSaveEdit(id: number) {
    const token = localStorage.getItem("token")

    await axios.put(
      `http://127.0.0.1:8001/rpg-lore/${id}`,
      {
        title: editTitle,
        content: editContent,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const data = await getLore(rpgId)
    setLore(Array.isArray(data) ? data : [])
    setEditingId(null)
  }

  // ===============================
  // ➕ CATEGORIA
  // ===============================
  async function handleCreateCategory() {
    if (!newCategory.trim()) return

    const token = localStorage.getItem("token")

    await axios.post(
      `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`,
      { name: newCategory },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    setCategories((prev) => [...prev, newCategory])
    setNewCategory("")
  }

  // ===============================
  // 🔄 DRAG
  // ===============================
  function handleDragStart(id: number) {
    setDraggedId(id)
  }

  function handleDrop(targetId: number) {
    if (draggedId === null) return

    const newLore = [...lore]
    const fromIndex = newLore.findIndex((l) => l.id === draggedId)
    const toIndex = newLore.findIndex((l) => l.id === targetId)

    const [moved] = newLore.splice(fromIndex, 1)
    newLore.splice(toIndex, 0, moved)

    setLore(newLore)
    setDraggedId(null)
  }

  // ===============================
  // 📂 AGRUPAR
  // ===============================
  const grouped = lore.reduce<Record<string, Lore[]>>((acc, item) => {
    const cat = item.category || "Sem categoria"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  function filterItem(item: Lore) {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
    )
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div>
      {/* 🔍 BUSCA */}
      <input
        placeholder="Buscar..."
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* OWNER */}
      {isOwner && (
        <div className="mb-4">
          <input
            placeholder="Nova categoria"
            className="w-full p-2 mb-2 bg-gray-800 rounded"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={handleCreateCategory}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Criar categoria
          </button>
        </div>
      )}

      {/* CRIAR */}
      <div className="mb-6">
        <input
          placeholder="Título"
          className="w-full p-2 mb-2 bg-gray-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-800 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

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
          {isOwner ? "Criar lore" : "Enviar sugestão"}
        </button>
      </div>

      {/* 📚 WIKI */}
      <div className="space-y-6">
        {Object.keys(grouped).map((cat) => (
          <div key={cat}>
            <h2 className="text-xl font-bold mb-2">📂 {cat}</h2>

            {grouped[cat].filter(filterItem).map((item) => (
              <div
                key={item.id}
                draggable={isOwner || false}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
                className="bg-gray-800 p-3 mb-2 rounded cursor-pointer"
              >
                {editingId === item.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(item.id)}
                      className="w-full bg-gray-700 mb-2 p-1"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onBlur={() => handleSaveEdit(item.id)}
                      className="w-full bg-gray-700 p-1"
                    />
                  </>
                ) : (
                  <>
                    <h3
                      className="font-bold"
                      onClick={() => {
                        if (!isOwner) return
                        setEditingId(item.id)
                        setEditTitle(item.title)
                        setEditContent(item.content)
                      }}
                    >
                      {item.title}
                    </h3>
                    <p>{item.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 💡 SUGESTÕES */}
      {isOwner && (
        <div className="mt-8">
          <h2 className="text-lg mb-2">💡 Sugestões</h2>

          {suggestions.map((item) => (
            <div key={item.id} className="bg-gray-800 p-3 mb-2 rounded">
              <h3>{item.title}</h3>
              <p>{item.content}</p>

              <button
                onClick={async () => {
                  const token = localStorage.getItem("token")

                  await axios.put(
                    `http://127.0.0.1:8001/rpg-lore/${item.id}/approve`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )

                  const data = await getLore(rpgId)
                  setLore(Array.isArray(data) ? data : [])
                }}
                className="mt-2 bg-green-600 px-3 py-1 rounded"
              >
                Aprovar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}