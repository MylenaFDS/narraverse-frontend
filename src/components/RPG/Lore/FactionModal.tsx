import { useEffect, useState } from "react"

import {
  getFactionDetail,
  type RPGFactionDetail,
} from "../../../services/api"

type Props = {
  factionId: number | null
  setPublicCharacterId: React.Dispatch<
    React.SetStateAction<number | null>
  >
  onClose: () => void
  setHighlightedTimelineEventId: React.Dispatch<
  React.SetStateAction<number | null>
>
onTimelineEventClick?: (
  eventId: number
) => void
}

export default function FactionModal({
  factionId,
  setPublicCharacterId,
  onClose,
  onTimelineEventClick,
}: Props) {
  const [faction, setFaction] =
    useState<RPGFactionDetail | null>(null)

  useEffect(() => {
    if (!factionId) return

    getFactionDetail(factionId)
      .then(setFaction)
      .catch(console.error)
  }, [factionId])

  if (!factionId) return null

  if (!faction) {
    return (
      <div
        className="
          fixed
          right-4
          top-4
          w-[400px]
          bg-[#18181b]
          p-6
          rounded-2xl
          border
          border-[#2b2b31]
          z-50
        "
      >
        Carregando facção...
      </div>
    )
  }

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
      <h2 className="text-2xl font-bold mb-4 text-[#e0a96d]">
        🛡️ {faction.name}
      </h2>

      <p className="whitespace-pre-wrap text-gray-300">
        {faction.description ||
          "Sem descrição registrada."}
      </p>
<p className="mt-2 text-sm text-[#c9ada7]/60">
  👥 {faction.members.length} membros
</p>
      <div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
        <h4 className="text-[#e0a96d] font-display mb-3">
          Membros
        </h4>

        {faction.members.length > 0 ? (
          <div className="space-y-2">
            {faction.members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setPublicCharacterId(member.id)
                  onClose()
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  text-left
                  rounded-xl
                  border
                  border-[#e0a96d]/10
                  bg-black/20
                  p-3
                  hover:border-[#e0a96d]/40
                  hover:bg-[#e0a96d]/10
                  transition
                "
              >
                {member.image_url ? (
                  <img
                    src={`http://127.0.0.1:8001/${member.image_url}`}
                    alt={member.name}
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
                    {member.name[0]}
                  </div>
                )}

                <div className="flex-1">
                  <div className="text-[#f2e9e4] font-medium">
                    {member.name}
                  </div>

                  {member.world_lore && (
                    <div className="text-xs text-[#c9ada7]/60 mt-1">
                      📍 {member.world_lore.title}
                    </div>
                  )}

                  {member.history && (
                    <div
                      className="
                        text-xs
                        text-[#c9ada7]/70
                        mt-1
                        line-clamp-2
                      "
                    >
                      {member.history}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#c9ada7]/60">
            Nenhum membro nesta facção.
          </p>
        )}
      </div>
      <div className="mt-6 border-t border-[#e0a96d]/10 pt-4">
  <h4 className="text-[#e0a96d] font-display mb-3">
    Eventos importantes
  </h4>

  {faction.timeline_events.length > 0 ? (
    <div className="space-y-2">
      {faction.timeline_events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => {
            onTimelineEventClick?.(event.id)

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
            hover:border-[#e0a96d]/40
            hover:bg-[#e0a96d]/10
            transition
          "
        >
          <p className="text-[#f2e9e4] font-semibold">
            📜 {event.title}
          </p>

          <p className="text-xs text-[#c9ada7]/60 mt-1">
            {event.date_label || "Sem data"}
            {event.category?.name
              ? ` • ${event.category.name}`
              : ""}
            {event.lore?.title
              ? ` • ${event.lore.title}`
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
    hover:border-[#c4b5fd]/40
    transition
  "
>
  👤 {character.name}
</button>
      ))}
    </div>
)}

          {event.content && (
            <p className="text-sm text-[#c9ada7]/70 mt-2 line-clamp-2">
              {event.content}
            </p>
          )}
        </button>
      ))}
    </div>
  ) : (
    <p className="text-sm text-[#c9ada7]/60">
      Nenhum evento importante ligado a esta facção.
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