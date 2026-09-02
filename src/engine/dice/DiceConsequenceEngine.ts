import type {
  DiceCheckResult,
  DiceOutcome,
} from "./DiceTypes"


// ============================================================
// TIPOS
// ============================================================

export interface DiceConsequence {
  outcome: DiceOutcome
  title: string
  description: string
  severity: number
  success: boolean
}


// ============================================================
// ENGINE
// ============================================================

export class DiceConsequenceEngine {

  static resolve(
    result: DiceCheckResult,
  ): DiceConsequence {

    // ==========================================
    // FALHA CRÍTICA
    // ==========================================

    if (
      result.outcome ===
      "critical_failure"
    ) {

      return {
        outcome:
          "critical_failure",

        title:
          "Falha crítica",

        description:
          "A ação falha de maneira grave e uma consequência inesperada ou perigosa pode acontecer.",

        severity: 3,

        success: false,
      }

    }


    // ==========================================
    // FALHA
    // ==========================================

    if (
      result.outcome ===
      "failure"
    ) {

      return {
        outcome:
          "failure",

        title:
          "Falha",

        description:
          "A ação não é bem-sucedida e a situação pode se tornar mais difícil.",

        severity: 2,

        success: false,
      }

    }


    // ==========================================
    // SUCESSO PARCIAL
    // ==========================================

    if (
      result.outcome ===
      "partial_success"
    ) {

      return {
        outcome:
          "partial_success",

        title:
          "Sucesso parcial",

        description:
          "A ação funciona parcialmente, mas existe um custo, risco ou complicação.",

        severity: 1,

        success: false,
      }

    }


    // ==========================================
    // SUCESSO CRÍTICO
    // ==========================================

    if (
      result.outcome ===
      "critical_success"
    ) {

      return {
        outcome:
          "critical_success",

        title:
          "Sucesso crítico",

        description:
          "A ação é realizada de maneira excepcional, produzindo um resultado especialmente favorável.",

        severity: 0,

        success: true,
      }

    }


    // ==========================================
    // SUCESSO NORMAL
    // ==========================================

    return {

      outcome:
        "success",

      title:
        "Sucesso",

      description:
        "A ação é realizada com sucesso.",

      severity: 0,

      success: true,

    }

  }

}