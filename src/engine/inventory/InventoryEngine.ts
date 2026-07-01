import type { InventoryItem } from "./InventoryTypes"

export class InventoryEngine {

  static getEquipped(
    inventory: InventoryItem[],
  ) {

    return inventory.filter(
      item => item.equipped,
    )

  }

  static getWeapon(
    inventory: InventoryItem[],
  ) {

    return this.getEquipped(
      inventory,
    ).find(
      item => item.category === "weapon",
    )

  }

  static getArmor(
    inventory: InventoryItem[],
  ) {

    return this.getEquipped(
      inventory,
    ).find(
      item => item.category === "armor",
    )

  }

}