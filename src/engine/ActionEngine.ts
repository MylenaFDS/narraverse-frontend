import type { Character } from "../types/character"
import type { WorldContext } from "./context/ContextEngine"

import {
  DiceResolver,
} from "./dice/DiceResolver"

import {
  CombatEngine,
  type CombatAction,
} from "./combat/CombatEngine"


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


export interface ActionRequest {

  type: ActionType

  actor: Character

  target?: Character

}


export interface ActionResult {

  success: boolean

  description: string

  action: ActionType

  requiresRoll: boolean

  dice?: {

    expression: string

    difficulty: number

    total: number

    rolls: number[]

    modifier: number

    outcome: string

    margin: number

  }

  combat?: {

    probability: number

    damage: number

    criticalChance: number

    modifiers: string[]

    consequences: string[]

  }

}


// ============================================================
// ENGINE
// ============================================================

export class ActionEngine {


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

        return {

          success: true,

          description:
            "O personagem lançou uma magia.",

          action:
            request.type,

          requiresRoll:
            false,

        }


      // ======================================================
      // HABILIDADE
      // ======================================================

      case "skill": {

        const result =
          DiceResolver.resolve(
            "1d20",
            15,
          )

        return {

          success:
            result.success,

          description:
            this.describeDiceResult(
              result.outcome,
            ),

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

        }

      }


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

      case "investigate": {

        const result =
          DiceResolver.resolve(
            "1d20",
            15,
          )

        return {

          success:
            result.success,

          description:
            result.success

              ? "O personagem encontrou algo importante."

              : "O personagem não encontrou nada relevante.",

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

        }

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
        "O ataque foi analisado.",

      action:
        "attack",

      requiresRoll:
        true,

      combat,

    }

  }


  // ==========================================================
  // DESCRIÇÃO DO RESULTADO
  // ==========================================================

  private static describeDiceResult(
    outcome: string,
  ): string {

    switch (outcome) {

      case "critical_failure":

        return "Uma falha crítica ocorreu."

      case "failure":

        return "A ação falhou."

      case "partial_success":

        return "A ação teve sucesso parcial."

      case "critical_success":

        return "Um sucesso crítico foi alcançado."

      case "success":

        return "A ação foi bem-sucedida."

      default:

        return "A ação foi resolvida."

    }

  }

}