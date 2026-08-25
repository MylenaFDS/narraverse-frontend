import {
  DiceEngine,
  type DiceResult,
} from "./DiceEngine"

import type {
  DiceCheckResult,
  DiceOutcome,
} from "./DiceTypes"


export class DiceResolver {

  static resolve(
    expression: string,
    difficulty: number,
  ): DiceCheckResult {

    const roll: DiceResult =
      DiceEngine.roll(
        expression,
      )

    // ==========================================
    // RESULTADO INVÁLIDO
    // ==========================================

    if (roll.rolls.length === 0) {
      return {
        ...roll,
        difficulty,
        success: false,
        outcome: "failure",
        margin: 0,
      }
    }

    // ==========================================
    // MARGEM
    // ==========================================

    const margin =
      roll.total - difficulty

    let outcome: DiceOutcome

    // ==========================================
    // CRÍTICOS
    // ==========================================

    const isSingleD20 =
      roll.rolls.length === 1 &&
      /^1d20([+-]\d+)?$/i.test(
        expression,
      )

    if (
      isSingleD20 &&
      roll.rolls[0] === 1
    ) {

      outcome =
        "critical_failure"

    } else if (
      isSingleD20 &&
      roll.rolls[0] === 20
    ) {

      outcome =
        "critical_success"

    }

    // ==========================================
    // FALHA
    // ==========================================

    else if (margin <= -5) {

      outcome =
        "failure"

    }

    // ==========================================
    // SUCESSO PARCIAL
    // ==========================================

    else if (margin < 0) {

      outcome =
        "partial_success"

    }

    // ==========================================
    // SUCESSO CRÍTICO
    // ==========================================

    else if (margin >= 10) {

      outcome =
        "critical_success"

    }

    // ==========================================
    // SUCESSO NORMAL
    // ==========================================

    else {

      outcome =
        "success"

    }

    return {

      ...roll,

      difficulty,

      success:
        outcome === "success" ||
        outcome === "critical_success",

      outcome,

      margin,

    }

  }

}