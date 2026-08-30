// src/engine/dice/TurnDiceEngine.ts

import {
  DiceEngine,
  type DiceResult,
} from "./DiceEngine"


// ============================================================
// TIPOS
// ============================================================

export interface TurnDiceRoll {

  expression: string

  rolls: number[]

  modifier: number

  total: number

}


export interface TurnDiceResult {

  originalText: string

  processedText: string

  rolls: TurnDiceRoll[]

  hasRolls: boolean

}


// ============================================================
// ENGINE
// ============================================================

export class TurnDiceEngine {


  // ==========================================================
  // REGEX
  // ==========================================================

  /**
   * Detecta expressões de dados dentro do turno.
   *
   * Exemplos aceitos:
   *
   * 1d20
   * 1d20+5
   * 1d20-2
   * 2d6
   * 3d8+4
   * 2D20
   *
   * A rolagem precisa estar entre [[ ]].
   *
   * Exemplos:
   *
   * [[1d20]]
   * [[1d20+5]]
   * [[2d6+3]]
   */
  private static readonly DICE_PATTERN =
    /\[\[\s*(\d+d\d+(?:[+-]\d+)?)\s*\]\]/gi


  // ==========================================================
  // RESOLVER TURNO
  // ==========================================================

  static resolve(
    text: string,
  ): TurnDiceResult {

    const rolls: TurnDiceRoll[] = []

    if (!text.trim()) {

      return {

        originalText:
          text,

        processedText:
          text,

        rolls,

        hasRolls:
          false,

      }

    }


    const processedText =
      text.replace(
        this.DICE_PATTERN,
        (
          fullMatch,
          expression: string,
        ) => {

          const result =
            DiceEngine.roll(
              expression,
            )


          // ================================================
          // EXPRESSÃO INVÁLIDA
          // ================================================

          if (
            result.rolls.length === 0
          ) {

            return fullMatch

          }


          // ================================================
          // REGISTRA ROLAGEM
          // ================================================

          rolls.push({

            expression:
              result.expression,

            rolls:
              result.rolls,

            modifier:
              result.modifier,

            total:
              result.total,

          })


          // ================================================
          // TEXTO RESULTANTE
          // ================================================

          return this.formatResult(
            result,
          )

        },
      )


    return {

      originalText:
        text,

      processedText,

      rolls,

      hasRolls:
        rolls.length > 0,

    }

  }


  // ==========================================================
  // ROLAGEM DIRETA
  // ==========================================================

  static roll(
    expression: string,
  ): TurnDiceRoll | null {

    const normalized =
      expression.trim()


    const result =
      DiceEngine.roll(
        normalized,
      )


    if (
      result.rolls.length === 0
    ) {

      return null

    }


    return {

      expression:
        result.expression,

      rolls:
        result.rolls,

      modifier:
        result.modifier,

      total:
        result.total,

    }

  }


  // ==========================================================
  // VERIFICAR SE EXISTE ROLAGEM
  // ==========================================================

  static hasRoll(
    text: string,
  ): boolean {

    if (!text.trim()) {

      return false

    }


    return this.DICE_PATTERN.test(
      text,
    )

  }


  // ==========================================================
  // EXTRAIR EXPRESSÕES
  // ==========================================================

  static extractExpressions(
    text: string,
  ): string[] {

    if (!text.trim()) {

      return []

    }


    const expressions: string[] = []

    const regex =
      new RegExp(
        this.DICE_PATTERN.source,
        "gi",
      )


    let match:
      RegExpExecArray | null


    while (
      (match = regex.exec(text)) !== null
    ) {

      if (match[1]) {

        expressions.push(
          match[1],
        )

      }

    }


    return expressions

  }


  // ==========================================================
  // RESOLVER TODAS AS ROLAGENS
  // ==========================================================

  static resolveAll(
    text: string,
  ): TurnDiceRoll[] {

    const expressions =
      this.extractExpressions(
        text,
      )


    const results: TurnDiceRoll[] = []


    for (
      const expression of expressions
    ) {

      const result =
        this.roll(
          expression,
        )


      if (result) {

        results.push(
          result,
        )

      }

    }


    return results

  }


  // ==========================================================
  // FORMATAR RESULTADO
  // ==========================================================

  private static formatResult(
    result: DiceResult,
  ): string {

    const rolls =
      result.rolls.join(
        ", ",
      )


    let modifier = ""


    if (
      result.modifier > 0
    ) {

      modifier =
        ` + ${result.modifier}`

    } else if (
      result.modifier < 0
    ) {

      modifier =
        ` - ${Math.abs(result.modifier)}`

    }


    return (
      `🎲 [${result.expression}: ` +
      `${rolls}${modifier} = ` +
      `${result.total}]`
    )

  }

}