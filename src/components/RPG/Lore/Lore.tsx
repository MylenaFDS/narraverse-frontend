import { useEffect, useState, useRef } from "react"

import {
  getLore,
  createLore,
  createMapRegion,
  getMapRegions,
  updateMapRegionPosition,
  uploadMapImage,
} from "../../../services/api"

import axios from "axios"

import type { Lore } from "../../../types/lore"

import LoreMap from "./LoreMap"
import LoreCard from "./LoreCard"
import SelectedLoreModal from "./SelectedLoreModal"

type Props = {
  rpgId: number
}

type MapRegion = 
{ id: number 
  name: string 
  lore_id?: number | null 
  pos_x: number 
  pos_y: number 
  color: string 
  rpg_id: number }

  export type {
  MapRegion
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
  const [mapRegions, setMapRegions] =useState<MapRegion[]>([])
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [hasMoved, setHasMoved] =useState(false)
  const [worldMap, setWorldMap] =useState("")
  const [selectedLore, setSelectedLore] = useState<Lore | null>(null)
  const [zoom, setZoom] = useState(1.2)

const [offset, setOffset] = useState({
  x: 0,
  y: 0,
})

const [isPanning, setIsPanning] =
  useState(false)

const [panStart, setPanStart] =
  useState({
    x: 0,
    y: 0,
  })

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
      const mapData = await getMapRegions(rpgId)
       setMapRegions( 
        Array.isArray(mapData)
         ? mapData 
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
       setWorldMap(
  res.data.world_map
    ? `http://127.0.0.1:8001/${res.data.world_map}`
    : ""
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

  const createdLore = await createLore(
    rpgId,
    {
      title,
      content,
      category,
    }
  )

  // 🔥 cria região automática no mapa
  if (category === "Mundo") {
  try {
  let finalX = 0
let finalY = 0
let isTooClose = true

while (isTooClose) {
  finalX =
    Math.floor(Math.random() * 70) + 15

  finalY =
    Math.floor(Math.random() * 60) + 20

  isTooClose = mapRegions.some((region) => {
    const dx =
      region.pos_x - finalX

    const dy =
      region.pos_y - finalY

    const distance = Math.sqrt(
      dx * dx + dy * dy
    )

    return distance < 10
  })
}
   const colors = [
  "#a855f7",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
]

const color =
  colors[
    Math.floor(
      Math.random() * colors.length
    )
  ]

const newRegion =
  await createMapRegion(rpgId, {
    name: title,
    lore_id: createdLore.id,
    pos_x: finalX,
    pos_y: finalY,
    color,
  })

setMapRegions((prev) => [
  ...prev,
  newRegion,
])
  } catch (err) {
    console.error(
      "Erro criando região:",
      err
    )
  }
}

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
  const [draggingRegion, setDraggingRegion] =
  useState<number | null>(null)

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

 

async function handleMouseMove(
  e: React.MouseEvent<HTMLDivElement>
) {
  if (!isOwner) return

  if (
    draggingRegion === null ||
    !mapRef.current
  )
    return

  // 🔥 detecta movimento real
  setHasMoved(true)

  const rect =
    mapRef.current.getBoundingClientRect()

  const x =
    ((e.clientX - rect.left) /
      rect.width) *
    100

  const y =
    ((e.clientY - rect.top) /
      rect.height) *
    100

  const finalX = Math.max(
    5,
    Math.min(95, x)
  )

  const finalY = Math.max(
    5,
    Math.min(95, y)
  )

  setMapRegions((prev) =>
    prev.map((r) =>
      r.id === draggingRegion
        ? {
            ...r,
            pos_x: finalX,
            pos_y: finalY,
          }
        : r
    )
  )
}

async function handleMouseUp() {
  if (draggingRegion === null)
    return

  const region = mapRegions.find(
    (r) => r.id === draggingRegion
  )

  if (!region) return

  try {
    await updateMapRegionPosition(
      region.id,
      {
        pos_x: Math.round(region.pos_x),
        pos_y: Math.round(region.pos_y),
      }
    )
  } catch (err) {
    console.error(err)
  }

  setDraggingRegion(null)

setTimeout(() => {
  setHasMoved(false)
}, 0)
}

// ===============================
// ✋ PAN DO MAPA
// ===============================
function handlePanStart(
  e: React.MouseEvent<HTMLDivElement>
) {
  // 🔥 não inicia pan enquanto arrasta região
  if (draggingRegion !== null)
    return

  setIsPanning(true)

  setPanStart({
    x: e.clientX - offset.x,
    y: e.clientY - offset.y,
  })
}

function handlePanMove(
  e: React.MouseEvent<HTMLDivElement>
) {
  if (!isPanning) return

  const newX =
    e.clientX - panStart.x

  const newY =
    e.clientY - panStart.y

  // 🔥 limite igual Google Maps
  const limit = 250 * (zoom - 1)

  setOffset({
    x: Math.max(
      -limit,
      Math.min(limit, newX)
    ),

    y: Math.max(
      -limit,
      Math.min(limit, newY)
    ),
  })
}

function handlePanEnd() {
  setIsPanning(false)
}

// ===============================
// 🔍 ZOOM SCROLL
// ===============================
function handleWheel(
  e: React.WheelEvent<HTMLDivElement>
) {
  e.preventDefault()

  const delta =
    e.deltaY > 0 ? -0.1 : 0.1

  setZoom((prev: number) =>
    Math.min(
      3,
      Math.max(1, prev + delta)
    )
  )
}
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
      
      <LoreMap
  worldMap={worldMap}
  mapRegions={mapRegions}
  lore={lore}
  zoom={zoom}
  offset={offset}
  isPanning={isPanning}
  isOwner={isOwner}
  hasMoved={hasMoved}
  mapRef={mapRef}
  setZoom={setZoom}
  setOffset={setOffset}
  setSelectedLore={setSelectedLore}
  setDraggingRegion={setDraggingRegion}
  setHasMoved={setHasMoved}
  handlePanStart={handlePanStart}
  handlePanMove={handlePanMove}
  handlePanEnd={handlePanEnd}
  handleMouseMove={handleMouseMove}
  handleMouseUp={handleMouseUp}
  handleWheel={handleWheel}
/>

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

    {/* 🔥 UPLOAD MAPA */}
    <div className="mb-6">
      <label className="block mb-2 text-sm text-gray-400">
        Upload do mapa do mundo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file =
            e.target.files?.[0]

          if (!file) return

          try {
            const data =
              await uploadMapImage(
                rpgId,
                file
              )

            setWorldMap(
  `http://127.0.0.1:8001/${data.world_map}`
)
          } catch (err) {
            console.error(err)
          }
        }}
      />
    </div>

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
  {Object.keys(grouped).map((cat) => (
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
          .filter((item) => {
            return (
              item.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              item.content
                .toLowerCase()
                .includes(search.toLowerCase())
            )
          })
          .map((item) => (
            <LoreCard
              key={item.id}
              item={item}
              isOwner={!!isOwner}
              editingId={editingId}
              editTitle={editTitle}
              editContent={editContent}
              setEditTitle={setEditTitle}
              setEditContent={setEditContent}
              setEditingId={setEditingId}
              handleSaveEdit={handleSaveEdit}
              handleDelete={handleDelete}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
            />
          ))}
      </div>
    </div>
  ))}
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
        <SelectedLoreModal
  selectedLore={selectedLore}
  onClose={() => setSelectedLore(null)}
/>
    </div>
  )
}