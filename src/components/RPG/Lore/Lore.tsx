import { useEffect, useState } from "react"

import {
  updateMapRegionPosition,
  uploadMapImage,
  updateLore,
  approveLoreSuggestion,
  getTimeline,
  getFactions,
  type RPGFaction,
} from "../../../services/api"



import type { Lore } from "../../../types/lore"

import LoreMap from "./LoreMap"
import LoreCard from "./LoreCard"
import SelectedLoreModal from "./SelectedLoreModal"
import { useLoreMap } from "./hooks/useLoreMap"
import { useLore } from "./hooks/useLore"
import { groupLore } from "./utils/groupLore"
import RPGTimeline from "../RPGTimeline"
import FactionCard from "./FactionCard"
import FactionModal from "./FactionModal"

type Props = {
  rpgId: number
  setPublicCharacterId: React.Dispatch<
    React.SetStateAction<number | null>
  >
  highlightedTimelineEventId: number | null
  setHighlightedTimelineEventId: React.Dispatch<
    React.SetStateAction<number | null>
  >
  onFocusTurn: (turnId: number) => void
  highlightedLoreId: number | null
setHighlightedLoreId: React.Dispatch<
  React.SetStateAction<number | null>
>
focusLoreId: number | null
setFocusLoreId: React.Dispatch<
  React.SetStateAction<number | null>
>
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

type TimelineEvent = {
  id: number
  title: string
  content?: string
  date_label?: string
  lore_id?: number | null
  lore?: {
    id: number
    title: string
  } | null
}

export default function Lore({
  rpgId,
  setPublicCharacterId,
  highlightedTimelineEventId,
  setHighlightedTimelineEventId,
  onFocusTurn,
  highlightedLoreId,
setHighlightedLoreId,
focusLoreId,
setFocusLoreId,
}: Props) {
 
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [timelineEvents, setTimelineEvents] =useState<TimelineEvent[]>([])
  const [factions, setFactions] =
  useState<RPGFaction[]>([])
  const [selectedTimelineEvent, setSelectedTimelineEvent] =
  useState<TimelineEvent | null>(null)
  const [
  selectedFactionId,
  setSelectedFactionId,
] = useState<number | null>(null)
  
  
  const {
  lore,
  setLore,

  suggestions,
  setSuggestions,

  categories,
  

  mapRegions,
  setMapRegions,

  title,
  setTitle,

  content,
  setContent,

  category,
  setCategory,

  search,
  setSearch,

  newCategory,
  setNewCategory,

  worldMap,
  setWorldMap,

  isOwner,

  editingId,
  setEditingId,

  editTitle,
  setEditTitle,

  editContent,
  setEditContent,

  handleCreate,
  handleDelete,
  handleCreateCategory,
  load,
} = useLore(rpgId)
 
  const {
  mapRef,

  selectedLore,
  setSelectedLore,

  zoom,
  setZoom,

  offset,
  setOffset,

  isPanning,

  setDraggingRegion,

  hasMoved,
  setHasMoved,

  handleMouseMove,
  handleMouseUp,

  handlePanStart,
  handlePanMove,
  handlePanEnd,

  handleWheel,
} = useLoreMap({
  lore,
  mapRegions,
  setMapRegions,
  updateMapRegionPosition,
})

useEffect(() => {
  let mounted = true

  async function loadTimeline() {
    try {
      const [
  timelineData,
  factionsData,
] = await Promise.all([
  getTimeline(rpgId),
  getFactions(rpgId),
])

if (mounted) {
  setTimelineEvents(
    timelineData || []
  )

  setFactions(
    factionsData || []
  )
  }
    } catch (err) {
      console.error(err)
    }
  }

  void loadTimeline()

  return () => {
    mounted = false
  }
}, [rpgId])
 

  // ===============================
// ✍️ CRIAR
// ===============================


  // ===============================
  // ✏️ EDITAR
  // ===============================
  async function handleSaveEdit(
  id: number
) {
  const currentLore =
    lore.find((l) => l.id === id)

  await updateLore(id, {
    title: editTitle,
    content: editContent,
    category:
      currentLore?.category ??
      "Mundo",
  })

  await load()

  setEditingId(null)
}
  // ===============================
  // 🗑️ DELETAR
  // ===============================
  

  

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
// ✋ PAN DO MAPA
// ===============================


// ===============================
// 📂 AGRUPAR
// ===============================
const grouped =
  groupLore(lore)

const normalizedSearch =
  search.trim().toLowerCase()

const searchResults =
  normalizedSearch.length > 0
    ? lore.filter((item) =>
        item.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.content
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.category ?? "")
  .toLowerCase()
  .includes(normalizedSearch)
      )
    : []

  const timelineSearchResults =
  normalizedSearch.length > 0
    ? timelineEvents.filter((event) =>
        event.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        (event.content ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (event.date_label ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (event.lore?.title ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : []

  console.log("LORE:", lore)
console.log("MAP REGIONS:", mapRegions)
console.log("WORLD MAP:", worldMap)

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
{normalizedSearch.length > 0 && (
  <div className="mb-8 rpg-panel">
    <h2 className="text-xl font-display text-[#e0a96d] mb-4">
      🔍 Resultados
    </h2>

    {searchResults.length > 0 ? (
      <div className="space-y-2">
        {searchResults.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setSelectedLore(item)
            }
            className="
              block
              w-full
              text-left
              rounded-xl
              border
              border-[#e0a96d]/10
              bg-black/20
              px-4
              py-3
              hover:border-[#e0a96d]/40
              hover:bg-[#e0a96d]/10
              transition
            "
          >
            <p className="text-[#f2e9e4] font-semibold">
              {item.title}
            </p>

            <p className="text-xs text-[#c9ada7]/60">
              {item.category}
            </p>
          </button>
        ))}
      </div>
    ) : (
      <p className="text-[#c9ada7]/60">
        Nenhum resultado encontrado.
      </p>
    )}
    {timelineSearchResults.length > 0 && (
  <div className="mt-5">
    <h3 className="text-[#e0a96d] font-display mb-3">
      📜 Timeline
    </h3>

    <div className="space-y-2">
      {timelineSearchResults.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() =>
  setSelectedTimelineEvent(event)
}
          className="
            block
            w-full
            text-left
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            px-4
            py-3
            hover:border-[#e0a96d]/40
            hover:bg-[#e0a96d]/10
            transition
          "
        >
          <p className="text-[#f2e9e4] font-semibold">
            {event.title}
          </p>

          <p className="text-xs text-[#c9ada7]/60">
            {event.date_label || "Sem data"}
            {event.lore?.title
              ? ` • ${event.lore.title}`
              : ""}
          </p>
        </button>
      ))}
    </div>
  </div>
)}
  </div>
)}

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
  highlightedLoreId={highlightedLoreId}
  focusLoreId={focusLoreId}
  setFocusLoreId={setFocusLoreId}
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
  {Object.keys(grouped)
  .filter((cat) => {
    return grouped[cat].some(
      (item) =>
        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.content
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    )
  })
  .map((cat) => (
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
    isHighlighted={
      highlightedLoreId === item.id
    }
  />
))}
      </div>
    </div>
  ))}
</div>

{/* FACÇÕES */}

{factions.length > 0 && (
  <div className="mt-16">
    <h2
      className="
        text-3xl
        font-black
        mb-6
        text-[#e0a96d]
      "
    >
      🛡️ Facções
    </h2>

    <div className="space-y-3">
      {factions.map((faction) => (
        <FactionCard
  key={faction.id}
  faction={faction}
  onClick={() =>
    setSelectedFactionId(faction.id)
  }
/>
      ))}
    </div>
  </div>
)}

{/* LINHA DO TEMPO */}

<div className="mt-16">
  <RPGTimeline
    rpgId={rpgId}
    setPublicCharacterId={
      setPublicCharacterId
    }
    isOwner={!!isOwner}
    lore={lore}
    setSelectedLore={setSelectedLore}
    setHighlightedLoreId={setHighlightedLoreId}
    setFocusLoreId={setFocusLoreId}
    highlightedTimelineEventId={highlightedTimelineEventId}
    onFocusTurn={onFocusTurn}
    setSelectedFactionId={setSelectedFactionId}
  />
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
  await approveLoreSuggestion(
    item.id
  )

  await load()

  setSuggestions(
    (prev) =>
      prev.filter(
        (s) =>
          s.id !== item.id
      )
  )
}}>
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
  lore={lore}
  setSelectedLore={setSelectedLore}
  setHighlightedTimelineEventId={setHighlightedTimelineEventId}
  setPublicCharacterId={setPublicCharacterId}
  onClose={() => setSelectedLore(null)}
/>
{selectedTimelineEvent && (
  <div
    className="
      fixed
      right-4
      top-4
      w-[400px]
      max-h-[90vh]
      overflow-y-auto
      bg-[#18181b]
      p-6
      rounded-2xl
      border
      border-[#2b2b31]
      z-50
    "
  >
    <h2 className="text-2xl font-bold mb-2 text-[#e0a96d]">
      📜 {selectedTimelineEvent.title}
    </h2>

    <p className="text-sm text-[#c9ada7]/70 mb-4">
      {selectedTimelineEvent.date_label || "Sem data"}
    </p>

    <p className="whitespace-pre-wrap text-gray-300">
      {selectedTimelineEvent.content}
    </p>

    {selectedTimelineEvent.lore && (
      <button
        type="button"
        onClick={() => {
          const loreItem = lore.find(
            (item) =>
              item.id === selectedTimelineEvent.lore?.id
          )

          if (loreItem) {
  setSelectedLore(loreItem)
  setHighlightedLoreId(loreItem.id)
  setFocusLoreId(loreItem.id)

  setTimeout(() => {
    setHighlightedLoreId(null)
  }, 2500)
}
        }}
        className="
          mt-4
          block
          text-[#e0a96d]
          hover:text-[#f2c078]
          transition
        "
      >
        📍 {selectedTimelineEvent.lore.title}
      </button>
    )}

    <button
      type="button"
      onClick={() =>
        setSelectedTimelineEvent(null)
      }
      className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
    >
      Fechar
    </button>
  </div>
)}

<FactionModal
  factionId={selectedFactionId}
  setPublicCharacterId={setPublicCharacterId}
  onClose={() => setSelectedFactionId(null)}
/>
    </div>
  )
  
}

