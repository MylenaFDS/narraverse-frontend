import type {
  DiceCheckResult,
} from "./DiceTypes"


// ============================================================
// TIPOS
// ============================================================

export type ConsequenceType =
  | "failure"
  | "partial_success"
  | "success"
  | "critical_success"


export interface TurnConsequence {

  type: ConsequenceType

  success: boolean

  severity: number

  description: string

  effects: string[]

}


// ============================================================
// ENGINE
// ============================================================

export class TurnConsequenceEngine {


  // ==========================================================
  // RESOLVE
  // ==========================================================

  static resolve(
    result: DiceCheckResult,
  ): TurnConsequence {

    switch (result.outcome) {


      // ======================================================
      // FALHA CRÍTICA
      // ======================================================

      case "critical_failure":

        return {

          type:
            "failure",

          success:
            false,

          severity:
            5,

          description:
            "A ação sofreu uma falha crítica e produziu uma consequência grave.",

          effects: [

            "A ação falhou.",

            "Uma consequência negativa adicional pode ocorrer.",

          ],

        }


      // ======================================================
      // FALHA
      // ======================================================

      case "failure":

        return {

          type:
            "failure",

          success:
            false,

          severity:
            3,

          description:
            "A ação falhou e produziu uma consequência negativa.",

          effects: [

            "O objetivo não foi alcançado.",

            "A situação pode se tornar mais difícil.",

          ],

        }


      // ======================================================
      // SUCESSO PARCIAL
      // ======================================================

      case "partial_success":

        return {

          type:
            "partial_success",

          success:
            false,

          severity:
            2,

          description:
            "A ação teve sucesso parcial, mas trouxe uma complicação.",

          effects: [

            "Parte do objetivo foi alcançada.",

            "Uma consequência ou complicação pode ocorrer.",

          ],

        }


      // ======================================================
      // SUCESSO
      // ======================================================

      case "success":

        return {

          type:
            "success",

          success:
            true,

          severity:
            1,

          description:
            "A ação foi bem-sucedida.",

          effects: [

            "O objetivo foi alcançado.",

          ],

        }


      // ======================================================
      // SUCESSO CRÍTICO
      // ======================================================

      case "critical_success":

        return {

          type:
            "critical_success",

          success:
            true,

          severity:
            0,

          description:
            "A ação foi realizada com sucesso excepcional.",

          effects: [

            "O objetivo foi alcançado.",

            "Uma vantagem adicional pode ser obtida.",

          ],

        }

    }

  }

}