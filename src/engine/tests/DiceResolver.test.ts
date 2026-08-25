import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  DiceResolver,
} from "../dice/DiceResolver"

import {
  DiceEngine,
} from "../dice/DiceEngine"


describe("DiceResolver", () => {

  // ==========================================================
  // SUCESSO
  // ==========================================================

  it("deve retornar sucesso quando atingir a dificuldade", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [15],
      modifier: 0,
      total: 15,
    })

    const result =
      DiceResolver.resolve(
        "1d20",
        15,
      )

    expect(
      result.outcome,
    ).toBe("success")

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.margin,
    ).toBe(0)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // FALHA
  // ==========================================================

  it("deve retornar falha quando a margem for menor ou igual a -5", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [5],
      modifier: 0,
      total: 5,
    })

    const result =
      DiceResolver.resolve(
        "1d20",
        10,
      )

    expect(
      result.outcome,
    ).toBe("failure")

    expect(
      result.success,
    ).toBe(false)

    expect(
      result.margin,
    ).toBe(-5)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // SUCESSO PARCIAL
  // ==========================================================

  it("deve retornar sucesso parcial quando a margem for negativa menor que -5", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [8],
      modifier: 0,
      total: 8,
    })

    const result =
      DiceResolver.resolve(
        "1d20",
        10,
      )

    expect(
      result.outcome,
    ).toBe("partial_success")

    expect(
      result.success,
    ).toBe(false)

    expect(
      result.margin,
    ).toBe(-2)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // CRÍTICO NATURAL 1
  // ==========================================================

  it("deve retornar falha crítica com 1 natural", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [1],
      modifier: 10,
      total: 11,
    })

    const result =
      DiceResolver.resolve(
        "1d20+10",
        5,
      )

    expect(
      result.outcome,
    ).toBe("critical_failure")

    expect(
      result.success,
    ).toBe(false)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // CRÍTICO NATURAL 20
  // ==========================================================

  it("deve retornar sucesso crítico com 20 natural", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [20],
      modifier: 0,
      total: 20,
    })

    const result =
      DiceResolver.resolve(
        "1d20",
        30,
      )

    expect(
      result.outcome,
    ).toBe("critical_success")

    expect(
      result.success,
    ).toBe(true)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // CRÍTICO POR MARGEM
  // ==========================================================

  it("deve retornar sucesso crítico quando a margem for 10 ou maior", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20",
      rolls: [20],
      modifier: 0,
      total: 20,
    })

    const result =
      DiceResolver.resolve(
        "1d20",
        10,
      )

    expect(
      result.outcome,
    ).toBe("critical_success")

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.margin,
    ).toBe(10)

    vi.restoreAllMocks()

  })


  // ==========================================================
  // EXPRESSÃO INVÁLIDA
  // ==========================================================

  it("deve retornar falha para uma expressão inválida", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "abc",
      rolls: [],
      modifier: 0,
      total: 0,
    })

    const result =
      DiceResolver.resolve(
        "abc",
        10,
      )

    expect(
      result.outcome,
    ).toBe("failure")

    expect(
      result.success,
    ).toBe(false)

    expect(
      result.margin,
    ).toBe(0)

    expect(
      result.rolls,
    ).toEqual([])

    vi.restoreAllMocks()

  })


  // ==========================================================
  // MODIFICADOR
  // ==========================================================

  it("deve considerar o modificador no total da rolagem", () => {

    vi.spyOn(
      DiceEngine,
      "roll",
    ).mockReturnValue({
      expression: "1d20+5",
      rolls: [10],
      modifier: 5,
      total: 15,
    })

    const result =
      DiceResolver.resolve(
        "1d20+5",
        15,
      )

    expect(
      result.total,
    ).toBe(15)

    expect(
      result.modifier,
    ).toBe(5)

    expect(
      result.margin,
    ).toBe(0)

    expect(
      result.outcome,
    ).toBe("success")

    vi.restoreAllMocks()

  })

})