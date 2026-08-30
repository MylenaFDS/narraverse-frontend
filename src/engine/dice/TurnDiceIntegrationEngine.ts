import {
  TurnDiceEngine,
  type TurnDiceResult,
  type TurnDiceRoll,
} from "./TurnDiceEngine"


// ============================================================
// TIPOS
// ============================================================

export interface TurnDiceIntegrationResult {

  originalText: string

  processedText: string

  hasRolls: boolean

  rolls: TurnDiceRoll[]

  description: string

}


// ============================================================
// ENGINE
// ============================================================

export class TurnDiceIntegrationEngine {


  // ==========================================================
  // PROCESSAR TURNO
  // ==========================================================

  static process(
    text: string,
  ): TurnDiceIntegrationResult {

    // ========================================================
    // RESOLVER ROLAGENS
    // ========================================================

    const result:
      TurnDiceResult =
      TurnDiceEngine.resolve(
        text,
      )


    // ========================================================
    // SEM ROLAGEM
    // ========================================================

    if (!result.hasRolls) {

      return {

        originalText:
          result.originalText,

        processedText:
          result.processedText,

        hasRolls:
          false,

        rolls: [],

        description:
          "O turno não contém nenhuma rolagem.",

      }

    }


    // ========================================================
    // DESCRIÇÃO
    // ========================================================

    const description =
      this.buildDescription(
        result,
      )


    // ========================================================
    // RESULTADO
    // ========================================================

    return {

      originalText:
        result.originalText,

      processedText:
        result.processedText,

      hasRolls:
        result.hasRolls,

      rolls:
        result.rolls,

      description,

    }

  }


  // ==========================================================
  // DESCRIÇÃO DAS ROLAGENS
  // ==========================================================

  private static buildDescription(
    result: TurnDiceResult,
  ): string {

    if (
      result.rolls.length === 0
    ) {

      return (
        "Nenhuma rolagem foi realizada."
      )

    }


    const descriptions =
      result.rolls.map(
        (roll) => {

          const values =
            roll.rolls.join(
              ", ",
            )

          let modifier = ""

          if (
            roll.modifier > 0
          ) {

            modifier =
              ` + ${roll.modifier}`

          } else if (
            roll.modifier < 0
          ) {

            modifier =
              ` - ${Math.abs(roll.modifier)}`

          }

          return (
            `🎲 ${roll.expression}: ` +
            `${values}${modifier} = ` +
            `${roll.total}`
          )

        },
      )


    return descriptions.join(
      " | ",
    )

  }

}