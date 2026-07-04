import type { SheetField } from "./SheetField"

import { FieldAliases } from "./FieldAliases"

export class SheetInterpreterEngine {

  static get(

    fields: SheetField[],

    aliases: string[],

  ): string | null {

    for (const alias of aliases) {

      const field = fields.find(

        item =>

          item.field_name

            .trim()

            .toLowerCase()

            ===

          alias.toLowerCase(),

      )

      if (field) {

        return field.value

      }

    }

    return null

  }

  static life(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.life,

    )

  }

  static mana(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.mana,

    )

  }

  static sanity(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.sanity,

    )

  }

  static stamina(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.stamina,

    )

  }

  static unconscious(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.unconscious,

    )

  }

  static mute(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.mute,

    )

  }

  static immobilized(
    fields: SheetField[],
  ) {

    return this.get(

      fields,

      FieldAliases.immobilized,

    )

  }

}