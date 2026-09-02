import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  DiceEngine,
} from "../dice/DiceEngine"

import {
  DiceResolver,
} from "../dice/DiceResolver"

import {
  DiceConsequenceEngine,
} from "../dice/DiceConsequenceEngine"


describe(
  "Dice Turn Integration",
  () => {

    // ==========================================
    // SUCESSO
    // ==========================================

    it(
      "deve transformar uma ação de turno em um sucesso",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.85,
          )

        const roll =
          DiceEngine.roll(
            "1d20+5",
          )

        expect(
          roll.rolls[0],
        ).toBe(18)

        expect(
          roll.total,
        ).toBe(23)


        const result =
          DiceResolver.resolve(
            "1d20+5",
            15,
          )

        expect(
          result.outcome,
        ).toBe("success")

        expect(
          result.success,
        ).toBe(true)


        const consequence =
          DiceConsequenceEngine.resolve(
            result,
          )

        expect(
          consequence.outcome,
        ).toBe("success")

        expect(
          consequence.success,
        ).toBe(true)

        expect(
          consequence.title,
        ).toBe("Sucesso")

      },
    )


    // ==========================================
    // FALHA
    // ==========================================

    it(
      "deve transformar uma ação de turno em uma falha",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.10,
          )

        const result =
          DiceResolver.resolve(
            "1d20+5",
            15,
          )

        expect(
          result.rolls[0],
        ).toBe(3)

        expect(
          result.total,
        ).toBe(8)

        expect(
          result.outcome,
        ).toBe("failure")

        expect(
          result.success,
        ).toBe(false)


        const consequence =
          DiceConsequenceEngine.resolve(
            result,
          )

        expect(
          consequence.outcome,
        ).toBe("failure")

        expect(
          consequence.success,
        ).toBe(false)

        expect(
          consequence.title,
        ).toBe("Falha")

      },
    )


    // ==========================================
    // SUCESSO PARCIAL
    // ==========================================

    it(
      "deve transformar uma ação em sucesso parcial",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.45,
          )

        const result =
          DiceResolver.resolve(
            "1d20+5",
            15,
          )

        expect(
          result.rolls[0],
        ).toBe(10)

        expect(
          result.total,
        ).toBe(15)

        expect(
          result.outcome,
        ).toBe("success")


        const partialResult =
          DiceResolver.resolve(
            "1d20+5",
            16,
          )

        expect(
          partialResult.rolls[0],
        ).toBe(10)

        expect(
          partialResult.total,
        ).toBe(15)

        expect(
          partialResult.outcome,
        ).toBe("partial_success")


        const consequence =
          DiceConsequenceEngine.resolve(
            partialResult,
          )

        expect(
          consequence.outcome,
        ).toBe("partial_success")

        expect(
          consequence.success,
        ).toBe(false)

        expect(
          consequence.title,
        ).toBe("Sucesso parcial")

      },
    )


    // ==========================================
    // FALHA CRÍTICA
    // ==========================================

    it(
      "deve transformar um 1 natural em falha crítica",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0,
          )

        const result =
          DiceResolver.resolve(
            "1d20",
            15,
          )

        expect(
          result.rolls[0],
        ).toBe(1)

        expect(
          result.outcome,
        ).toBe("critical_failure")

        expect(
          result.success,
        ).toBe(false)


        const consequence =
          DiceConsequenceEngine.resolve(
            result,
          )

        expect(
          consequence.outcome,
        ).toBe("critical_failure")

        expect(
          consequence.success,
        ).toBe(false)

        expect(
          consequence.severity,
        ).toBe(3)

      },
    )


    // ==========================================
    // SUCESSO CRÍTICO
    // ==========================================

    it(
      "deve transformar um 20 natural em sucesso crítico",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.999,
          )

        const result =
          DiceResolver.resolve(
            "1d20+5",
            15,
          )

        expect(
          result.rolls[0],
        ).toBe(20)

        expect(
          result.total,
        ).toBe(25)

        expect(
          result.outcome,
        ).toBe("critical_success")

        expect(
          result.success,
        ).toBe(true)


        const consequence =
          DiceConsequenceEngine.resolve(
            result,
          )

        expect(
          consequence.outcome,
        ).toBe("critical_success")

        expect(
          consequence.success,
        ).toBe(true)

        expect(
          consequence.severity,
        ).toBe(0)

      },
    )


    // ==========================================
    // FLUXO COMPLETO
    // ==========================================

    it(
      "deve executar o fluxo completo: rolagem → resultado → consequência",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.85,
          )

        // --------------------------------------
        // 1. Rolagem
        // --------------------------------------

        const roll =
          DiceEngine.roll(
            "1d20+5",
          )

        expect(
          roll.expression,
        ).toBe("1d20+5")

        expect(
          roll.rolls,
        ).toEqual([18])

        expect(
          roll.modifier,
        ).toBe(5)

        expect(
          roll.total,
        ).toBe(23)


        // --------------------------------------
        // 2. Resolução
        // --------------------------------------

        const result =
          DiceResolver.resolve(
            "1d20+5",
            15,
          )

        expect(
          result.difficulty,
        ).toBe(15)

        expect(
          result.margin,
        ).toBe(8)

        expect(
          result.outcome,
        ).toBe("success")


        // --------------------------------------
        // 3. Consequência
        // --------------------------------------

        const consequence =
          DiceConsequenceEngine.resolve(
            result,
          )

        expect(
          consequence.outcome,
        ).toBe("success")

        expect(
          consequence.success,
        ).toBe(true)

        expect(
          consequence.severity,
        ).toBe(0)

        expect(
          consequence.title,
        ).toBe("Sucesso")

        expect(
          consequence.description,
        ).toBeTruthy()

      },
    )


    // ==========================================
    // LIMPEZA DOS MOCKS
    // ==========================================

    afterEach(
      () => {
        vi.restoreAllMocks()
      },
    )

  },
)