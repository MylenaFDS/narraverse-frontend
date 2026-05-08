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

        setLore(
          Array.isArray(loreData)
            ? loreData
            : []
        )

        const catRes = await axios.get(
          `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
        )

        const cats = catRes.data || []

        const finalCats = cats.includes("Mundo")
  ? cats
  : ["Mundo", ...cats]

setCategories(finalCats)

setCategory("Mundo")

        const res = await axios.get(
          `http://127.0.0.1:8001/rpgs/${rpgId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const owner = res.data.is_owner

        setIsOwner(owner)

        if (owner) {
          const sug = await axios.get(
            `http://127.0.0.1:8001/rpg-lore/${rpgId}/suggestions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
    if (!title || !content || !category)
      return

    await createLore(rpgId, {
      title,
      content,
      category,
    })

    setTitle("")
    setContent("")

    const data = await getLore(rpgId)

    setLore(
      Array.isArray(data)
        ? data
        : []
    )
  }

  // ===============================
  // ✏️ EDITAR
  // ===============================
  async function handleSaveEdit(
    id: number
  ) {
    const token =
      localStorage.getItem("token")

    await axios.put(
      `http://127.0.0.1:8001/rpg-lore/${id}`,
      {
        title: editTitle,
        content: editContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await getLore(rpgId)

    setLore(
      Array.isArray(data)
        ? data
        : []
    )

    setEditingId(null)
  }

  // ===============================
  // 🗑️ DELETAR
  // ===============================
  async function handleDelete(
    id: number
  ) {
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir esta lore?"
    )

    if (!confirmDelete) return

    const token =
      localStorage.getItem("token")

    await axios.delete(
      `http://127.0.0.1:8001/rpg-lore/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await getLore(rpgId)

    setLore(
      Array.isArray(data)
        ? data
        : []
    )
  }

  // ===============================
  // ➕ CATEGORIA
  // ===============================
  async function handleCreateCategory() {
    if (!newCategory.trim()) return

    const token =
      localStorage.getItem("token")

    try {
      await axios.post(
        `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`,
        {
          name: newCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const catRes = await axios.get(
        `http://127.0.0.1:8001/rpg-lore/${rpgId}/categories`
      )

      setCategories(catRes.data || [])

      setNewCategory("")
    } catch (err) {
      console.error(err)
    }
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

    const fromIndex =
      newLore.findIndex(
        (l) => l.id === draggedId
      )

    const toIndex =
      newLore.findIndex(
        (l) => l.id === targetId
      )

    const [moved] =
      newLore.splice(fromIndex, 1)

    newLore.splice(toIndex, 0, moved)

    setLore(newLore)

    setDraggedId(null)
  }

  // ===============================
  // 📂 AGRUPAR
  // ===============================
  const grouped = lore.reduce<
    Record<string, Lore[]>
  >((acc, item) => {
    const cat =
      item.category || "Sem categoria"

    if (!acc[cat]) {
      acc[cat] = []
    }

    acc[cat].push(item)

    return acc
  }, {})

  // ===============================
  // 🔍 FILTRO
  // ===============================
  function filterItem(item: Lore) {
    return (
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.content
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }
const worldLore = lore.filter(
  (item) => item.category === "Mundo"
)

const mapRegions = worldLore.map(
  (item, index) => {
    const positions = [
      {
        top: "20%",
        left: "25%",
        color: "bg-purple-500",
      },
      {
        bottom: "30%",
        right: "20%",
        color: "bg-red-500",
      },
      {
        top: "50%",
        right: "35%",
        color: "bg-blue-500",
      },
      {
        top: "15%",
        right: "10%",
        color: "bg-green-500",
      },
      {
        bottom: "15%",
        left: "20%",
        color: "bg-yellow-500",
      },
    ]

    const pos =
      positions[index % positions.length]

    return {
      ...item,
      ...pos,
    }
  }
)
  // ===============================
  // UI
  // ===============================
  return (
    <div className="max-w-6xl mx-auto text-gray-100">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">
          📚 Enciclopédia do RPG
        </h1>

        <p className="text-gray-400">
          Organize a história,
          política, facções,
          personagens e segredos do
          mundo.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-8">
        <input
          placeholder="Buscar lore..."
          className="
            w-full
            bg-[#1c1c1f]
            border
            border-[#2a2a30]
            rounded-2xl
            p-4
            outline-none
            focus:border-purple-500
            transition
          "
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* MAPA */}
      <div
        className="
          mb-10
          bg-[#18181b]
          border
          border-[#2b2b31]
          rounded-2xl
          overflow-hidden
        "
      >
        <div className="p-5 border-b border-[#2b2b31]">
          <h2 className="text-2xl font-black">
            🗺️ Mapa do Mundo
          </h2>

          <p className="text-gray-400 mt-1">
            Futuramente você poderá
            clicar em regiões do mapa
            para abrir lores
            relacionadas.
          </p>
        </div>

        <div
          className="
            relative
            h-[420px]
            bg-gradient-to-br
            from-[#101014]
            to-[#1b1b22]
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              absolute
              inset-0
              opacity-20
              bg-[radial-gradient(circle_at_center,#7c3aed_0%,transparent_70%)]
            "
          />

          <div
            className="
              relative
              w-[80%]
              h-[75%]
              border
              border-dashed
              border-purple-500/30
              rounded-3xl
              flex
              items-center
              justify-center
            "
          >
            <span className="text-gray-500 text-lg">
              Área do mapa interativo
            </span>

            {mapRegions.map((region) => (
  <button
    key={region.id}
    title={region.title}
    className={`
      absolute
      w-5
      h-5
      rounded-full
      ${region.color}

      shadow-lg
      hover:scale-125
      transition
    `}
    style={{
      top: region.top,
      left: region.left,
      right: region.right,
      bottom: region.bottom,
    }}
    onClick={() => {
      const el = document.getElementById(
        `lore-${region.id}`
      )

      el?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }}
  />
))}
          </div>
        </div>
        
      </div>

      {/* ADMIN */}
      {isOwner && (
        <div
          className="
            bg-[#18181b]
            border
            border-[#2b2b31]
            rounded-2xl
            p-5
            mb-8
          "
        >
          <h2 className="text-lg font-bold mb-4">
            ⚙️ Administração
          </h2>

          <div className="flex gap-3">
            <input
              placeholder="Nova categoria"
              className="
                flex-1
                bg-[#232329]
                border
                border-[#32323a]
                rounded-xl
                p-3
              "
              value={newCategory}
              onChange={(e) =>
                setNewCategory(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleCreateCategory
              }
              className="
                bg-blue-600
                hover:bg-blue-500
                transition
                px-5
                rounded-xl
                font-semibold
              "
            >
              Criar
            </button>
          </div>
        </div>
      )}

      {/* CREATE */}
      <div
        className="
          bg-[#18181b]
          border
          border-[#2b2b31]
          rounded-2xl
          p-6
          mb-10
        "
      >
        <h2 className="text-xl font-bold mb-4">
          {isOwner
            ? "✍️ Nova Lore"
            : "💡 Enviar Sugestão"}
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Título"
            className="
              w-full
              bg-[#232329]
              border
              border-[#32323a]
              rounded-xl
              p-3
            "
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="
              w-full
              bg-[#232329]
              border
              border-[#32323a]
              rounded-xl
              p-3
            "
          >
            {categories.map((cat) => (
              <option key={cat}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Conteúdo..."
            className="
              w-full
              bg-[#232329]
              border
              border-[#32323a]
              rounded-xl
              p-4
              min-h-[180px]
            "
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          />

          <button
            onClick={handleCreate}
            className="
              bg-purple-600
              hover:bg-purple-500
              transition
              px-5
              py-3
              rounded-xl
              font-semibold
            "
          >
            {isOwner
              ? "Criar lore"
              : "Enviar sugestão"}
          </button>
        </div>
      </div>

      {/* WIKI */}
      <div className="space-y-10">
        {Object.keys(grouped).map(
          (cat) => (
            <div key={cat}>
              <div
                className="
                  sticky
                  top-0
                  z-10
                  bg-[#0f0f12]
                  py-3
                  mb-4
                  border-b
                  border-[#2a2a30]
                "
              >
                <h2 className="text-2xl font-black">
                  📂 {cat}
                </h2>
              </div>

              <div className="space-y-3">
                {grouped[cat]
                  .filter(filterItem)
                  .map((item) => (
                    <div
                     id={`lore-${item.id}`}
                      key={item.id}
                      draggable={
                        isOwner || false
                      }
                      onDragStart={() =>
                        handleDragStart(
                          item.id
                        )
                      }
                      onDragOver={(e) =>
                        e.preventDefault()
                      }
                      onDrop={() =>
                        handleDrop(
                          item.id
                        )
                      }
                      className="
                        group
                        bg-[#18181b]
                        border
                        border-[#26262c]
                        hover:border-[#3a3a45]
                        rounded-2xl
                        p-5
                        transition
                      "
                    >
                      {editingId ===
                      item.id ? (
                        <>
                          <input
                            value={
                              editTitle
                            }
                            onChange={(
                              e
                            ) =>
                              setEditTitle(
                                e.target
                                  .value
                              )
                            }
                            className="
                              w-full
                              bg-[#232329]
                              border
                              border-[#32323a]
                              rounded-lg
                              p-2
                              mb-3
                              text-xl
                              font-bold
                            "
                          />

                          <textarea
                            value={
                              editContent
                            }
                            onChange={(
                              e
                            ) =>
                              setEditContent(
                                e.target
                                  .value
                              )
                            }
                            className="
                              w-full
                              bg-[#232329]
                              border
                              border-[#32323a]
                              rounded-lg
                              p-3
                              min-h-[160px]
                            "
                          />

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() =>
                                handleSaveEdit(
                                  item.id
                                )
                              }
                              className="
                                bg-green-600
                                hover:bg-green-500
                                px-4
                                py-2
                                rounded-lg
                              "
                            >
                              Salvar
                            </button>

                            <button
                              onClick={() =>
                                setEditingId(
                                  null
                                )
                              }
                              className="
                                bg-gray-700
                                hover:bg-gray-600
                                px-4
                                py-2
                                rounded-lg
                              "
                            >
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-3">
                              {
                                item.title
                              }
                            </h3>

                            <p
                              className="
                                text-gray-300
                                whitespace-pre-wrap
                                leading-relaxed
                              "
                            >
                              {
                                item.content
                              }
                            </p>
                          </div>

                          {/* BOTÕES */}
                          {isOwner && (
                            <div
                              className="
                                mt-5
                                pt-4

                                border-t
                                border-[#2a2a30]

                                opacity-0
                                group-hover:opacity-100

                                transition-all
                                duration-200

                                flex
                                items-center
                                gap-2
                              "
                            >
                              {/* EDITAR */}
                              <button
                                onClick={() => {
                                  setEditingId(
                                    item.id
                                  )

                                  setEditTitle(
                                    item.title
                                  )

                                  setEditContent(
                                    item.content
                                  )
                                }}
                                className="
                                  flex
                                  items-center
                                  gap-2

                                  bg-[#232329]
                                  hover:bg-yellow-500/15

                                  border
                                  border-[#34343c]
                                  hover:border-yellow-500/40

                                  text-gray-300
                                  hover:text-yellow-300

                                  px-3
                                  py-2

                                  rounded-xl

                                  transition-all
                                  duration-200

                                  shadow-sm
                                  hover:shadow-yellow-500/10
                                "
                              >
                                <span className="text-sm">
                                  ✏️
                                </span>

                                <span className="text-sm font-medium">
                                  Editar
                                </span>
                              </button>

                              {/* DELETAR */}
                              <button
                                onClick={() =>
                                  handleDelete(
                                    item.id
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-2

                                  bg-[#232329]
                                  hover:bg-red-500/15

                                  border
                                  border-[#34343c]
                                  hover:border-red-500/40

                                  text-gray-300
                                  hover:text-red-300

                                  px-3
                                  py-2

                                  rounded-xl

                                  transition-all
                                  duration-200

                                  shadow-sm
                                  hover:shadow-red-500/10
                                "
                              >
                                <span className="text-sm">
                                  🗑️
                                </span>

                                <span className="text-sm font-medium">
                                  Excluir
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* SUGESTÕES */}
      {isOwner &&
        suggestions.length >
          0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-black mb-6">
              💡 Sugestões
              Pendentes
            </h2>

            <div className="space-y-4">
              {suggestions.map(
                (item) => (
                  <div
                    key={item.id}
                    className="
                      bg-[#18181b]
                      border
                      border-yellow-700/40
                      rounded-2xl
                      p-5
                    "
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                      {
                        item.content
                      }
                    </p>

                    <button
                      onClick={async () => {
                        const token =
                          localStorage.getItem(
                            "token"
                          )

                        await axios.put(
                          `http://127.0.0.1:8001/rpg-lore/${item.id}/approve`,
                          {},
                          {
                            headers:
                              {
                                Authorization: `Bearer ${token}`,
                              },
                          }
                        )

                        const data =
                          await getLore(
                            rpgId
                          )

                        setLore(
                          Array.isArray(
                            data
                          )
                            ? data
                            : []
                        )

                        setSuggestions(
                          (
                            prev
                          ) =>
                            prev.filter(
                              (
                                s
                              ) =>
                                s.id !==
                                item.id
                            )
                        )
                      }}
                      className="
                        bg-green-600
                        hover:bg-green-500
                        transition
                        px-4
                        py-2
                        rounded-xl
                        font-semibold
                      "
                    >
                      Aprovar
                      sugestão
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  )
}