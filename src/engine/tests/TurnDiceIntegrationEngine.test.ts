import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  TurnDiceIntegrationEngine,
} from "../dice/TurnDiceIntegrationEngine"

import {
  DiceEngine,
} from "../dice/DiceEngine"

// ============================================================
// TESTES
// ============================================================

describe(
  "TurnDiceIntegrationEngine",
  () => {


    // ========================================================
    // SEM ROLAGEM
    // ========================================================

    it(
      "deve processar um turno sem rolagens",
      () => {

        const result =
          TurnDiceIntegrationEngine.process(
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
          result.hasRolls,
        ).toBe(false)


        expect(
          result.rolls,
        ).toHaveLength(0)


        expect(
          result.description,
        ).toBe(
          "O turno não contém nenhuma rolagem.",
        )

      },
    )


    // ========================================================
    // UMA ROLAGEM
    // ========================================================

    it(
      "deve integrar uma rolagem simples",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )


        const result =
          TurnDiceIntegrationEngine.process(
            "Aragorn tenta atravessar a floresta. [[1d20]]",
          )


        expect(
          result.hasRolls,
        ).toBe(true)


        expect(
          result.rolls,
        ).toHaveLength(1)


        expect(
          result.rolls[0].expression,
        ).toBe(
          "1d20",
        )


        expect(
          result.rolls[0].rolls,
        ).toEqual([
          18,
        ])


        expect(
          result.rolls[0].total,
        ).toBe(
          18,
        )


        expect(
          result.processedText,
        ).toContain(
          "🎲 [1d20: 18 = 18]",
        )


        expect(
          result.description,
        ).toBe(
          "🎲 1d20: 18 = 18",
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // MODIFICADOR POSITIVO
    // ========================================================

    it(
      "deve integrar uma rolagem com modificador positivo",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )


        const result =
          TurnDiceIntegrationEngine.process(
            "Aragorn realiza um ataque. [[1d20+5]]",
          )


        expect(
          result.rolls,
        ).toHaveLength(1)


        expect(
          result.rolls[0].rolls,
        ).toEqual([
          18,
        ])


        expect(
          result.rolls[0].modifier,
        ).toBe(
          5,
        )


        expect(
          result.rolls[0].total,
        ).toBe(
          23,
        )


        expect(
          result.description,
        ).toBe(
          "🎲 1d20+5: 18 + 5 = 23",
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // MODIFICADOR NEGATIVO
    // ========================================================

    it(
      "deve integrar uma rolagem com modificador negativo",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )


        const result =
          TurnDiceIntegrationEngine.process(
            "Aragorn tenta resistir. [[1d20-2]]",
          )


        expect(
          result.rolls[0].modifier,
        ).toBe(
          -2,
        )


        expect(
          result.rolls[0].total,
        ).toBe(
          16,
        )


        expect(
          result.description,
        ).toBe(
          "🎲 1d20-2: 18 - 2 = 16",
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // MÚLTIPLAS ROLAGENS
    // ========================================================

    it(
      "deve integrar múltiplas rolagens no mesmo turno",
      () => {

        vi.spyOn(
          Math,
          "random",
        )
          .mockReturnValueOnce(0.85)
          .mockReturnValueOnce(0.50)
          .mockReturnValueOnce(0.25)


        const result =
          TurnDiceIntegrationEngine.process(
            "Aragorn ataca [[1d20+3]] e causa [[2d6+2]] de dano.",
          )


        expect(
          result.hasRolls,
        ).toBe(true)


        expect(
          result.rolls,
        ).toHaveLength(2)


        expect(
          result.rolls[0].total,
        ).toBe(
          21,
        )


        expect(
          result.rolls[1].rolls,
        ).toEqual([
          4,
          2,
        ])


        expect(
          result.rolls[1].total,
        ).toBe(
          8,
        )


        expect(
          result.description,
        ).toBe(
          "🎲 1d20+3: 18 + 3 = 21 | 🎲 2d6+2: 4, 2 + 2 = 8",
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // TEXTO ORIGINAL
    // ========================================================

    it(
      "deve preservar o texto original do turno",
      () => {

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.85,
        )


        const text =
          "Aragorn tenta atravessar a floresta. [[1d20+5]]"


        const result =
          TurnDiceIntegrationEngine.process(
            text,
          )


        expect(
          result.originalText,
        ).toBe(
          text,
        )


        expect(
          result.processedText,
        ).not.toBe(
          text,
        )


        vi.restoreAllMocks()

      },
    )
    
      // ========================================================
  // TESTE CONTRA DIFICULDADE
  // ========================================================

  it(
    "deve resolver uma rolagem contra uma dificuldade",
    () => {

      vi.spyOn(
        DiceEngine,
        "roll",
      ).mockReturnValue({
        expression: "1d20+5",
        rolls: [18],
        modifier: 5,
        total: 23,
      })


      const result =
        TurnDiceIntegrationEngine.resolveCheck(
          "1d20+5",
          15,
        )


      expect(
        result.expression,
      ).toBe(
        "1d20+5",
      )


      expect(
        result.total,
      ).toBe(
        23,
      )


      expect(
        result.difficulty,
      ).toBe(
        15,
      )


      expect(
        result.margin,
      ).toBe(
        8,
      )


      expect(
        result.success,
      ).toBe(
        true,
      )


      expect(
        result.outcome,
      ).toBe(
        "success",
      )


      vi.restoreAllMocks()

    },
  )

  },
)