import type { Character } from "../types/character"

export interface SheetField {
  id: number

  name: string

  field_type: string

  value: string
}

export class CharacterSheetEngine {
  static getFields(
    character: Character,
  ): SheetField[] {
    return (
      character.sheet_values?.map(
        (item) => ({
          id: item.field.id,
          name: item.field.name,
          field_type: item.field.field_type,
          value: item.value,
        })
      ) ?? []
    )
  }

  static getValue(
    character: Character,
    fieldName: string,
  ): string | null {
    const field =
      this.getFields(character).find(
        (f) =>
          f.name.toLowerCase() ===
          fieldName.toLowerCase()
      )

    return field?.value ?? null
  }

  static getNumber(
    character: Character,
    fieldName: string,
  ): number {
    const value =
      this.getValue(character, fieldName)

    if (!value) return 0

    return Number(value) || 0
  }

  static hasField(
    character: Character,
    fieldName: string,
  ) {
    return (
      this.getValue(
        character,
        fieldName,
      ) !== null
    )
  }

  static setValue(
    character: Character,
    fieldName: string,
    value: string,
  ) {
    const field =
      character.sheet_values?.find(
        (item) =>
          item.field.name.toLowerCase() ===
          fieldName.toLowerCase()
      )

    if (field) {
      field.value = value
    }
  }
}