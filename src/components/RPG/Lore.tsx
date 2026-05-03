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
  const [isOwner, setIsOwner] = useState(false)
  const [openCategories, setOpenCategories] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token")

        // 📚 LORE
        const loreData = await getLore(rpgId)
        setLore(Array.isArray(loreData) ? loreData : [])

        // 📂 CATEGORIAS
        const catRes = await axios.get(
          `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
        )

        const cats = catRes.data || []
        setCategories(cats)

        if (cats.length > 0) {
          setCategory(cats[0])
        }

        // 👑 VERIFICAR OWNER (AGORA CORRETO)
        const res = await axios.get(
  `http://127.0.0.1:8001/rpgs/${rpgId}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
)
 console.log("RPG DATA:", res.data)

setIsOwner(res.data.is_owner)

        const owner = res.data.is_owner
        setIsOwner(owner)

        // 💡 SUGESTÕES (SÓ SE FOR DONO)
        if (owner) {
          const res = await axios.get(
            `http://127.0.0.1:8001/rpg-lore/${rpgId}/suggestions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          setSuggestions(res.data || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [rpgId])

  // ===============================
  // ✍️ CRIAR LORE / SUGESTÃO
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
  // ➕ CRIAR CATEGORIA
  // ===============================
  async function handleCreateCategory() {
    if (!newCategory.trim()) return

    const token = localStorage.getItem("token")

    await axios.post(
      `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`,
      { name: newCategory },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setCategories((prev) => [...prev, newCategory])
    setNewCategory("")
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

  // ===============================
  // 🔍 FILTRO
  // ===============================
  function filterItem(item: Lore) {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
    )
  }

  // ===============================
  // 📂 TOGGLE
  // ===============================
  function toggleCategory(cat: string) {
    setOpenCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    )
  }

  return (
    <div>
      {/* 🔍 BUSCA */}
      <input
        placeholder="Buscar lore..."
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ CRIAR CATEGORIA */}
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

      {/* ✍️ CRIAR LORE */}
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
      <div className="space-y-4">
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="bg-[#2a1519] rounded">
            <div
              onClick={() => toggleCategory(cat)}
              className="cursor-pointer p-3 border-b border-[#3a1f24] flex justify-between"
            >
              <span className="font-bold">📂 {cat}</span>
              <span>{openCategories.includes(cat) ? "▲" : "▼"}</span>
            </div>

            {openCategories.includes(cat) && (
              <div className="p-3 space-y-3">
                {grouped[cat]
                  .filter(filterItem)
                  .map((item) => (
                    <div key={item.id} className="bg-gray-800 p-3 rounded">
                      <h3 className="font-bold">{item.title}</h3>
                      <p>{item.content}</p>
                    </div>
                  ))}
              </div>
            )}
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