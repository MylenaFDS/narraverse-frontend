import type { Character } from "../../types/character"

export class CharacterAdapter {

  static toAI(
    character: Character,
  ): Character {

    return {

      ...character,

      sheet_values:
        character.sheet_values ?? [],

    }

  }

}