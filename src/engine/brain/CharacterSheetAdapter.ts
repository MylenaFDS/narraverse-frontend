import type { Character } from "../../types/character"
import type { SheetField } from "./SheetField"

export class CharacterSheetAdapter {

  static toEngine(
    character: Character,
  ): SheetField[] {

    return character.sheet_values.map(item => ({

  id: item.field.id,

  name: item.field.name,

  field_type: item.field.field_type,

  value: item.value,

}))

  }

}