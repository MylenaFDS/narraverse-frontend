import { InventoryEngine } from "../inventory/InventoryEngine"

import type { InventoryItem } from "../inventory/InventoryTypes"

export interface EquipmentStats {

  weapon: string

  armor: string

  attackBonus: number

  defenseBonus: number

  criticalBonus: number

  movementBonus: number

}

export class EquipmentEngine {

  static get(
    inventory: InventoryItem[],
  ): EquipmentStats {

    const weapon =
      InventoryEngine.getWeapon(
        inventory,
      )

    const armor =
      InventoryEngine.getArmor(
        inventory,
      )

    return {

      weapon:
        weapon?.name ??
        "Sem arma",

      armor:
        armor?.name ??
        "Sem armadura",

      attackBonus:
        weapon?.modifiers?.attack ??
        0,

      defenseBonus:
        armor?.modifiers?.defense ??
        0,

      criticalBonus:
        weapon?.modifiers?.critical ??
        0,

      movementBonus:
        armor?.modifiers?.movement ??
        0,

    }

  }

}