import type { Lore } from "../../../../types/lore"

export function groupLore(
  lore: Lore[]
): Record<string, Lore[]> {
  return lore.reduce<
    Record<string, Lore[]>
  >((acc, item) => {
    const category =
      item.category ||
      "Sem categoria"

    if (!acc[category]) {
      acc[category] = []
    }

    acc[category].push(item)

    return acc
  }, {})
}