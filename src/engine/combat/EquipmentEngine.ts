import { InventoryEngine } from "../inventory/InventoryEngine"

import type {
  InventoryItem,
} from "../inventory/InventoryTypes"

export interface EquipmentStats {

  weapon: string

  armor: string

  equipped: InventoryItem[]

  attackBonus: number

  defenseBonus: number

  criticalBonus: number

  movementBonus: number

  modifiers: Record<string, number>

}

export class EquipmentEngine {

  static get(
    inventory: InventoryItem[],
  ): EquipmentStats {

    const equipped =
      InventoryEngine.getEquipped(
        inventory,
      )

    const weapon =
      InventoryEngine.getWeapon(
        inventory,
      )

    const armor =
      InventoryEngine.getArmor(
        inventory,
      )

    const modifiers: Record<
      string,
      number
    > = {}

    for (const item of equipped) {

      if (!item.modifiers) continue

      for (const [key, value] of Object.entries(
        item.modifiers,
      )) {

        modifiers[key] =
          (modifiers[key] ?? 0) +
          Number(value)

      }

    }

    return {

      weapon:
        weapon?.name ??
        "Sem arma",

      armor:
        armor?.name ??
        "Sem armadura",

      equipped,

      attackBonus:
        modifiers.attack ?? 0,

      defenseBonus:
        modifiers.defense ?? 0,

      criticalBonus:
        modifiers.critical ?? 0,

      movementBonus:
        modifiers.movement ?? 0,

      modifiers,

    }

  }

  static getModifier(
    stats: EquipmentStats,
    modifier: string,
  ): number {

    return (
      stats.modifiers[
        modifier
      ] ?? 0
    )

  }

}