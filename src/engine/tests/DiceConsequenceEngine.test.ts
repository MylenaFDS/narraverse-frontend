import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  DiceResolver,
} from "../dice/DiceResolver"

import {
  DiceConsequenceEngine,
} from "../dice/DiceConsequenceEngine"


describe(
  "DiceConsequenceEngine",
  () => {

    afterEach(() => {
      vi.restoreAllMocks()
    })


    // ==========================================
    // SUCESSO
    // ==========================================

    it(
      "deve identificar uma ação bem-sucedida",
      () => {

        // d20 = 10
        vi
          .spyOn(Math, "random")
          .mockReturnValue(0.45)

        const result =
          DiceResolver.resolve(
            "1d20+5",
            10,
          )

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

      },
    )


    // ==========================================
    // SUCESSO PARCIAL
    // ==========================================

    it(
      "deve identificar um sucesso parcial",
      () => {

        const result =
          DiceResolver.resolve(
            "1d20+5",
            30,
          )

        const consequence =
          DiceConsequenceEngine.resolve(
            {
              ...result,
              outcome:
                "partial_success",
            },
          )

        expect(
          consequence.outcome,
        ).toBe("partial_success")

        expect(
          consequence.success,
        ).toBe(false)

        expect(
          consequence.severity,
        ).toBe(1)

      },
    )


    // ==========================================
    // FALHA
    // ==========================================

    it(
      "deve identificar uma falha",
      () => {

        const result =
          DiceResolver.resolve(
            "1d20+5",
            30,
          )

        const consequence =
          DiceConsequenceEngine.resolve(
            {
              ...result,
              outcome:
                "failure",
            },
          )

        expect(
          consequence.outcome,
        ).toBe("failure")

        expect(
          consequence.success,
        ).toBe(false)

        expect(
          consequence.severity,
        ).toBe(2)

      },
    )


    // ==========================================
    // FALHA CRÍTICA
    // ==========================================

    it(
      "deve identificar uma falha crítica",
      () => {

        const result =
          DiceResolver.resolve(
            "1d20",
            15,
          )

        const consequence =
          DiceConsequenceEngine.resolve(
            {
              ...result,
              outcome:
                "critical_failure",
            },
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
      "deve identificar um sucesso crítico",
      () => {

        const result =
          DiceResolver.resolve(
            "1d20",
            10,
          )

        const consequence =
          DiceConsequenceEngine.resolve(
            {
              ...result,
              outcome:
                "critical_success",
            },
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
    // DESCRIÇÕES
    // ==========================================

    it(
      "deve gerar uma descrição para cada consequência",
      () => {

        const outcomes = [
          "critical_failure",
          "failure",
          "partial_success",
          "success",
          "critical_success",
        ] as const

        for (
          const outcome of outcomes
        ) {

          const result =
            DiceResolver.resolve(
              "1d20",
              10,
            )

          const consequence =
            DiceConsequenceEngine.resolve(
              {
                ...result,
                outcome,
              },
            )

          expect(
            consequence.title,
          ).toBeTruthy()

          expect(
            consequence.description,
          ).toBeTruthy()

          expect(
            consequence.outcome,
          ).toBe(outcome)

        }

      },
    )

  },
)