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

import type {
  DiceOutcome,
} from "../dice/DiceTypes"


// ============================================================
// PARTICIPANTE
// ============================================================

export interface CombatParticipant {

  character: Character

}


// ============================================================
// AÇÃO DE COMBATE
// ============================================================

export type CombatActionType =
  | "attack"
  | "spell"
  | "skill"


export interface CombatAction {

  attacker: CombatParticipant

  defender: CombatParticipant

  action: CombatActionType

}


// ============================================================
// SUGESTÃO DE COMBATE
//
// Representa uma previsão.
// Não representa o resultado real da rolagem.
// ============================================================

export interface CombatSuggestion {

  probability: number

  damage: number

  criticalChance: number

  modifiers: string[]

  consequences: string[]

}


// ============================================================
// ROLAGEM DE ATAQUE
// ============================================================

export interface CombatAttackRoll {

  expression: string

  rolls: number[]

  modifier: number

  total: number

  difficulty: number

  margin: number

}


// ============================================================
// RESULTADO REAL DO COMBATE
// ============================================================

export interface CombatResult
  extends CombatSuggestion {

  attackerId: number

  defenderId: number

  action: CombatActionType

  success: boolean

  outcome: DiceOutcome

  damage: number

  attackRoll: CombatAttackRoll

}


// ============================================================
// ENGINE DE COMBATE
// ============================================================

export class CombatEngine {


  // ==========================================================
  // CALCULAR MODIFICADOR DE ATAQUE
  // ==========================================================

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


  // ==========================================================
  // CALCULAR DEFESA
  // ==========================================================

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


  // ==========================================================
  // OBTER CHANCE DE CRÍTICO
  // ==========================================================

  private static getCriticalChance(
    character: Character,
  ): number {

    return CharacterStatsEngine.getValue(
      character,
      [
        "Crítico",
        "Critico",
      ],
      5,
    )

  }


  // ==========================================================
  // OBTER HP
  // ==========================================================

  private static getHP(
    character: Character,
  ): number {

    return CharacterStatsEngine.getValue(
      character,
      [
        "HP",
        "Vida",
      ],
      100,
    )

  }


  // ==========================================================
  // CALCULAR DANO BASE
  // ==========================================================

  private static calculateBaseDamage(
    attack: number,
  ): number {

    return Math.max(
      1,
      Math.round(
        Math.max(
          1,
          attack,
        ) / 2,
      ),
    )

  }


  // ==========================================================
  // CONSTRUIR EXPRESSÃO DE DADO
  // ==========================================================

  private static buildAttackExpression(
    attack: number,
  ): string {

    if (attack >= 0) {

      return `1d20+${attack}`

    }

    return `1d20${attack}`

  }


  // ==========================================================
  // CALCULAR PROBABILIDADE
  //
  // Isto é uma estimativa.
  // A rolagem real acontece em resolve().
  // ==========================================================

  private static calculateProbability(
    attack: number,
    defense: number,
  ): number {

    return Math.max(
      5,
      Math.min(
        95,
        50 + attack - defense,
      ),
    )

  }


  // ==========================================================
  // GERAR MODIFICADORES
  // ==========================================================

  private static getModifiers(
    context: WorldContext,
    attacker: Character,
    defender: Character,
  ): string[] {

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
        attacker.inventory ?? [],
      )

    const defenderEquipment =
      EquipmentEngine.get(
        defender.inventory ?? [],
      )

    return [

      terrain.name,

      weather.name,

      attackerEquipment.weapon,

      defenderEquipment.armor,

    ]

  }


  // ==========================================================
  // ANÁLISE
  //
  // Calcula uma previsão do combate sem realizar uma rolagem.
  // ==========================================================

  static analyze(
    context: WorldContext,
    combat: CombatAction,
  ): CombatSuggestion {

    const campaign =
      CampaignEngine.snapshot(
        context,
      )

    const attacker =
      combat.attacker.character

    const defender =
      combat.defender.character


    // ========================================================
    // ATAQUE
    // ========================================================

    const attack =
      this.calculateAttack(
        context,
        attacker,
      )


    // ========================================================
    // DEFESA
    // ========================================================

    const defense =
      this.calculateDefense(
        context,
        defender,
      )


    // ========================================================
    // REGRAS
    // ========================================================

    RulesEngine.applyAttackRules(
      attack,
      defense,
    )


    // ========================================================
    // PROBABILIDADE
    // ========================================================

    const probability =
      this.calculateProbability(
        attack,
        defense,
      )


    // ========================================================
    // DANO
    // ========================================================

    const damage =
      this.calculateBaseDamage(
        attack,
      )


    // ========================================================
    // CRÍTICO
    // ========================================================

    const criticalChance =
      this.getCriticalChance(
        attacker,
      )


    // ========================================================
    // HP
    // ========================================================

    const hp =
      this.getHP(
        defender,
      )


    // ========================================================
    // MODIFICADORES
    // ========================================================

    const modifiers =
      this.getModifiers(
        context,
        attacker,
        defender,
      )


    // ========================================================
    // CONSEQUÊNCIAS
    // ========================================================

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


  // ==========================================================
  // RESOLVER COMBATE
  //
  // Aqui acontece a rolagem real.
  // ==========================================================

  static resolve(
    context: WorldContext,
    combat: CombatAction,
  ): CombatResult {

    const attacker =
      combat.attacker.character

    const defender =
      combat.defender.character


    // ========================================================
    // ANÁLISE
    // ========================================================

    const suggestion =
      this.analyze(
        context,
        combat,
      )


    // ========================================================
    // VALORES DE COMBATE
    // ========================================================

    const attack =
      this.calculateAttack(
        context,
        attacker,
      )

    const defense =
      this.calculateDefense(
        context,
        defender,
      )


    // ========================================================
    // EXPRESSÃO
    // ========================================================

    const expression =
      this.buildAttackExpression(
        attack,
      )


    // ========================================================
    // ROLAGEM
    // ========================================================

    const attackRoll =
      DiceResolver.resolve(
        expression,
        defense,
      )


    // ========================================================
    // DANO INICIAL
    // ========================================================

    let damage =
      suggestion.damage


    // ========================================================
    // FALHA
    // ========================================================

    if (!attackRoll.success) {

      damage = 0

    }


    // ========================================================
    // CRÍTICO
    // ========================================================

    if (
      attackRoll.outcome ===
      "critical_success"
    ) {

      damage *= 2

    }


    // ========================================================
    // CONSEQUÊNCIAS
    // ========================================================

    const consequences = [
      ...suggestion.consequences,
    ]


    switch (
      attackRoll.outcome
    ) {

      case "critical_success":

        consequences.push(
          "O ataque foi um sucesso crítico.",
        )

        break


      case "critical_failure":

        consequences.push(
          "O ataque sofreu uma falha crítica.",
        )

        break


      case "partial_success":

        consequences.push(
          "O ataque teve sucesso parcial.",
        )

        break

    }


    // ========================================================
    // DERROTA POTENCIAL
    // ========================================================

    const hp =
      this.getHP(
        defender,
      )

    if (
      damage > 0 &&
      damage >= hp
    ) {

      consequences.push(
        "O dano pode deixar o alvo derrotado.",
      )

    }


    // ========================================================
    // RESULTADO
    // ========================================================

    return {

      ...suggestion,

      attackerId:
        attacker.id,

      defenderId:
        defender.id,

      action:
        combat.action,

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