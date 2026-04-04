export interface Character {
  id: number
  name: string
  user_id: number
  rpg_id: number
}

export interface CharacterCreate {
  name: string
}

export interface CharacterSheetField {
  name: string
  label: string
  type: string
}

export interface CharacterSheetValue {
  field_name: string
  value: string
}

export interface RPGSheetField {
  id: number
  name: string
  field_type: string
  rpg_id: number
}