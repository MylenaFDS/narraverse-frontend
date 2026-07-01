export interface RPGSheetField {
  id: number

  name: string

  field_type: "text" | "number"
}

export interface CharacterSheetValue {
  id: number

  value: string

  field: RPGSheetField
}

export type Character = {
  id: number

  name: string

  description?: string

  history?: string | null

  world_lore_id?: number | null

  faction_id?: number | null

  faction?: {
    id: number
    name: string
  } | null

  image_url?: string | null

  user_id: number

  rpg_id: number

  // NPC
  is_npc: boolean

  // Valores da ficha
  sheet_values: CharacterSheetValue[]
}

export type CreateSheetFieldDTO = {
  name: string

  field_type: "text" | "number"
}

export type SheetValueInput = {
  field_id: number

  value: string
}

export type CharacterCreatePayload = {
  name: string

  history: string

  world_lore_id: number

  faction_id?: number | null

  image_url?: string

  // NPC
  is_npc?: boolean

  sheet: SheetValueInput[]
}