import type { Character } from "../types/character"
import type { WorldContext } from "./context/ContextEngine"

import {
  CharacterStatsEngine,
} from "./CharacterStatsEngine"

import {
  DiceResolver,
} from "./dice/DiceResolver"

import {
  DiceConsequenceEngine,
  type DiceConsequence,
} from "./dice/DiceConsequenceEngine"

import {
  CombatEngine,
  type CombatAction,
} from "./combat/CombatEngine"
import {
  CombatActionEngine,
  type CombatActionResult,
} from "./combat/CombatActionEngine"

import type {
  CombatState,
} from "./combat/CombatState"

// ============================================================
// TIPOS
// ============================================================

export type ActionType =
  | "move"
  | "attack"
  | "spell"
  | "skill"
  | "talk"
  | "investigate"
  | "rest"
  | "explore"
  | "defend"
  | "escape"
  | "retreat"
  | "flee"
  | "wait"
  | "advance_goal"


// ============================================================
// PEDIDO DE AÇÃO
// ============================================================

export interface ActionRequest {

  /**
   * Tipo da ação.
   */
  type: ActionType

  /**
   * Personagem que realiza a ação.
   */
  actor: Character

  /**
   * Alvo da ação, quando existir.
   */
  target?: Character

  /**
   * Expressão base da rolagem.
   *
   * Exemplo:
   *
   * 1d20
   */
  expression?: string

  /**
   * Dificuldade do teste.
   *
   * Se não for informada,
   * será utilizada a dificuldade padrão.
   */
  difficulty?: number

  /**
   * Atributo utilizado pelo teste.
   *
   * Exemplos:
   *
   * "Força"
   * "Destreza"
   * "Inteligência"
   * "Sabedoria"
   * "Carisma"
   *
   * Quando não informado, cada tipo
   * de ação possui um atributo padrão.
   */
  attribute?: string

    /**
   * Estado atual do combate.
   *
   * Quando informado em uma ação de ataque,
   * o ataque será realmente resolvido e o estado
   * será atualizado.
   */
  combatState?: CombatState

}


// ============================================================
// RESULTADO DE DADOS
// ============================================================

export interface ActionDiceResult {

  expression: string

  difficulty: number

  total: number

  rolls: number[]

  modifier: number

  outcome: string

  margin: number

}


// ============================================================
// RESULTADO DA AÇÃO
// ============================================================

export interface ActionResult {

  /**
   * Indica sucesso completo ou crítico.
   *
   * Sucesso parcial permanece false,
   * pois ainda possui uma consequência/custo.
   */
  success: boolean

  /**
   * Descrição mecânica do resultado.
   */
  description: string

  /**
   * Tipo da ação.
   */
  action: ActionType

  /**
   * Indica se houve rolagem.
   */
  requiresRoll: boolean

  /**
   * Resultado do teste.
   */
  dice?: ActionDiceResult

  /**
   * Consequência determinada pelos dados.
   */
  consequence?: DiceConsequence

  /**
   * Informações produzidas pelo CombatEngine.
   */
  combat?: {

    probability: number

    damage: number

    criticalChance: number

    modifiers: string[]

    consequences: string[]

  }
    /**
   * Resultado completo de uma ação de combate.
   */
  combatResult?: CombatActionResult

  /**
   * Novo estado do combate.
   */
  combatState?: CombatState

}


// ============================================================
// ENGINE
// ============================================================

export class ActionEngine {


  // ==========================================================
  // EXECUTAR
  // ==========================================================

  static execute(
    context: WorldContext,
    request: ActionRequest,
  ): ActionResult {

    switch (request.type) {


      // ======================================================
      // MOVIMENTO
      // ======================================================

      case "move":

        return {

          success: true,

          description:
            "O personagem mudou de localização.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // ATAQUE
      // ======================================================

      case "attack":

        return this.executeAttack(
          context,
          request,
        )


      // ======================================================
      // MAGIA
      // ======================================================

      case "spell":

        return this.executeDiceAction(
          request,
          "A magia",
          request.attribute ??
            "Inteligência",
        )


      // ======================================================
      // HABILIDADE
      // ======================================================

      case "skill":

        return this.executeDiceAction(
          request,
          "A habilidade",
          request.attribute ??
            "Destreza",
        )


      // ======================================================
      // CONVERSA
      // ======================================================

      case "talk":

        return {

          success: true,

          description:
            "Uma conversa foi iniciada.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // INVESTIGAÇÃO
      // ======================================================

      case "investigate":

        return this.executeDiceAction(
          request,
          "A investigação",
          request.attribute ??
            "Inteligência",
        )


      // ======================================================
      // EXPLORAÇÃO
      // ======================================================

      case "explore":

        return {

          success: true,

          description:
            "O personagem explorou a região ao redor.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // DEFESA
      // ======================================================

      case "defend":

        return {

          success: true,

          description:
            "O personagem assumiu uma postura defensiva.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // ESCAPE
      // ======================================================

      case "escape":

        return this.executeDiceAction(
          request,
          "A tentativa de escapar",
          request.attribute ??
            "Destreza",
        )


      // ======================================================
      // RETIRADA
      // ======================================================

      case "retreat":

        return {

          success: true,

          description:
            "O personagem recuou.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // FUGA
      // ======================================================

      case "flee":

        return this.executeDiceAction(
          request,
          "A tentativa de fuga",
          request.attribute ??
            "Destreza",
        )


      // ======================================================
      // ESPERAR
      // ======================================================

      case "wait":

        return {

          success: true,

          description:
            "O personagem aguardou.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // PROGRESSO DO OBJETIVO
      // ======================================================

      case "advance_goal":

        return {

          success: true,

          description:
            "O personagem avançou em direção ao seu objetivo.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // DESCANSO
      // ======================================================

      case "rest":

        return {

          success: true,

          description:
            "O personagem descansou.",

          action:
            request.type,

          requiresRoll:
            false,

        }

    }

  }


  // ==========================================================
  // AÇÃO QUE UTILIZA DADOS
  // ==========================================================

  private static executeDiceAction(
    request: ActionRequest,
    actionDescription: string,
    defaultAttribute: string,
  ): ActionResult {

    // --------------------------------------------------------
    // EXPRESSÃO BASE
    // --------------------------------------------------------

    const baseExpression =
      request.expression ??
      "1d20"


    // --------------------------------------------------------
    // DIFICULDADE
    // --------------------------------------------------------

    const difficulty =
      request.difficulty ??
      15


    // --------------------------------------------------------
    // ATRIBUTO
    // --------------------------------------------------------

    const attribute =
      request.attribute ??
      defaultAttribute


    // --------------------------------------------------------
    // OBTER MODIFICADOR
    // --------------------------------------------------------

    const modifier =
      CharacterStatsEngine.getSkillModifier(
        request.actor,
        attribute,
      )


    // --------------------------------------------------------
    // APLICAR MODIFICADOR
    // --------------------------------------------------------

    const expression =
      this.applyModifier(
        baseExpression,
        modifier,
      )


    // --------------------------------------------------------
    // RESOLVER DADOS
    // --------------------------------------------------------

    const result =
      DiceResolver.resolve(
        expression,
        difficulty,
      )


    // --------------------------------------------------------
    // RESOLVER CONSEQUÊNCIA
    // --------------------------------------------------------

    const consequence =
      DiceConsequenceEngine.resolve(
        result,
      )


    // --------------------------------------------------------
    // DESCRIÇÃO
    // --------------------------------------------------------

    const description =
      this.describeActionResult(
        actionDescription,
        consequence,
      )


    // --------------------------------------------------------
    // RESULTADO
    // --------------------------------------------------------

    return {

      success:
        consequence.success,

      description,

      action:
        request.type,

      requiresRoll:
        true,

      dice: {

        expression:
          result.expression,

        difficulty:
          result.difficulty,

        total:
          result.total,

        rolls:
          result.rolls,

        modifier:
          result.modifier,

        outcome:
          result.outcome,

        margin:
          result.margin,

      },

      consequence,

    }

  }


  // ==========================================================
  // APLICAR MODIFICADOR
  // ==========================================================

  private static applyModifier(
    expression: string,
    modifier: number,
  ): string {

    const normalized =
      expression.trim()


    if (
      modifier === 0
    ) {

      return normalized

    }


    const match =
      normalized.match(
        /^(\d+d\d+)([+-]\d+)?$/i,
      )


    if (!match) {

      return normalized

    }


    const dice =
      match[1]


    const existingModifier =
      Number(
        match[2] ?? 0,
      )


    const totalModifier =
      existingModifier +
      modifier


    if (
      totalModifier === 0
    ) {

      return dice

    }


    if (
      totalModifier > 0
    ) {

      return (
        `${dice}+${totalModifier}`
      )

    }


    return (
      `${dice}${totalModifier}`
    )

  }


  // ==========================================================
  // ATAQUE
  // ==========================================================

  private static executeAttack(
    context: WorldContext,
    request: ActionRequest,
  ): ActionResult {

    if (!request.target) {

      return {

        success: false,

        description:
          "Nenhum alvo foi definido para o ataque.",

        action:
          "attack",

        requiresRoll:
          false,

      }

    }


    // ========================================================
    // EXECUÇÃO REAL DE COMBATE
    // ========================================================

    if (request.combatState) {

      const combatResult =
        CombatActionEngine.execute(
          context,
          request.combatState,
          {
            attacker:
              request.actor,

            defender:
              request.target,

            action:
              "attack",
          },
        )


      return {

        success:
          combatResult.combat.success,

        description:
          this.describeCombatResult(
            combatResult,
          ),

        action:
          "attack",

        requiresRoll:
          true,

        combatResult,

        combatState:
          combatResult.state,

        combat: {

          probability:
            combatResult.combat.probability,

          damage:
            combatResult.combat.damage,

          criticalChance:
            combatResult.combat.criticalChance,

          modifiers:
            combatResult.combat.modifiers,

          consequences:
            combatResult.combat.consequences,

        },

      }

    }


    // ========================================================
    // MODO ANÁLISE
    // ========================================================

    const combatAction:
      CombatAction = {

      attacker: {

        character:
          request.actor,

      },

      defender: {

        character:
          request.target,

      },

      action:
        "attack",

    }


    const combat =
      CombatEngine.analyze(
        context,
        combatAction,
      )


    return {

      success:
        false,

      description:
        "O ataque foi analisado e está pronto para resolução.",

      action:
        "attack",

      requiresRoll:
        true,

      combat,

    }

  }

    // ==========================================================
  // DESCRIÇÃO DO COMBATE
  // ==========================================================

  private static describeCombatResult(
    result: CombatActionResult,
  ): string {

    const combat =
      result.combat


    switch (combat.outcome) {

      case "critical_failure":

        return (
          "O ataque sofreu uma falha crítica. " +
          combat.consequences.join(" ")
        )


      case "failure":

        return (
          "O ataque falhou. " +
          combat.consequences.join(" ")
        )


      case "partial_success":

        return (
          "O ataque teve sucesso parcial. " +
          combat.consequences.join(" ")
        )


      case "critical_success":

        return (
          `O ataque foi um sucesso crítico e causou ` +
          `${combat.damage} de dano. ` +
          combat.consequences.join(" ")
        )


      case "success":

        return (
          `O ataque foi bem-sucedido e causou ` +
          `${combat.damage} de dano. ` +
          combat.consequences.join(" ")
        )


      default:

        return (
          "O ataque foi resolvido."
        )

    }

  }
  
  // ==========================================================
  // DESCRIÇÃO DO RESULTADO
  // ==========================================================

  private static describeActionResult(
    actionDescription: string,
    consequence: DiceConsequence,
  ): string {

    switch (
      consequence.outcome
    ) {


      // ------------------------------------------------------
      // FALHA CRÍTICA
      // ------------------------------------------------------

      case "critical_failure":

        return (
          `${actionDescription} terminou em ` +
          `uma falha crítica. ` +
          `${consequence.description}`
        )


      // ------------------------------------------------------
      // FALHA
      // ------------------------------------------------------

      case "failure":

        return (
          `${actionDescription} falhou. ` +
          `${consequence.description}`
        )


      // ------------------------------------------------------
      // SUCESSO PARCIAL
      // ------------------------------------------------------

      case "partial_success":

        return (
          `${actionDescription} teve sucesso parcial. ` +
          `${consequence.description}`
        )


      // ------------------------------------------------------
      // SUCESSO CRÍTICO
      // ------------------------------------------------------

      case "critical_success":

        return (
          `${actionDescription} alcançou um ` +
          `sucesso crítico. ` +
          `${consequence.description}`
        )


      // ------------------------------------------------------
      // SUCESSO
      // ------------------------------------------------------

      case "success":

        return (
          `${actionDescription} foi bem-sucedida. ` +
          `${consequence.description}`
        )


      // ------------------------------------------------------
      // FALLBACK
      // ------------------------------------------------------

      default:

        return (
          `${actionDescription} foi resolvida.`
        )

    }

  }

}