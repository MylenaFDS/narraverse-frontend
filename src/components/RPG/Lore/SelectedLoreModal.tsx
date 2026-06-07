import { useEffect, useState } from "react"

import type { Lore } from "../../../types/lore"
import type { LoreRelation } from "../../../types/loreRelation"

import {
  getLoreRelations,
  createLoreRelation,
  deleteLoreRelation,
  getTimelineByLore,
} from "../../../services/api"

type Props = {
  selectedLore: Lore | null
  lore: Lore[]
  setSelectedLore: React.Dispatch<
    React.SetStateAction<Lore | null>
  >
  onClose: () => void
}

type RelatedTimelineEvent = {
  id: number
  title: string
  content?: string
  date_label?: string
  category?: {
    id: number
    name: string
  } | null
}

export default function SelectedLoreModal({
  selectedLore,
  lore,
  setSelectedLore,
  onClose,
}: Props) {
  const [relations, setRelations] =
    useState<LoreRelation[]>([])
  const [timelineEvents, setTimelineEvents] =
  useState<RelatedTimelineEvent[]>([])
  const [targetLoreId, setTargetLoreId] =
  useState<number | "">("")

  useEffect(() => {
  if (!selectedLore) return

  Promise.all([
    getLoreRelations(selectedLore.id),
    getTimelineByLore(selectedLore.id),
  ])
    .then(
      ([relationsData, eventsData]) => {
        setRelations(relationsData)
        setTimelineEvents(eventsData)
      }
    )
    .catch(console.error)
}, [selectedLore])

  const availableLore = lore.filter(
  (item) =>
    item.id !== selectedLore?.id &&
    !relations.some(
      (relation) =>
        relation.target_lore.id === item.id
    )
)

async function handleAddRelation() {
  if (!selectedLore || targetLoreId === "")
    return

  const created =
    await createLoreRelation(
      selectedLore.id,
      Number(targetLoreId)
    )

  setRelations((prev) => [
    ...prev,
    created,
  ])

  setTargetLoreId("")
}

async function handleDeleteRelation(
  relationId: number
) {
  await deleteLoreRelation(
    relationId
  )

  setRelations((prev) =>
    prev.filter(
      (relation) =>
        relation.id !== relationId
    )
  )
}
  if (!selectedLore) return null

  return (
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
      <h2 className="text-2xl font-bold mb-4">
        {selectedLore.title}
      </h2>

      <p className="whitespace-pre-wrap text-gray-300">
        {selectedLore.content}
      </p>

      <div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Relacionados
  </h4>

  {relations.length > 0 ? (
    <div className="space-y-2">
      {relations.map((relation) => (
        <div
  key={relation.id}
  className="
    flex
    items-center
    gap-2
    text-sm
  "
>
  <button
    type="button"
    onClick={() => {
      const loreItem = lore.find(
        (item) =>
          item.id === relation.target_lore.id
      )

      if (loreItem) {
        setSelectedLore(loreItem)
      }
    }}
    className="
      text-left
      text-[#f2e9e4]
      hover:text-[#e0a96d]
      transition
    "
  >
    🧩 {relation.target_lore.title}
  </button>

  <button
    type="button"
    onClick={() => {
  const confirmDelete = window.confirm(
    `Remover relação com "${relation.target_lore.title}"?`
  )

  if (!confirmDelete) return

  void handleDeleteRelation(
    relation.id
  )
}}
    title="Remover relacionado"
    className="
      text-red-400
      hover:text-red-300
      text-xs
      opacity-70
      hover:opacity-100
      transition
    "
  >
    🗑
  </button>
</div>

      ))}
    </div>
    
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum relacionado ainda.
    </p>
  )}

  <div className="mt-4 space-y-2">
    <select
      value={targetLoreId}
      onChange={(e) =>
        setTargetLoreId(
          e.target.value
            ? Number(e.target.value)
            : ""
        )
      }
      className="rpg-input"
    >
      <option value="">
        Adicionar relacionado
      </option>

      {availableLore.map((item) => (
        <option
          key={item.id}
          value={item.id}
        >
          {item.title}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={handleAddRelation}
      disabled={targetLoreId === ""}
      className="
        rpg-btn
        text-sm
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      Adicionar
    </button>
  </div>
</div>
<div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Eventos da Timeline
  </h4>

  {timelineEvents.length > 0 ? (
    <div className="space-y-2">
      {timelineEvents.map((event) => (
        <div
          key={event.id}
          className="
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            p-3
            text-sm
          "
        >
          <p className="text-[#f2e9e4] font-semibold">
            📜 {event.title}
          </p>

          <p className="text-xs text-[#c9ada7]/60">
            {event.date_label || "Sem data"}
            {event.category?.name
              ? ` • ${event.category.name}`
              : ""}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum evento ligado a esta Lore.
    </p>
  )}
</div>
      <button
        onClick={onClose}
        className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
      >
        Fechar
      </button>
    </div>
  )
}