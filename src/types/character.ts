export type Character = {
  id: number
  name: string
  description?: string
  history?: string | null
  world_lore_id?: number | null
  image_url?: string | null
  user_id: number
  rpg_id: number
}

export type RPGSheetField = {
  id: number
  name: string
  field_type: "text" | "number"
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
  image_url?: string
  sheet: SheetValueInput[]
}

export type CharacterSheetValue = {
  id: number
  character_id: number
  field_id: number
  value: string
}