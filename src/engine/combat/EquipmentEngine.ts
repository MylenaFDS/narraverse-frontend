export interface EquipmentStats {

  weapon: string

  armor: string

  attackBonus: number

  defenseBonus: number

}

export class EquipmentEngine {

  static get(
    characterId: number,
  ): EquipmentStats {

    return {

      weapon: "Arma básica",

      armor: "Roupa",

      attackBonus: 0,

      defenseBonus: 0,

    }

  }

}