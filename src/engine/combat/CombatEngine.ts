import type { Character } from "../../types/character"

import type { WorldContext } from "../ContextEngine"

import { CampaignEngine } from "../CampaignEngine"
import { TerrainEngine } from "./TerrainEngine"
import { WeatherEngine } from "./WeatherEngine"
import { EquipmentEngine } from "./EquipmentEngine"
import { CharacterSheetEngine } from "../CharacterSheetEngine"
import { RulesEngine } from "./RulesEngine"

export interface CombatParticipant {
  character: Character
}

export interface CombatAction {
  attacker: CombatParticipant

  defender: CombatParticipant

  action:
    | "attack"
    | "spell"
    | "skill"
}

export interface CombatSuggestion {
  probability: number

  damage: number

  criticalChance: number

  modifiers: string[]

  consequences: string[]
}

export class CombatEngine {

  static analyze(
    context: WorldContext,
    combat: CombatAction,
  ): CombatSuggestion {

    const campaign =
      CampaignEngine.snapshot(context)

    const terrain =
      TerrainEngine.current(context)

    const weather =
      WeatherEngine.current(context)

    const attackerEquipment =
  EquipmentEngine.get(
    combat.attacker.character.inventory ?? [],
  )

const defenderEquipment =
  EquipmentEngine.get(
    combat.defender.character.inventory ?? [],
  )

    const attack =
      (
        CharacterSheetEngine.getNumber(
          combat.attacker.character,
          "Ataque",
        ) ||

        CharacterSheetEngine.getNumber(
          combat.attacker.character,
          "Força",
        ) ||

        10
      ) +
      attackerEquipment.attackBonus +
      terrain.attackModifier +
      weather.attackModifier

    const defense =
      (
        CharacterSheetEngine.getNumber(
          combat.defender.character,
          "Defesa",
        ) ||

        CharacterSheetEngine.getNumber(
          combat.defender.character,
          "Armadura",
        ) ||

        10
      ) +
      defenderEquipment.defenseBonus +
      terrain.defenseModifier +
      weather.defenseModifier

    RulesEngine.applyAttackRules(
      attack,
      defense,
    )

    const probability = Math.max(
      5,
      Math.min(
        95,
        50 + attack - defense,
      ),
    )

    const damage = Math.max(
      1,
      Math.round(attack / 2),
    )

    const criticalChance =
      CharacterSheetEngine.getNumber(
        combat.attacker.character,
        "Crítico",
      ) || 5

    const hp =
      CharacterSheetEngine.getNumber(
        combat.defender.character,
        "HP",
      ) ||

      CharacterSheetEngine.getNumber(
        combat.defender.character,
        "Vida",
      ) ||

      100

    const modifiers: string[] = [
      terrain.name,
      weather.name,
      attackerEquipment.weapon,
      defenderEquipment.armor,
    ]

    const consequences: string[] = []

    if (damage >= hp) {

      consequences.push(
        "O alvo poderá ser derrotado.",
      )

    }

    if (campaign.events.length > 0) {

      consequences.push(
        "Eventos anteriores podem alterar a narrativa.",
      )

    }

    return {

      probability,

      damage,

      criticalChance,

      modifiers,

      consequences,

    }

  }

}