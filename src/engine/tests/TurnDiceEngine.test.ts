import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  TurnDiceEngine,
} from "../dice/TurnDiceEngine"


// ============================================================
// TESTES
// ============================================================

describe(
  "TurnDiceEngine",
  () => {


    // ========================================================
    // TURNO SEM DADOS
    // ========================================================

    it(
      "deve retornar o texto original quando não existem rolagens",
      () => {

        const result =
          TurnDiceEngine.resolve(
            "Aragorn caminha pela floresta.",
          )

        expect(
          result.originalText,
        ).toBe(
          "Aragorn caminha pela floresta.",
        )

        expect(
          result.processedText,
        ).toBe(
          "Aragorn caminha pela floresta.",
        )

        expect(
          result.rolls,
        ).toHaveLength(0)

        expect(
          result.hasRolls,
        ).toBe(false)

      },
    )


    // ========================================================
    // 1d20
    // ========================================================

    it(
      "deve detectar e resolver uma rolagem 1d20",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )

        const result =
          TurnDiceEngine.resolve(
            "Aragorn tenta atravessar a floresta silenciosamente. [[1d20]]",
          )

        expect(
          result.hasRolls,
        ).toBe(true)

        expect(
          result.rolls,
        ).toHaveLength(1)

        expect(
          result.rolls[0].expression,
        ).toBe("1d20")

        expect(
          result.rolls[0].rolls,
        ).toEqual([18])

        expect(
          result.rolls[0].modifier,
        ).toBe(0)

        expect(
          result.rolls[0].total,
        ).toBe(18)

        expect(
          result.processedText,
        ).toContain(
          "🎲 [1d20: 18 = 18]",
        )

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 1d20 + MODIFICADOR
    // ========================================================

    it(
      "deve resolver 1d20 com modificador positivo",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )

        const result =
          TurnDiceEngine.resolve(
            "Aragorn realiza um teste. [[1d20+5]]",
          )

        expect(
          result.rolls,
        ).toHaveLength(1)

        expect(
          result.rolls[0].expression,
        ).toBe("1d20+5")

        expect(
          result.rolls[0].rolls,
        ).toEqual([18])

        expect(
          result.rolls[0].modifier,
        ).toBe(5)

        expect(
          result.rolls[0].total,
        ).toBe(23)

        expect(
          result.processedText,
        ).toContain(
          "18 + 5 = 23",
        )

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 1d20 - MODIFICADOR
    // ========================================================

    it(
      "deve resolver 1d20 com modificador negativo",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )

        const result =
          TurnDiceEngine.resolve(
            "Aragorn tenta resistir. [[1d20-2]]",
          )

        expect(
          result.rolls,
        ).toHaveLength(1)

        expect(
          result.rolls[0].expression,
        ).toBe("1d20-2")

        expect(
          result.rolls[0].rolls,
        ).toEqual([18])

        expect(
          result.rolls[0].modifier,
        ).toBe(-2)

        expect(
          result.rolls[0].total,
        ).toBe(16)

        expect(
          result.processedText,
        ).toContain(
          "18 - 2 = 16",
        )

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // MÚLTIPLOS DADOS
    // ========================================================

    it(
      "deve resolver múltiplas rolagens no mesmo turno",
      () => {

        vi.spyOn(
  Math,
  "random",
)
  .mockReturnValueOnce(0.85)
  .mockReturnValueOnce(0.999)
  .mockReturnValueOnce(0.50)

        const result =
          TurnDiceEngine.resolve(
            "Aragorn ataca [[1d20+3]] e causa [[2d6+2]] de dano.",
          )

        expect(
          result.hasRolls,
        ).toBe(true)

        expect(
          result.rolls,
        ).toHaveLength(2)

        expect(
          result.rolls[0].expression,
        ).toBe("1d20+3")

        expect(
          result.rolls[0].total,
        ).toBe(21)

        expect(
          result.rolls[1].expression,
        ).toBe("2d6+2")

        expect(
          result.rolls[1].rolls,
        ).toEqual([6, 4])

        expect(
          result.rolls[1].total,
        ).toBe(12)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // EXTRAIR EXPRESSÕES
    // ========================================================

    it(
      "deve extrair todas as expressões de dados",
      () => {

        const expressions =
          TurnDiceEngine.extractExpressions(
            "Ataque [[1d20+5]] e dano [[2d6+3]].",
          )

        expect(
          expressions,
        ).toEqual([
          "1d20+5",
          "2d6+3",
        ])

      },
    )


    // ========================================================
    // HAS ROLL
    // ========================================================

    it(
      "deve identificar quando existe uma rolagem",
      () => {

        expect(
          TurnDiceEngine.hasRoll(
            "Eu ataco [[1d20+5]]",
          ),
        ).toBe(true)

        expect(
          TurnDiceEngine.hasRoll(
            "Eu caminho pela floresta.",
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // ROLL DIRETO
    // ========================================================

    it(
      "deve permitir uma rolagem direta",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )

        const result =
          TurnDiceEngine.roll(
            "1d20+5",
          )

        expect(
          result,
        ).not.toBeNull()

        expect(
          result!.expression,
        ).toBe("1d20+5")

        expect(
          result!.rolls,
        ).toEqual([18])

        expect(
          result!.modifier,
        ).toBe(5)

        expect(
          result!.total,
        ).toBe(23)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // RESOLVE ALL
    // ========================================================

    it(
      "deve resolver todas as rolagens encontradas",
      () => {

        vi.spyOn(
          Math,
          "random",
        )
          .mockReturnValueOnce(0.85)
          .mockReturnValueOnce(0.50)

        const results =
          TurnDiceEngine.resolveAll(
            "Ataque [[1d20+5]] e dano [[1d6]].",
          )

        expect(
          results,
        ).toHaveLength(2)

        expect(
          results[0].total,
        ).toBe(23)

        expect(
          results[1].total,
        ).toBe(4)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // CASE INSENSITIVE
    // ========================================================

    it(
  "deve aceitar expressões com D maiúsculo",
  () => {

    vi.spyOn(
      Math,
      "random",
    )
      .mockReturnValueOnce(0.50)
      .mockReturnValueOnce(0.50)

    const result =
      TurnDiceEngine.resolve(
        "Teste [[2D6+3]]",
      )

    expect(
      result.hasRolls,
    ).toBe(true)

    expect(
      result.rolls,
    ).toHaveLength(1)

    expect(
      result.rolls[0].rolls,
    ).toEqual([
      4,
      4,
    ])

    expect(
      result.rolls[0].modifier,
    ).toBe(3)

    expect(
      result.rolls[0].total,
    ).toBe(11)

    vi.restoreAllMocks()

  },
)


  },
)