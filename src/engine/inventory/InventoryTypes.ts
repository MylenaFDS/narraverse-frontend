export type InventoryCategory =
  | "weapon"
  | "armor"
  | "shield"
  | "tool"
  | "food"
  | "potion"
  | "magic"
  | "quest"
  | "key"
  | "misc"

export interface ItemModifiers {
  attack?: number

  defense?: number

  critical?: number

  movement?: number

  hp?: number

  mana?: number

  initiative?: number

  accuracy?: number

  dodge?: number

  charisma?: number

  perception?: number

  stealth?: number

  luck?: number

  fireResistance?: number

  iceResistance?: number

  poisonResistance?: number

  holyResistance?: number

  darkResistance?: number

  [key: string]: number | undefined
}

export interface InventoryItem {
  id: number

  name: string

  category: InventoryCategory

  equipped: boolean

  quantity: number

  description?: string

  rarity?: string

  weight?: number

  value?: number

  stackable?: boolean

  icon?: string

  modifiers?: ItemModifiers
}