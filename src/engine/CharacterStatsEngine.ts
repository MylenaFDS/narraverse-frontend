import type { Character } from "../types/character"

import {
  CharacterSheetEngine,
} from "./CharacterSheetEngine"


// ============================================================
// RESULTADO DE UM ATRIBUTO
// ============================================================

export interface CharacterStat {

  name: string

  value: number

  modifier: number

}


// ============================================================
// ENGINE DE ATRIBUTOS
// ============================================================

export class CharacterStatsEngine {


  // ==========================================================
  // OBTER VALOR DE UM ATRIBUTO
  // ==========================================================

  static getValue(
    character: Character,
    fieldNames: string[],
    fallback = 10,
  ): number {

    for (const field of fieldNames) {

      const value =
        CharacterSheetEngine.getNumber(
          character,
          field,
        )

      if (
        typeof value === "number" &&
        !Number.isNaN(value)
      ) {

        return value

      }

    }

    return fallback

  }


  // ==========================================================
  // CONVERTER ATRIBUTO EM MODIFICADOR
  //
  // Regra:
  //
  // 1  → -5
  // 2  → -4
  // 3  → -4
  // ...
  // 10 →  0
  // 12 → +1
  // 14 → +2
  // 16 → +3
  // 18 → +4
  // 20 → +5
  //
  // Fórmula:
  //
  // floor((valor - 10) / 2)
  //
  // ==========================================================

  static getModifier(
    value: number,
  ): number {

    return Math.floor(
      (value - 10) / 2,
    )

  }


  // ==========================================================
  // OBTER ATRIBUTO + MODIFICADOR
  // ==========================================================

  static getStat(
    character: Character,
    name: string,
    aliases: string[],
    fallback = 10,
  ): CharacterStat {

    const value =
      this.getValue(
        character,
        [
          name,
          ...aliases,
        ],
        fallback,
      )

    const modifier =
      this.getModifier(
        value,
      )

    return {

      name,

      value,

      modifier,

    }

  }


  // ==========================================================
  // FORÇA
  // ==========================================================

  static getStrength(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Força",
      [
        "Strength",
      ],
    )

  }


  // ==========================================================
  // DESTREZA
  // ==========================================================

  static getDexterity(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Destreza",
      [
        "Dexterity",
        "Agilidade",
      ],
    )

  }


  // ==========================================================
  // CONSTITUIÇÃO
  // ==========================================================

  static getConstitution(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Constituição",
      [
        "Constitution",
        "Vigor",
      ],
    )

  }


  // ==========================================================
  // INTELIGÊNCIA
  // ==========================================================

  static getIntelligence(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Inteligência",
      [
        "Intelligence",
      ],
    )

  }


  // ==========================================================
  // SABEDORIA
  // ==========================================================

  static getWisdom(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Sabedoria",
      [
        "Wisdom",
        "Percepção",
      ],
    )

  }


  // ==========================================================
  // CARISMA
  // ==========================================================

  static getCharisma(
    character: Character,
  ): CharacterStat {

    return this.getStat(
      character,
      "Carisma",
      [
        "Charisma",
      ],
    )

  }


  // ==========================================================
  // ATAQUE
  //
  // Se existir um campo específico "Ataque",
  // usamos ele como bônus.
  //
  // Caso contrário usamos Força.
  //
  // ==========================================================

  static getAttackModifier(
  character: Character,
): number {

  const attackField =
    (character.sheet_values ?? []).find(
      (item) =>
        item.field.name === "Ataque",
    )

  if (attackField) {

    const attack =
      Number(
        attackField.value,
      )

    if (!Number.isNaN(attack)) {

      return attack

    }

  }

  return this.getStrength(
    character,
  ).modifier

}


  // ==========================================================
  // DEFESA
  //
  // Se existir "Defesa", usamos o valor diretamente.
  //
  // Caso contrário:
  //
  // 10 + modificador de Destreza
  //
  // ==========================================================

  static getDefense(
  character: Character,
): number {

  const defenseField =
    (character.sheet_values ?? []).find(
      (item) =>
        item.field.name === "Defesa",
    )

  if (defenseField) {

    const defense =
      Number(
        defenseField.value,
      )

    if (!Number.isNaN(defense)) {

      return defense

    }

  }

  return (
    10 +
    this.getDexterity(
      character,
    ).modifier
  )

}


  // ==========================================================
  // BÔNUS DE PERÍCIA
  // ==========================================================

  static getSkillModifier(
    character: Character,
    attribute: string,
  ): number {

    const stat =
      this.getStat(
        character,
        attribute,
        [],
      )

    return stat.modifier

  }

}