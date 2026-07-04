import type { SheetField } from "./SheetField"

import type { CharacterState } from "./CharacterState"

import { SheetInterpreterEngine } from "./SheetInterpreterEngine"

import { ValueInterpreter }

from "./ValueInterpreter"

export class CharacterStateEngine {

  static build(

    fields: SheetField[],

  ): CharacterState {

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

    const lifeValue =

      ValueInterpreter.number(
    life,
  )

    const manaValue =

      ValueInterpreter.number(
    mana,
  )

    const hasLife =
  lifeValue !== null

const hasMana =
  manaValue !== null

    return {

      alive:

  hasLife

    ? (lifeValue! > 0)

    : true,

      conscious:

        !ValueInterpreter.isTrue(
  unconscious,
),

      canSpeak:

        mute !== "Sim",

      canMove:

        immobilized !== "Sim",

      canFight:

  (hasLife

    ? (lifeValue! > 0)

    : true)

  &&

  !ValueInterpreter.isTrue(unconscious)

  &&

  !ValueInterpreter.isTrue(immobilized),

      canCastMagic:

  hasMana

    ? (manaValue! > 0)

    : true,

      wounded:

  hasLife

    ? (lifeValue! <= 2)

    : false,

    exhausted: false,


    }

  }

}