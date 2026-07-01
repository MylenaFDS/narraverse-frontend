export interface InventoryItem {

  id: number

  name: string

  category: string

  equipped: boolean

  quantity: number

  modifiers?: {

    attack?: number

    defense?: number

    critical?: number

    movement?: number

    hp?: number

  }

}