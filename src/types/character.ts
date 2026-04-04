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
  id: number
  name: string
  type: string
}

export interface CharacterSheetValue {
  field_id: number
  value: string
}