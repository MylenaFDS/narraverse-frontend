import { useEffect, useState } from "react"
import { getPublicCharacter } from "../../services/characters"

type Props = {
  characterId: number
  onClose: () => void
}

type CharacterData = {
  id: number
  name: string
  history?: string
  image_url?: string | null
  owner_username: string
  sheet: {
    field_name: string
    value: string
  }[]
}

export default function PublicCharacterOverlay({
  characterId,
  onClose,
}: Props) {
  const [character, setCharacter] =
    useState<CharacterData | null>(null)

  useEffect(() => {
    getPublicCharacter(characterId)
      .then(setCharacter)
      .catch(console.error)
  }, [characterId])

  if (!character) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  function getImageUrl(
    imageUrl?: string | null
  ) {
    if (!imageUrl) return null

    if (imageUrl.startsWith("http")) {
      return imageUrl
    }

    return `http://127.0.0.1:8001/${imageUrl}`
  }

  return (
  <div
    className="
      fixed inset-0 z-50
      bg-black/75
      backdrop-blur-sm
      flex items-start justify-center
      overflow-y-auto
      p-8
    "
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        relative
        w-full
        max-w-3xl
        my-10
        overflow-hidden
        rounded-3xl
        border
        border-yellow-900/30
        bg-gradient-to-br
        from-[#241216]
        to-[#12090b]
        shadow-[0_0_35px_rgba(0,0,0,0.5)]
      "
    >
      {getImageUrl(character.image_url) && (
        <div className="absolute inset-x-0 top-0 h-48 overflow-hidden">
          <img
            src={getImageUrl(character.image_url)!}
            alt={character.name}
            className="
              w-full h-full object-cover
              opacity-30 blur-sm scale-110
            "
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#241216]/70 to-[#12090b]" />
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-[#c9ada7] hover:text-[#e0a96d]"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div
            className="
              w-24 h-24 rounded-full
              bg-gradient-to-br from-[#e0a96d] to-[#8b5e34]
              flex items-center justify-center
              text-3xl font-bold text-black
              shadow-lg shrink-0 overflow-hidden
            "
          >
            {getImageUrl(character.image_url) ? (
              <img
                src={getImageUrl(character.image_url)!}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              character.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h2 className="text-4xl font-display text-[#e0a96d]">
              {character.name}
            </h2>

            <p className="mt-2 text-sm text-[#c9ada7]/70">
              Jogador: {character.owner_username}
            </p>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#3a1f24]
            bg-black/20
            p-5
            mb-8
          "
        >
          <div className="text-sm uppercase tracking-[0.2em] text-[#e0a96d]/70 mb-3">
            História
          </div>

          <p className="text-[#c9ada7] leading-relaxed whitespace-pre-wrap">
            {character.history || "Sem história registrada."}
          </p>
        </div>

        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-[#e0a96d]/70 mb-4">
            Atributos
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {character.sheet.map((field) => (
              <div
                key={field.field_name}
                className="
                  rounded-2xl
                  border
                  border-[#4a2329]
                  bg-gradient-to-br
                  from-[#1b0c10]
                  to-[#12080a]
                  p-4
                "
              >
                <div className="text-[11px] uppercase tracking-[0.15em] text-[#e0a96d]/70 mb-3">
                  {field.field_name}
                </div>

                <div className="text-[#f5d7b2]">
                  {field.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)
}