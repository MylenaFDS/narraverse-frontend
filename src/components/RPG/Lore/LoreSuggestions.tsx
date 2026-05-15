import axios from "axios"
import type { Lore } from "./types"

type Props = {
  suggestions: Lore[]
  rpgId: number
  setLore: React.Dispatch<React.SetStateAction<Lore[]>>
  setSuggestions: React.Dispatch<
    React.SetStateAction<Lore[]>
  >
  getLore: (rpgId: number) => Promise<Lore[]>
}

export default function LoreSuggestions({
  suggestions,
  rpgId,
  setLore,
  setSuggestions,
  getLore,
}: Props) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-black mb-6">
        💡 Sugestões Pendentes
      </h2>

      <div className="space-y-4">
        {suggestions.map((item) => (
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
              {item.content}
            </p>

            <button
              onClick={async () => {
                const token =
                  localStorage.getItem("token")

                await axios.put(
                  `http://127.0.0.1:8001/rpg-lore/${item.id}/approve`,
                  {},
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

                setSuggestions((prev) =>
                  prev.filter(
                    (s) => s.id !== item.id
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
              Aprovar sugestão
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}