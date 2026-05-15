import type { Lore } from "./types"

type Props = {
  lore: Lore
  onClose: () => void
}

export default function LoreModal({
  lore,
  onClose,
}: Props) {
  return (
    <div className="fixed right-4 top-4 w-[400px] bg-[#18181b] p-6 rounded-2xl border border-[#2b2b31] z-50">
      <h2 className="text-2xl font-bold mb-4">
        {lore.title}
      </h2>

      <p className="whitespace-pre-wrap text-gray-300">
        {lore.content}
      </p>

      <button
        onClick={onClose}
        className="mt-4 bg-red-600 px-4 py-2 rounded-xl"
      >
        Fechar
      </button>
    </div>
  )
}