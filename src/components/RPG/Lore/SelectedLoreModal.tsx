import { useEffect, useState } from "react"

import type { Lore } from "../../../types/lore"
import type { LoreRelation } from "../../../types/loreRelation"
import {
  getLoreRelations,
  createLoreRelation,
  deleteLoreRelation,
  getTimelineByLore,
  getCharactersByLore,
  getFactionsByLore,
  getRegionPlaces,
  type RPGFaction,
  type RegionPlace,
  getRegionScenes,
type RegionScene,
} from "../../../services/api"
import RegionSceneModal from "./RegionSceneModal"

type Props = {
  selectedLore: Lore | null
  lore: Lore[]
  setSelectedLore: React.Dispatch<
    React.SetStateAction<Lore | null>
  >
  setHighlightedTimelineEventId: React.Dispatch<
    React.SetStateAction<number | null>
  >
  setPublicCharacterId: React.Dispatch<
  React.SetStateAction<number | null>
>
  onClose: () => void
  setSelectedFactionId: React.Dispatch<
  React.SetStateAction<number | null>
>
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
  characters?: {
    id: number
    name: string
  }[]
  factions?: {
    id: number
    name: string
  }[]
}

type RelatedCharacter = {
  id: number
  name: string
  history?: string | null
  image_url?: string | null
  world_lore_id?: number | null
}
export default function SelectedLoreModal({
  selectedLore,
  lore,
  setSelectedLore,
  setHighlightedTimelineEventId,
  setPublicCharacterId,
  setSelectedFactionId,
  onClose,
}: Props) {
  const [relations, setRelations] =
    useState<LoreRelation[]>([])
  const [timelineEvents, setTimelineEvents] =
  useState<RelatedTimelineEvent[]>([])
  const [characters, setCharacters] =
  useState<RelatedCharacter[]>([])
  const [targetLoreId, setTargetLoreId] =
  useState<number | "">("")
  const [factions, setFactions] =
  useState<RPGFaction[]>([])
  const [places, setPlaces] =
  useState<RegionPlace[]>([])
  const [scenes, setScenes] =
  useState<RegionScene[]>([])
  const [selectedScene, setSelectedScene] =
  useState<RegionScene | null>(null)

  useEffect(() => {
  if (!selectedLore) return

  Promise.all([
  getLoreRelations(selectedLore.id),
  getTimelineByLore(selectedLore.id),
  getCharactersByLore(selectedLore.id),
  getFactionsByLore(selectedLore.id),
  getRegionPlaces(selectedLore.id),
  getRegionScenes(selectedLore.id),
])
  .then(
    ([
  relationsData,
  eventsData,
  charactersData,
  factionsData,
  placesData,
  scenesData,
]) => {
  setRelations(relationsData)
  setTimelineEvents(eventsData)
  setCharacters(charactersData)
  setFactions(factionsData || [])
  setPlaces(placesData || [])
  setScenes(scenesData || [])
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
  <button
    key={event.id}
    type="button"
    onClick={() => {
      setHighlightedTimelineEventId(
        event.id
      )

      onClose()

      setTimeout(() => {
        document
          .getElementById(
            `timeline-event-${event.id}`
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
      }, 100)
    }}
    className="
      w-full
      text-left
      rounded-xl
      border
      border-[#e0a96d]/10
      bg-black/20
      p-3
      text-sm
      hover:border-[#e0a96d]/40
      hover:bg-[#e0a96d]/10
      transition
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
          {event.characters &&
  event.characters.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {event.characters.map((character) => (
        <button
          key={character.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setPublicCharacterId(character.id)
            onClose()
          }}
          className="
            px-2
            py-1
            rounded-full
            bg-[#8b5cf6]/10
            border
            border-[#8b5cf6]/20
            text-[#c4b5fd]
            text-xs
            hover:bg-[#8b5cf6]/20
            transition
          "
        >
          👤 {character.name}
        </button>
      ))}
    </div>
)}

{event.factions &&
  event.factions.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-2">
      {event.factions.map((faction) => (
        <button
          key={faction.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedFactionId(faction.id)
            onClose()
          }}
          className="
            px-2
            py-1
            rounded-full
            bg-[#4a6fa5]/10
            border
            border-[#4a6fa5]/20
            text-[#8bb8ff]
            text-xs
            hover:bg-[#4a6fa5]/20
            transition
          "
        >
          🛡️ {faction.name}
        </button>
      ))}
    </div>
)}
        </button>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum evento ligado a esta Lore.
    </p>
  )}
</div>
<div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Região
  </h4>

  {scenes.length > 0 ? (
  <div className="space-y-2">
    {[scenes[0]].map((scene) => (
        <div
          key={scene.id}
          className="
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            p-3
          "
        >
          <p className="text-[#f2e9e4] font-semibold">
            🖼️ {scene.title}
          </p>

          {scene.description && (
            <p className="text-xs text-[#c9ada7]/70 mt-2 line-clamp-2">
              {scene.description}
            </p>
          )}

          {scene.image_url && (
            <img
              src={`http://127.0.0.1:8001/${scene.image_url}`}
              alt={scene.title}
              className="
                mt-3
                w-full
                h-32
                object-cover
                rounded-xl
                border
                border-[#e0a96d]/20
              "
            />
          )}

          <button
  type="button"
  onClick={() => setSelectedScene(scene)}
  className="
    mt-3
    text-sm
    text-[#e0a96d]
    hover:text-[#f2c078]
    transition
  "
>
  Entrar na cena
</button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhuma cena explorável criada para esta região.
    </p>
  )}
</div>
<div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Locais exploráveis
  </h4>

  {places.length > 0 ? (
    <div className="space-y-2">
      {places.map((place) => (
        <div
          key={place.id}
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
            🏰 {place.name}
          </p>

          {place.description && (
            <p className="text-xs text-[#c9ada7]/70 mt-2 line-clamp-2">
              {place.description}
            </p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum local explorável criado para esta região.
    </p>
  )}
</div>
<div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Facções relacionadas
  </h4>

  {factions.length > 0 ? (
    <div className="space-y-2">
      {factions.map((faction) => (
        <button
          key={faction.id}
          type="button"
          onClick={() => {
            setSelectedFactionId(
              faction.id
            )

            onClose()
          }}
          className="
            w-full
            text-left
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            p-3
            text-sm
            hover:border-[#e0a96d]/40
            hover:bg-[#e0a96d]/10
            transition
          "
        >
          <p className="text-[#f2e9e4] font-semibold">
            🛡️ {faction.name}
          </p>

          <p className="text-xs text-[#c9ada7]/60 mt-1">
            👥 {faction.member_count ?? 0} membro
            {faction.member_count === 1 ? "" : "s"}
          </p>

          {faction.description && (
            <p className="text-xs text-[#c9ada7]/70 mt-2 line-clamp-2">
              {faction.description}
            </p>
          )}
        </button>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhuma facção relacionada a esta Lore.
    </p>
  )}
</div>
<div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Personagens
  </h4>

  {characters.length > 0 ? (
    <div className="space-y-2">
      {characters.map((character) => (
        <button
  type="button"
  key={character.id}
  onClick={() => {
    setPublicCharacterId(
  character.id
)

onClose()
    onClose()
  }}
  className="
    w-full
    flex
    items-center
    gap-3
    text-left
    hover:border-[#e0a96d]/40
    transition
            rounded-xl
            border
            border-[#e0a96d]/10
            bg-black/20
            p-3
          "
        >
          {character.image_url ? (
            <img
              src={`http://127.0.0.1:8001/${character.image_url}`}
              alt={character.name}
              className="
                w-10
                h-10
                rounded-full
                object-cover
                border
                border-[#e0a96d]/30
              "
            />
          ) : (
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-[#e0a96d]/20
                flex
                items-center
                justify-center
                text-[#e0a96d]
                font-bold
              "
            >
              {character.name[0]}
            </div>
          )}

          <div className="flex-1">
  <div className="text-[#f2e9e4] font-medium">
    {character.name}
  </div>

  {character.history && (
    <div
      className="
        text-xs
        text-[#c9ada7]/70
        mt-1
        line-clamp-3
      "
    >
      {character.history}
    </div>
  )}
</div>
        </button>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum personagem ligado a esta Lore.
    </p>
  )}
</div>
<RegionSceneModal
  scene={selectedScene}
  onClose={() => setSelectedScene(null)}
/>
      <button
        onClick={onClose}
        className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
      >
        Fechar
      </button>
    </div>
  )
}