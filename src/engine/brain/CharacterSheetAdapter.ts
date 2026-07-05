import type { Character } from "../../types/character"
import type { SheetField } from "./SheetField"

export class CharacterSheetAdapter {

  static toEngine(
    character: Character,
  ): SheetField[] {

    return character.sheet_values.map(item => ({

      field_name: item.field.name,

      value: item.value,

    }))

  }

}