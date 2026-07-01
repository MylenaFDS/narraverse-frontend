export interface DiceResult {
  expression: string

  rolls: number[]

  modifier: number

  total: number
}

export class DiceEngine {

  static roll(
    expression: string,
  ): DiceResult {

    const match =
      expression.match(
        /^(\d+)d(\d+)([+-]\d+)?$/i
      )

    if (!match) {

      return {
        expression,
        rolls: [],
        modifier: 0,
        total: 0,
      }

    }

    const quantity =
      Number(match[1])

    const sides =
      Number(match[2])

    const modifier =
      Number(match[3] ?? 0)

    const rolls: number[] = []

    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      rolls.push(
        Math.floor(
          Math.random() * sides
        ) + 1
      )

    }

    const total =
      rolls.reduce(
        (a, b) => a + b,
        0,
      ) + modifier

    return {
      expression,
      rolls,
      modifier,
      total,
    }

  }

}