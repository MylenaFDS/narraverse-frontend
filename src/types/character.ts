export type Character = {
  id: number
  name: string
  description?: string
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
  sheet: SheetValueInput[]
}