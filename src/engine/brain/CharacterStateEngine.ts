import type { Character } from "../../types/character"

import type { SheetField } from "./SheetField"
import type { CharacterState } from "./types/CharacterState"

import { SheetInterpreterEngine } from "./SheetInterpreterEngine"
import { ValueInterpreter } from "./ValueInterpreter"

export class CharacterStateEngine {

  static build(
    character: Character,
  ): CharacterState {

    const fields: SheetField[] =

(character.sheet_values ?? []).map(value => ({

      id: value.field.id,

      name: value.field.name,

      value: value.value,

      field_type: value.field.field_type,

    }))

    const life =
      SheetInterpreterEngine.life(
        fields,
      )

    const mana =
      SheetInterpreterEngine.mana(
        fields,
      )

    const unconscious =
      SheetInterpreterEngine.unconscious(
        fields,
      )

    const mute =
      SheetInterpreterEngine.mute(
        fields,
      )

    const immobilized =
      SheetInterpreterEngine.immobilized(
        fields,
      )

    const staminaField =
      SheetInterpreterEngine.stamina?.(
        fields,
      ) ?? null

    const health =
      ValueInterpreter.number(
        life,
      ) ?? 100

    const manaValue =
      ValueInterpreter.number(
        mana,
      ) ?? 100

    const stamina =
      ValueInterpreter.number(
        staminaField,
      ) ?? 100

    const unconsciousValue =
      ValueInterpreter.isTrue(
        unconscious,
      )

    const muted =
      ValueInterpreter.isTrue(
        mute,
      )

    const immobilizedValue =
      ValueInterpreter.isTrue(
        immobilized,
      )

    return {

      // ==========================
      // Estado universal
      // ==========================

      health,

      mana: manaValue,

      stamina,

      alive:
        health > 0,

      unconscious:
        unconsciousValue,

      exhausted:
        stamina <= 10,

      // ==========================
      // Compatibilidade
      // ==========================

      conscious:
        !unconsciousValue,

      canSpeak:
        !muted,

      canMove:
        !immobilizedValue,

      canFight:

        health > 0 &&

        !unconsciousValue &&

        !immobilizedValue,

      canCastMagic:
        manaValue > 0,

      wounded:
        health <= 20,

    }

  }

}