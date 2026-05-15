// components/RPG/Lore/types.ts

import type { Lore } from "../../../types/lore"

export type { Lore }

export type MapRegion = {
  id: number
  name: string
  lore_id?: number | null
  pos_x: number
  pos_y: number
  color: string
  rpg_id: number
}