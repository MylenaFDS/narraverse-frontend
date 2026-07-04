

import type { SheetField } from "../brain/SheetField"

import type { CharacterState }

from "./CharacterState"

export class CharacterStateEngine {

  static build(
    sheet: SheetField[],

  ): CharacterState {

    const get = (

      field: string,

    ) =>

      sheet.find(

        f =>

          f.field_name
            .toLowerCase()

            ===

          field.toLowerCase(),

      )?.value

    const life =

      get("Vida")

    const unconscious =

      get("Inconsciente")

    const mute =

      get("Mudo")

    const immobilized =

      get("Imobilizado")

    const mana =

      get("Mana")

    return {

      alive:

        life !== "0",

      conscious:

        unconscious !== "Sim",

      canSpeak:

        mute !== "Sim",

      canMove:

        immobilized !== "Sim",

      canFight:

        life !== "0" &&

        unconscious !== "Sim",

      canCastMagic:

        mana !== "0",

      wounded:

        life === "1" ||

        life === "2",

      exhausted: false,

    }

  }

}