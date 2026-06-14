import type { RPGFaction } from "../../../services/api"

type Props = {
  faction: RPGFaction
}

export default function FactionCard({
  faction,
}: Props) {
  return (
    <div
      className="
        bg-[#18181b]
        border
        border-[#2b2b31]
        rounded-2xl
        p-5
      "
    >
      <h3 className="text-xl font-bold text-[#e0a96d]">
        🛡️ {faction.name}
      </h3>

      <p className="mt-2 text-gray-300">
        {faction.description ||
          "Sem descrição registrada."}
      </p>
    </div>
  )
}