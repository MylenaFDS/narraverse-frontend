import type { InventoryItem } from "./InventoryTypes"

import type { InventoryKnowledge } from "./InventoryKnowledge"

import { ItemAliases } from "./ItemAliases"

export class InventoryReasoningEngine {

  private static contains(

    inventory: InventoryItem[],

    aliases: string[],

  ) {

    return inventory.some(

      item =>

        aliases.some(

          alias =>

            item.name

              .toLowerCase()

              .includes(

                alias.toLowerCase(),

              ),

        ),

    )

  }

  static analyze(

    inventory: InventoryItem[],

  ): InventoryKnowledge {

    return {

      hasWeapon:

        this.contains(

          inventory,

          ItemAliases.weapon,

        ),

      hasShield:

        this.contains(

          inventory,

          ItemAliases.shield,

        ),

      hasHealing:

        this.contains(

          inventory,

          ItemAliases.healing,

        ),

      hasFood:

        this.contains(

          inventory,

          ItemAliases.food,

        ),

      hasLight:

        this.contains(

          inventory,

          ItemAliases.light,

        ),

      hasMagicItem:

        this.contains(

          inventory,

          ItemAliases.magic,

        ),

      hasKey:

        this.contains(

          inventory,

          ItemAliases.key,

        ),

      hasMap:

        this.contains(

          inventory,

          ItemAliases.map,

        ),

      hasTool:

        this.contains(

          inventory,

          ItemAliases.tool,

        ),

    }

  }

}