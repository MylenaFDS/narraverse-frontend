import type { RPGFaction } from "../../../services/api"

type Props = {
  faction: RPGFaction
  onClick: () => void
}

export default function FactionCard({
  faction,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        text-left
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        p-5
        transition
        hover:border-[#e0a96d]/50
        hover:bg-[#e0a96d]/5
      "
    >
      <h3 className="text-xl font-bold text-[#e0a96d]">
        🛡️ {faction.name}
      </h3>

      <p className="mt-2 text-gray-300">
        {faction.description ||
          "Sem descrição registrada."}
      </p>
    </button>
  )
}