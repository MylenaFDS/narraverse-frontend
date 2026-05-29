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
        fixed
        inset-0
        z-50
        bg-black/80
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-4xl
          rounded-3xl
          border
          border-[#e0a96d]/20
          bg-[#12090b]
          overflow-hidden
        "
      >
        <div className="p-6">

          <div className="flex justify-between mb-6">
            <h2 className="text-3xl font-display text-[#e0a96d]">
              {character.name}
            </h2>

            <button
              onClick={onClose}
              className="text-[#c9ada7]"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-[#c9ada7]/70 mb-6">
            Jogador: {character.owner_username}
          </p>

          {getImageUrl(character.image_url) && (
            <img
              src={getImageUrl(
                character.image_url
              )!}
              alt={character.name}
              className="
                w-full
                h-64
                object-cover
                rounded-2xl
                mb-6
              "
            />
          )}

          <div className="mb-6">
            <h3 className="text-[#e0a96d] mb-2">
              História
            </h3>

            <p className="text-[#c9ada7] whitespace-pre-wrap">
              {character.history ||
                "Sem história registrada."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {character.sheet.map((field) => (
              <div
                key={field.field_name}
                className="
                  rounded-xl
                  border
                  border-[#3a1f24]
                  bg-black/20
                  p-4
                "
              >
                <div className="text-xs text-[#e0a96d]/70 uppercase">
                  {field.field_name}
                </div>

                <div className="text-[#f5d7b2] mt-2">
                  {field.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}