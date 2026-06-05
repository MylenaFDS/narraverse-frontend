import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getTimeline,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from "../../services/api"
import type { Lore } from "../../types/lore"

type Props = {
  rpgId: number
  isOwner: boolean
  lore: Lore[]
  setSelectedLore: React.Dispatch<
    React.SetStateAction<Lore | null>
  >
}


type TimelineEvent = {
  id: number
  title: string
  content?: string
  date_label?: string

  lore_id?: number | null
  turn_id?: number | null

  lore?: {
    id: number
    title: string
  } | null
  category_id?: number | null

category?: {
  id: number
  name: string
} | null
}

function getCategoryIcon(
  name?: string
) {
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
}: Props) {
  const [events, setEvents] =
    useState<TimelineEvent[]>([])

  const [title, setTitle] =
    useState("")

  const [content, setContent] =
    useState("")

  const [dateLabel, setDateLabel] =
    useState("")

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [editTitle, setEditTitle] =
    useState("")

  const [editContent, setEditContent] =
    useState("")

  const [editDate, setEditDate] =
    useState("")
  
  const [loreId, setLoreId] =
  useState<number | "">("")
const [editLoreId, setEditLoreId] =
  useState<number | "">("")


  const worldLore = lore.filter(
  (item) => item.category === "Mundo"
)

const navigate = useNavigate()

useEffect(() => {
  let mounted = true

  async function init() {
    try {
      const data =
        await getTimeline(rpgId)

      if (mounted) {
        setEvents(data || [])
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


  async function handleCreate() {
    const created =
  await createTimelineEvent(
    rpgId,
    {
      title,
      content,
      date_label: dateLabel,
      lore_id:
        loreId === "" ? null : Number(loreId),
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
  }


  function startEditing(
    event: TimelineEvent
  ) {
    setEditingId(event.id)
    setEditTitle(event.title)
    setEditContent(
      event.content ?? ""
    )
    setEditDate(
      event.date_label ?? ""
    )
    setEditLoreId(
  event.lore_id ?? ""
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
  }


  async function handleDelete(
    id: number
  ) {
    await deleteTimelineEvent(id)

    setEvents((prev) =>
      prev.filter(
        (event) =>
          event.id !== id
      )
    )
  }

const groupedEvents =
  events.reduce(
    (acc, event) => {
      const key =
        event.date_label ||
        "Sem data"

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
        <div className="mb-6 space-y-2">

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


      <div className="space-y-5 border-l border-[#e0a96d]/30 pl-5">

        {Object.entries(groupedEvents).map(
  ([dateLabel, group]) => (
    <div key={dateLabel} className="space-y-4">
      <h4 className="text-lg font-display text-[#e0a96d]">
        📅 {dateLabel}
      </h4>

      <div className="space-y-5">
        {group.map((event) => (
          <div key={event.id}>

            {editingId === event.id ? (
              <div className="space-y-2">

                <input
                  value={editDate}
                  onChange={(e) =>
                    setEditDate(e.target.value)
                  }
                  className="rpg-input"
                />

                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  className="rpg-input"
                />
                <select
  value={editLoreId}
  onChange={(e) =>
    setEditLoreId(
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

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                  className="rpg-input"
                />

                <button
                  onClick={() =>
                    handleUpdate(event.id)
                  }
                  className="rpg-btn"
                >
                  Salvar
                </button>

              </div>
            ) : (
              <>
                <span className="text-sm text-[#e0a96d]">
                  {event.date_label}
                </span>
              {event.category && (
  <div
    className="
      text-sm
      text-[#e0a96d]
      mb-1
    "
  >
    {getCategoryIcon(
      event.category.name
    )}{" "}
    {event.category.name}
  </div>
)}
                <h4 className="text-lg text-[#f2e9e4]">
                  ● {event.title}
                </h4>

                <p className="text-sm text-[#c9ada7]/80 whitespace-pre-wrap">
                  {event.content}
                </p>
              {event.lore && (
  <div
    className="
      mt-2
      text-sm
      text-[#e0a96d]
    "
  >
    <button
  type="button"
  onClick={() => {
    const loreItem = lore.find(
      (item) =>
        item.id === event.lore?.id
    )

    if (loreItem) {
      setSelectedLore(loreItem)
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
    onClick={() =>
      navigate(
        `/rpg/${rpgId}#turn-${event.turn_id}`
      )
    }
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
                        handleDelete(event.id)
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