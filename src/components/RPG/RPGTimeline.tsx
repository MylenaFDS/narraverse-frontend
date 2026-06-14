import { useEffect, useState } from "react"


import {
  getTimeline,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  getTimelineCategories,
  createTimelineCategory,
  deleteTimelineCategory,
  getFactions,
  type TimelineCategory,
  type RPGFaction,
} from "../../services/api"

import {
  getCharacters,
} from "../../services/characters"
import type { Lore } from "../../types/lore"

type Props = {
  rpgId: number
  isOwner: boolean
  lore: Lore[]
  setSelectedLore: React.Dispatch<
    React.SetStateAction<Lore | null>
  >
  setHighlightedLoreId: React.Dispatch<
  React.SetStateAction<number | null>
>
setFocusLoreId: React.Dispatch<
  React.SetStateAction<number | null>
>
highlightedTimelineEventId: number | null
setPublicCharacterId: React.Dispatch<
  React.SetStateAction<number | null>
>
onFocusTurn: (turnId: number) => void

setSelectedFactionId: React.Dispatch<
  React.SetStateAction<number | null>
>
}

type TimelineEvent = {
  id: number
  title: string
  content?: string
  date_label?: string

  lore_id?: number | null
  turn_id?: number | null
  category_id?: number | null

  characters?: {
  id: number
  name: string
}[]

  factions?: {
  id: number
  name: string
}[]

  lore?: {
    id: number
    title: string
  } | null

  category?: {
    id: number
    name: string
  } | null
  
}

function getCategoryIcon(name?: string) {
  switch (name) {
    case "Profecia":
      return "🔮"
    case "Guerra":
      return "⚔️"
    case "Política":
      return "🏛️"
    case "Catástrofe":
      return "🌋"
    case "Descoberta":
      return "🧭"
    case "Religião":
      return "⛪"
    case "Economia":
      return "💰"
    default:
      return "📜"
  }
}

export default function RPGTimeline({
  rpgId,
  isOwner,
  lore,
  setSelectedLore,
  setHighlightedLoreId,
  setFocusLoreId,
  highlightedTimelineEventId,
  setPublicCharacterId,
  onFocusTurn,
  setSelectedFactionId,
}: Props) {
  

  const [events, setEvents] =
    useState<TimelineEvent[]>([])

  const [timelineCategories, setTimelineCategories] =
    useState<TimelineCategory[]>([])

  const [newCategory, setNewCategory] =
    useState("")

  const [title, setTitle] =
    useState("")

  const [content, setContent] =
    useState("")

  const [dateLabel, setDateLabel] =
    useState("")

  const [loreId, setLoreId] =
    useState<number | "">("")

  const [categoryId, setCategoryId] =
    useState<number | "">("")

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editTitle, setEditTitle] =
    useState("")

  const [editContent, setEditContent] =
    useState("")

  const [editDate, setEditDate] =
    useState("")

  const [editLoreId, setEditLoreId] =
    useState<number | "">("")

  const [editCategoryId, setEditCategoryId] =
    useState<number | "">("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
  useState<number | "">("")
  const [characters, setCharacters] =
  useState<
    {
      id: number
      name: string
    }[]
  >([])

const [characterIds, setCharacterIds] =
  useState<number[]>([])
  const [editCharacterIds, setEditCharacterIds] =
  useState<number[]>([])

  const [factions, setFactions] =
  useState<RPGFaction[]>([])

const [factionIds, setFactionIds] =
  useState<number[]>([])



  const worldLore = lore.filter(
    (item) => item.category === "Mundo"
  )

  useEffect(() => {
    
    let mounted = true

    async function init() {
      try {
        const [
  timelineData,
  categoriesData,
  charactersData,
  factionsData,
] = await Promise.all([
  getTimeline(rpgId),
  getTimelineCategories(rpgId),
  getCharacters(rpgId),
  getFactions(rpgId),
])

        if (mounted) {
  setEvents(timelineData || [])

  setTimelineCategories(
    [...(categoriesData || [])]
      .sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            "pt-BR"
          )
      )
  )

  setCharacters(
    charactersData || []
  )
  setFactions(
  factionsData || []
)
}
      } catch (err) {
        console.error(err)
      }
    }

    void init()

    return () => {
      mounted = false
    }
  }, [rpgId])

  async function handleCreateCategory() {
    if (!newCategory.trim()) return

    const created =
      await createTimelineCategory(
        rpgId,
        newCategory
      )

    setTimelineCategories((prev) => [
      ...prev,
      created,
    ])

    setNewCategory("")
  }

  async function handleDeleteCategory(
    id: number
  ) {
    const confirmDelete =
      window.confirm(
        "Excluir esta categoria da Timeline?"
      )

    if (!confirmDelete) return

    await deleteTimelineCategory(id)

    setTimelineCategories((prev) =>
      prev.filter((cat) => cat.id !== id)
    )
  }

  async function handleCreate() {
    const created =
      await createTimelineEvent(
        rpgId,
        {
          title,
          content,
          date_label: dateLabel,
          lore_id:
            loreId === ""
              ? null
              : Number(loreId),
          category_id:
            categoryId === ""
              ? null
              : Number(categoryId),
              character_ids: characterIds,
              faction_ids: factionIds,
        }
      )

    setEvents((prev) => [
      ...prev,
      created,
    ])

    setTitle("")
    setContent("")
    setDateLabel("")
    setLoreId("")
    setCategoryId("")
    setCharacterIds([])
    setFactionIds([])
  }

  function startEditing(
    event: TimelineEvent
  ) {
    setEditingId(event.id)
    setEditTitle(event.title)
    setEditContent(event.content ?? "")
    setEditDate(event.date_label ?? "")
    setEditLoreId(event.lore_id ?? "")
    setEditCategoryId(
      event.category_id ?? ""
    )
    setEditCharacterIds(
  event.characters?.map(
    (character) => character.id
  ) ?? []
)
  }

  async function handleUpdate(
    id: number
  ) {
    const updated =
  await updateTimelineEvent(
    id,
    {
      title: editTitle,
      content: editContent,
      date_label: editDate,
      lore_id:
        editLoreId === ""
          ? null
          : Number(editLoreId),
      category_id:
        editCategoryId === ""
          ? null
          : Number(editCategoryId),
      character_ids: editCharacterIds,
    }
  )

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? updated
          : event
      )
    )

    setEditingId(null)
    setEditLoreId("")
    setEditCategoryId("")
    setEditCharacterIds([])
  }

  async function handleDelete(
    id: number
  ) {
    await deleteTimelineEvent(id)

    setEvents((prev) =>
      prev.filter(
        (event) => event.id !== id
      )
    )
  }
  const filteredEvents =
  selectedCategoryFilter === ""
    ? events
    : events.filter(
        (event) =>
          event.category_id ===
          Number(selectedCategoryFilter)
      )

  const groupedEvents =
  filteredEvents.reduce(
      (acc, event) => {
        const key =
          event.date_label || "Sem data"

        if (!acc[key]) {
          acc[key] = []
        }

        acc[key].push(event)

        return acc
      },
      {} as Record<
        string,
        TimelineEvent[]
      >
    )

  return (
    <div className="rpg-panel">
      <h3 className="text-xl font-display text-[#e0a96d] mb-5">
        📜 Linha do Tempo
      </h3>

      {isOwner && (
        <div className="mb-6 space-y-4">
          <div className="space-y-2">
            <h4 className="text-[#e0a96d] font-display">
              Categorias da Timeline
            </h4>

            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value)
                }
                placeholder="Nova categoria"
                className="rpg-input flex-1"
              />

              <button
                type="button"
                onClick={handleCreateCategory}
                className="rpg-btn"
              >
                Criar
              </button>
            </div>

            {timelineCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {timelineCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="
                      text-xs
                      border
                      border-[#e0a96d]/20
                      rounded-full
                      px-3
                      py-1
                      text-[#f2e9e4]
                    "
                  >
                    {getCategoryIcon(cat.name)}{" "}
                    {cat.name}

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCategory(
                          cat.id
                        )
                      }
                      className="
                        ml-2
                        text-red-400
                        hover:text-red-300
                      "
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <input
            value={dateLabel}
            onChange={(e) =>
              setDateLabel(e.target.value)
            }
            placeholder="Ano / Era / Capítulo"
            className="rpg-input"
          />

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Título do evento"
            className="rpg-input"
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value
                  ? Number(e.target.value)
                  : ""
              )
            }
            className="rpg-input"
          >
            <option value="">
              Categoria do evento
            </option>

            {timelineCategories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={loreId}
            onChange={(e) =>
              setLoreId(
                e.target.value
                  ? Number(e.target.value)
                  : ""
              )
            }
            className="rpg-input"
          >
            <option value="">
              Região relacionada
            </option>

            {worldLore.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
              </option>
            ))}
          </select>
            <select
  multiple
  value={characterIds.map(String)}
  onChange={(e) =>
    setCharacterIds(
      Array.from(
        e.target.selectedOptions
      ).map((option) =>
        Number(option.value)
      )
    )
  }
  className="rpg-input h-40"
>
  {characters.map((character) => (
    <option
      key={character.id}
      value={character.id}
    >
      {character.name}
    </option>
  ))}
</select>
{factions.length > 0 && (
  <select
    multiple
    value={factionIds.map(String)}
    onChange={(e) =>
      setFactionIds(
        Array.from(
          e.target.selectedOptions
        ).map((option) =>
          Number(option.value)
        )
      )
    }
    className="rpg-input h-32"
  >
    {factions.map((faction) => (
      <option
        key={faction.id}
        value={faction.id}
      >
        🛡️ {faction.name}
      </option>
    ))}
  </select>
)}
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Descrição..."
            className="rpg-input"
          />

          <button
            onClick={handleCreate}
            className="rpg-btn"
          >
            Criar evento
          </button>
        </div>
      )}

      <div className="mb-5">
  <select
    value={selectedCategoryFilter}
    onChange={(e) =>
      setSelectedCategoryFilter(
        e.target.value
          ? Number(e.target.value)
          : ""
      )
    }
    className="rpg-input"
  >
    <option value="">
      Todas as categorias
    </option>

    {timelineCategories.map((cat) => (
      <option
        key={cat.id}
        value={cat.id}
      >
        {cat.name}
      </option>
    ))}
  </select>
</div>

      <div className="space-y-5 border-l border-[#e0a96d]/30 pl-5">
        {Object.entries(groupedEvents).map(
          ([groupDate, group]) => (
            <div
              key={groupDate}
              className="space-y-4"
            >
              <h4 className="text-lg font-display text-[#e0a96d]">
                📅 {groupDate}
              </h4>

              <div className="space-y-5">
                {group.map((event) => (
                  <div
  key={event.id}
  id={`timeline-event-${event.id}`}
  className={
    highlightedTimelineEventId === event.id
      ? "rounded-xl ring-2 ring-yellow-300 bg-yellow-300/10 p-2 transition"
      : "transition"
  }
>
                    {editingId === event.id ? (
                      <div className="space-y-2">
                        <input
                          value={editDate}
                          onChange={(e) =>
                            setEditDate(
                              e.target.value
                            )
                          }
                          className="rpg-input"
                        />

                        <input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(
                              e.target.value
                            )
                          }
                          className="rpg-input"
                        />

                        <select
                          value={editCategoryId}
                          onChange={(e) =>
                            setEditCategoryId(
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : ""
                            )
                          }
                          className="rpg-input"
                        >
                          <option value="">
                            Categoria do evento
                          </option>

                          {timelineCategories.map(
                            (cat) => (
                              <option
                                key={cat.id}
                                value={cat.id}
                              >
                                {cat.name}
                              </option>
                            )
                          )}
                        </select>

                        <select
                          value={editLoreId}
                          onChange={(e) =>
                            setEditLoreId(
                              e.target.value
                                ? Number(
                                    e.target.value
                                  )
                                : ""
                            )
                          }
                          className="rpg-input"
                        >
                          <option value="">
                            Região relacionada
                          </option>

                          {worldLore.map((item) => (
                            <option
                              key={item.id}
                              value={item.id}
                            >
                              {item.title}
                            </option>
                          ))}
                        </select>
<select
  multiple
  value={editCharacterIds.map(String)}
  onChange={(e) =>
    setEditCharacterIds(
      Array.from(
        e.target.selectedOptions
      ).map((option) =>
        Number(option.value)
      )
    )
  }
  className="rpg-input h-40"
>
  {characters.map((character) => (
    <option
      key={character.id}
      value={character.id}
    >
      {character.name}
    </option>
  ))}
</select>
                        <textarea
                          value={editContent}
                          onChange={(e) =>
                            setEditContent(
                              e.target.value
                            )
                          }
                          className="rpg-input"
                        />

                        <button
                          onClick={() =>
                            handleUpdate(
                              event.id
                            )
                          }
                          className="rpg-btn"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <>
                        {event.category ? (
                          <div className="text-sm text-[#e0a96d] mb-1">
                            {getCategoryIcon(
                              event.category.name
                            )}{" "}
                            {event.category.name}
                          </div>
                        ) : (
                          <div className="text-sm text-[#e0a96d] mb-1">
                            📜 Narrativa
                          </div>
                        )}

                        <h4 className="text-lg text-[#f2e9e4]">
                          ● {event.title}
                        </h4>

                        <p className="text-sm text-[#c9ada7]/80 whitespace-pre-wrap">
                          {event.content}
                        </p>
                        {event.characters &&
  event.characters.length > 0 && (
    <div className="mt-3">
      <p className="text-xs text-[#c9ada7]/60 mb-2">
        Personagens envolvidos
      </p>

      <div className="flex flex-wrap gap-2">
        {event.characters.map(
          (character) => (
            <button
              key={character.id}
              type="button"
              onClick={() =>
                setPublicCharacterId(
                  character.id
                )
              }
              className="
  px-3
  py-1
  rounded-full
  bg-[#e0a96d]/10
  border
  border-[#e0a96d]/20
  text-[#e0a96d]
  text-xs
  cursor-pointer
  hover:bg-[#e0a96d]/20
  hover:border-[#e0a96d]/60
  transition
"
            >
              👤 {character.name}
            </button>
          )
        )}
      </div>
    </div>
)}
{event.factions &&
  event.factions.length > 0 && (
    <div className="mt-3">
      <p className="text-xs text-[#c9ada7]/60 mb-2">
        Facções envolvidas
      </p>

      <div className="flex flex-wrap gap-2">
        {event.factions.map(
          (faction) => (
            <button
  key={faction.id}
  type="button"
  onClick={() =>
    setSelectedFactionId(faction.id)
  }
  className="
    px-3
    py-1
    rounded-full
    bg-[#4a6fa5]/10
    border
    border-[#4a6fa5]/20
    text-[#8bb8ff]
    text-xs
    hover:bg-[#4a6fa5]/20
    hover:border-[#8bb8ff]/50
    transition
  "
>
  🛡️ {faction.name}
</button>
          )
        )}
      </div>
    </div>
)}

                        {event.lore && (
                          <div className="mt-2 text-sm text-[#e0a96d]">
                            <button
                              type="button"
                              onClick={() => {
                                const loreItem =
                                  lore.find(
                                    (item) =>
                                      item.id ===
                                      event.lore?.id
                                  )

                                if (loreItem) {
  setSelectedLore(loreItem)

  setHighlightedLoreId(
    loreItem.id
  )

  setFocusLoreId(
    loreItem.id
  )

  setTimeout(() => {
    setHighlightedLoreId(null)
  }, 2500)
}
                              }}
                              className="
                                text-[#e0a96d]
                                hover:text-[#f2c078]
                                transition
                              "
                            >
                              📍 {event.lore.title}
                            </button>
                          </div>
                        )}

                        {event.turn_id && (
                          <button
                            type="button"
                            onClick={() => {
      if (event.turn_id) {
        onFocusTurn(event.turn_id)
      }
    }}
                            className="
                              mt-2
                              block
                              text-xs
                              text-[#c9ada7]/70
                              hover:text-[#e0a96d]
                              transition
                            "
                          >
                            ↩ Ver turno original
                          </button>
                        )}

                        {isOwner && (
                          <div className="flex gap-3 mt-2 text-xs">
                            <button
                              onClick={() =>
                                startEditing(event)
                              }
                              className="text-[#e0a96d]"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  event.id
                                )
                              }
                              className="text-red-400"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
