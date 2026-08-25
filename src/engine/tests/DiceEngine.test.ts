import {
  describe,
  expect,
  it,
} from "vitest"

import {
  DiceEngine,
} from "../dice/DiceEngine"


describe("DiceEngine", () => {

  it("deve rolar 1d20", () => {

    const result =
      DiceEngine.roll("1d20")

    expect(
      result.rolls.length,
    ).toBe(1)

    expect(
      result.rolls[0],
    ).toBeGreaterThanOrEqual(1)

    expect(
      result.rolls[0],
    ).toBeLessThanOrEqual(20)

    expect(
      result.modifier,
    ).toBe(0)

    expect(
      result.total,
    ).toBe(result.rolls[0])

  })


  it("deve aplicar modificador positivo", () => {

    const result =
      DiceEngine.roll("1d20+5")

    expect(
      result.rolls.length,
    ).toBe(1)

    expect(
      result.modifier,
    ).toBe(5)

    expect(
      result.total,
    ).toBe(
      result.rolls[0] + 5,
    )

  })


  it("deve aplicar modificador negativo", () => {

    const result =
      DiceEngine.roll("1d20-3")

    expect(
      result.rolls.length,
    ).toBe(1)

    expect(
      result.modifier,
    ).toBe(-3)

    expect(
      result.total,
    ).toBe(
      result.rolls[0] - 3,
    )

  })


  it("deve rolar vários dados", () => {

    const result =
      DiceEngine.roll("2d6")

    expect(
      result.rolls.length,
    ).toBe(2)

    result.rolls.forEach(
      (value) => {

        expect(
          value,
        ).toBeGreaterThanOrEqual(1)

        expect(
          value,
        ).toBeLessThanOrEqual(6)

      },
    )

    const expectedTotal =
      result.rolls.reduce(
        (sum, value) =>
          sum + value,
        0,
      )

    expect(
      result.total,
    ).toBe(expectedTotal)

  })


  it("deve rolar vários dados com modificador", () => {

    const result =
      DiceEngine.roll("3d6+4")

    expect(
      result.rolls.length,
    ).toBe(3)

    expect(
      result.modifier,
    ).toBe(4)

    const expectedTotal =
      result.rolls.reduce(
        (sum, value) =>
          sum + value,
        0,
      ) + 4

    expect(
      result.total,
    ).toBe(expectedTotal)

  })


  it("deve rejeitar expressão inválida", () => {

    const result =
      DiceEngine.roll(
        "abc",
      )

    expect(
      result.rolls,
    ).toEqual([])

    expect(
      result.total,
    ).toBe(0)

  })


  it("deve rejeitar quantidade inválida", () => {

    const result =
      DiceEngine.roll(
        "0d20",
      )

    expect(
      result.rolls,
    ).toEqual([])

    expect(
      result.total,
    ).toBe(0)

  })


  it("deve limitar quantidade de dados", () => {

    const result =
      DiceEngine.roll(
        "101d20",
      )

    expect(
      result.rolls,
    ).toEqual([])

    expect(
      result.total,
    ).toBe(0)

  })


  it("deve limitar quantidade de lados", () => {

    const result =
      DiceEngine.roll(
        "1d1001",
      )

    expect(
      result.rolls,
    ).toEqual([])

    expect(
      result.total,
    ).toBe(0)

  })

})