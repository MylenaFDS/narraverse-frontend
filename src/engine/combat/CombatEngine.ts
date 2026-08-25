import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"

import { CampaignEngine } from "../CampaignEngine"
import { TerrainEngine } from "./TerrainEngine"
import { WeatherEngine } from "./WeatherEngine"
import { EquipmentEngine } from "./EquipmentEngine"
import { RulesEngine } from "./RulesEngine"

import {
  CharacterStatsEngine,
} from "../CharacterStatsEngine"

import {
  DiceResolver,
} from "../dice/DiceResolver"


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


export interface CombatResult
  extends CombatSuggestion {

  success: boolean

  outcome: string

  attackRoll: {

    expression: string

    rolls: number[]

    modifier: number

    total: number

    difficulty: number

    margin: number

  }

}


export class CombatEngine {


  // ============================================================
  // CALCULAR ATAQUE
  // ============================================================

  private static calculateAttack(
    context: WorldContext,
    character: Character,
  ): number {

    const terrain =
      TerrainEngine.current(
        context,
      )

    const weather =
      WeatherEngine.current(
        context,
      )

    const equipment =
      EquipmentEngine.get(
        character.inventory ?? [],
      )

    const baseModifier =
      CharacterStatsEngine.getAttackModifier(
        character,
      )

    return (
      baseModifier +
      equipment.attackBonus +
      terrain.attackModifier +
      weather.attackModifier
    )

  }


  // ============================================================
  // CALCULAR DEFESA
  // ============================================================

  private static calculateDefense(
    context: WorldContext,
    character: Character,
  ): number {

    const terrain =
      TerrainEngine.current(
        context,
      )

    const weather =
      WeatherEngine.current(
        context,
      )

    const equipment =
      EquipmentEngine.get(
        character.inventory ?? [],
      )

    const baseDefense =
      CharacterStatsEngine.getDefense(
        character,
      )

    return (
      baseDefense +
      equipment.defenseBonus +
      terrain.defenseModifier +
      weather.defenseModifier
    )

  }


  // ============================================================
  // ANÁLISE
  // ============================================================

  static analyze(
    context: WorldContext,
    combat: CombatAction,
  ): CombatSuggestion {

    const campaign =
      CampaignEngine.snapshot(
        context,
      )


    const terrain =
      TerrainEngine.current(
        context,
      )


    const weather =
      WeatherEngine.current(
        context,
      )


    const attackerEquipment =
      EquipmentEngine.get(
        combat.attacker.character.inventory ?? [],
      )


    const defenderEquipment =
      EquipmentEngine.get(
        combat.defender.character.inventory ?? [],
      )


    // ==========================================================
    // ATAQUE
    // ==========================================================

    const attack =
      this.calculateAttack(
        context,
        combat.attacker.character,
      )


    // ==========================================================
    // DEFESA
    // ==========================================================

    const defense =
      this.calculateDefense(
        context,
        combat.defender.character,
      )


    // ==========================================================
    // REGRAS
    // ==========================================================

    RulesEngine.applyAttackRules(
      attack,
      defense,
    )


    // ==========================================================
    // PROBABILIDADE
    // ==========================================================

    const probability =
      Math.max(
        5,
        Math.min(
          95,
          50 + attack - defense,
        ),
      )


    // ==========================================================
    // DANO BASE
    // ==========================================================

    const damage =
      Math.max(
        1,
        Math.round(
          Math.max(
            1,
            attack,
          ) / 2,
        ),
      )


    // ==========================================================
    // CRÍTICO
    // ==========================================================

    const criticalChance =
      CharacterStatsEngine.getValue(
        combat.attacker.character,
        [
          "Crítico",
          "Critico",
        ],
        5,
      )


    // ==========================================================
    // HP
    // ==========================================================

    const hp =
      CharacterStatsEngine.getValue(
        combat.defender.character,
        [
          "HP",
          "Vida",
        ],
        100,
      )


    // ==========================================================
    // MODIFICADORES
    // ==========================================================

    const modifiers: string[] = [

      terrain.name,

      weather.name,

      attackerEquipment.weapon,

      defenderEquipment.armor,

    ]


    // ==========================================================
    // CONSEQUÊNCIAS
    // ==========================================================

    const consequences: string[] = []


    if (damage >= hp) {

      consequences.push(
        "O alvo poderá ser derrotado.",
      )

    }


    if (
      campaign.events.length > 0
    ) {

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


  // ============================================================
  // RESOLUÇÃO REAL
  // ============================================================

  static resolve(
    context: WorldContext,
    combat: CombatAction,
  ): CombatResult {

    // ==========================================================
    // ANÁLISE
    // ==========================================================

    const suggestion =
      this.analyze(
        context,
        combat,
      )


    // ==========================================================
    // ATAQUE
    // ==========================================================

    const attack =
      this.calculateAttack(
        context,
        combat.attacker.character,
      )


    // ==========================================================
    // DEFESA
    // ==========================================================

    const defense =
      this.calculateDefense(
        context,
        combat.defender.character,
      )


    // ==========================================================
    // ROLAGEM
    // ==========================================================

    const expression =
      attack >= 0
        ? `1d20+${attack}`
        : `1d20${attack}`


    const attackRoll =
      DiceResolver.resolve(
        expression,
        defense,
      )


    // ==========================================================
    // DANO
    // ==========================================================

    let damage =
      suggestion.damage


    // ==========================================================
    // FALHA
    // ==========================================================

    if (
      !attackRoll.success
    ) {

      damage = 0

    }


    // ==========================================================
    // CRÍTICO
    // ==========================================================

    if (
      attackRoll.outcome ===
      "critical_success"
    ) {

      damage *= 2

    }


    // ==========================================================
    // CONSEQUÊNCIAS
    // ==========================================================

    const consequences = [
      ...suggestion.consequences,
    ]


    if (
      attackRoll.outcome ===
      "critical_success"
    ) {

      consequences.push(
        "O ataque foi um sucesso crítico.",
      )

    }


    if (
      attackRoll.outcome ===
      "critical_failure"
    ) {

      consequences.push(
        "O ataque sofreu uma falha crítica.",
      )

    }


    if (
      attackRoll.outcome ===
      "partial_success"
    ) {

      consequences.push(
        "O ataque teve sucesso parcial.",
      )

    }


    // ==========================================================
    // RESULTADO
    // ==========================================================

    return {

      ...suggestion,

      success:
        attackRoll.success,

      outcome:
        attackRoll.outcome,

      damage,

      consequences,

      attackRoll: {

        expression:
          attackRoll.expression,

        rolls:
          attackRoll.rolls,

        modifier:
          attackRoll.modifier,

        total:
          attackRoll.total,

        difficulty:
          attackRoll.difficulty,

        margin:
          attackRoll.margin,

      },

    }

  }

}