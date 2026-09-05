import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  ActionEngine,
  type ActionRequest,
} from "../ActionEngine"

import type {
  Character,
} from "../../types/character"

import type {
  WorldContext,
} from "../context/ContextEngine"


// ============================================================
// HELPERS
// ============================================================

function createCharacter(
  overrides: Partial<Character> = {},
): Character {

  return {
    id: 1,
    name: "Aragorn",
    ...overrides,
  } as Character

}


function createContext(): WorldContext {

  return {} as WorldContext

}


function createRequest(
  type: ActionRequest["type"],
  actor = createCharacter(),
  target?: Character,
): ActionRequest {

  return {
    type,
    actor,
    target,
  }

}

function createCharacterWithAttribute(
  attributeName: string,
  value = "10",
): Character {
  return {
    id: 1,
    name: "Aragorn",

    sheet_values: [
      {
        field: {
          id: 1,
          name: attributeName,
          field_type: "number",
        },
        value,
      },
    ],
  } as Character
}

// ============================================================
// TESTES
// ============================================================

describe(
  "ActionEngine",
  () => {

    // ========================================================
    // MOVIMENTO
    // ========================================================

    it(
      "deve executar movimento",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("move"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("move")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // CONVERSA
    // ========================================================

    it(
      "deve executar conversa",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("talk"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("talk")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // EXPLORAÇÃO
    // ========================================================

    it(
      "deve executar exploração",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("explore"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("explore")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // DEFESA
    // ========================================================

    it(
      "deve executar defesa",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("defend"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("defend")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // DESCANSO
    // ========================================================

    it(
      "deve executar descanso",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("rest"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("rest")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // ESPERA
    // ========================================================

    it(
      "deve executar espera",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("wait"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("wait")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // AVANÇO DO OBJETIVO
    // ========================================================

    it(
      "deve executar avanço do objetivo",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("advance_goal"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("advance_goal")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // INVESTIGAÇÃO
    // ========================================================

    it(
  "deve executar investigação com rolagem",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
  createCharacterWithAttribute(
    "Inteligência",
  )

    const result =
      ActionEngine.execute(
        createContext(),
        createRequest(
          "investigate",
          actor,
        ),
      )

    expect(
      result.action,
    ).toBe("investigate")

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice,
    ).toBeDefined()

    expect(
      result.dice?.expression,
    ).toBe("1d20")

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    expect(
      result.success,
    ).toBe(true)

    vi.restoreAllMocks()

  },
)


    // ========================================================
    // HABILIDADE
    // ========================================================

    it(
  "deve executar habilidade com rolagem",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
  createCharacterWithAttribute(
    "Destreza",
  )

    const result =
      ActionEngine.execute(
        createContext(),
        createRequest(
          "skill",
          actor,
        ),
      )

    expect(
      result.action,
    ).toBe("skill")

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice,
    ).toBeDefined()

    expect(
      result.dice?.expression,
    ).toBe("1d20")

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    expect(
      result.success,
    ).toBe(true)

    vi.restoreAllMocks()

  },
)


    // ========================================================
    // ATAQUE SEM ALVO
    // ========================================================

    it(
      "deve rejeitar ataque sem alvo",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("attack"),
          )

        expect(
          result.success,
        ).toBe(false)

        expect(
          result.action,
        ).toBe("attack")

        expect(
          result.requiresRoll,
        ).toBe(false)

        expect(
          result.description,
        ).toContain(
          "Nenhum alvo",
        )

      },
    )


    // ========================================================
    // ATAQUE COM ALVO
    // ========================================================

    it(
      "deve analisar ataque quando existe um alvo",
      () => {

        const actor =
          createCharacter({
            id: 1,
            name: "Aragorn",
          })

        const target =
          createCharacter({
            id: 2,
            name: "Orc",
          })

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest(
              "attack",
              actor,
              target,
            ),
          )

        expect(
          result.action,
        ).toBe("attack")

        expect(
          result.requiresRoll,
        ).toBe(true)

        expect(
          result.combat,
        ).toBeDefined()

        expect(
  result.description,
).toBe(
  "O ataque foi analisado e está pronto para resolução.",
)

      },
    )


    // ========================================================
    // MAGIA
    // ========================================================

    it(
  "deve executar magia",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
  createCharacterWithAttribute(
    "Inteligência",
  )

    const result =
      ActionEngine.execute(
        createContext(),
        createRequest(
          "spell",
          actor,
        ),
      )

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.action,
    ).toBe("spell")

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice,
    ).toBeDefined()

    expect(
      result.dice?.expression,
    ).toBe("1d20")

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    vi.restoreAllMocks()

  },
)


    // ========================================================
    // RETIRADA
    // ========================================================

    it(
      "deve executar retirada",
      () => {

        const result =
          ActionEngine.execute(
            createContext(),
            createRequest("retreat"),
          )

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.action,
        ).toBe("retreat")

        expect(
          result.requiresRoll,
        ).toBe(false)

      },
    )


    // ========================================================
    // FUGA
    // ========================================================

    it(
  "deve executar fuga",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
  createCharacterWithAttribute(
    "Destreza",
  )

    const result =
      ActionEngine.execute(
        createContext(),
        createRequest(
          "flee",
          actor,
        ),
      )

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.action,
    ).toBe("flee")

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice,
    ).toBeDefined()

    expect(
      result.dice?.expression,
    ).toBe("1d20")

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    vi.restoreAllMocks()

  },
)


    // ========================================================
    // ESCAPE
    // ========================================================

    it(
  "deve executar tentativa de escape",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
  createCharacterWithAttribute(
    "Destreza",
  )

    const result =
      ActionEngine.execute(
        createContext(),
        createRequest(
          "escape",
          actor,
        ),
      )

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.action,
    ).toBe("escape")

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice,
    ).toBeDefined()

    expect(
      result.dice?.expression,
    ).toBe("1d20")

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    vi.restoreAllMocks()

  },
)
    

    it("deve aplicar modificador positivo do atributo na rolagem", () => {

  vi.spyOn(Math, "random")
    .mockReturnValue(0.85)

  const actor = {
    id: 1,
    name: "Aragorn",

    sheet_values: [
      {
        field: {
          id: 1,
          name: "Força",
          field_type: "number",
        },
        value: "16",
      },
    ],
  } as Character

  const request: ActionRequest = {
    type: "skill",
    actor,
    attribute: "Força",
  }

  const result = ActionEngine.execute(
    createContext(),
    request,
  )

  expect(result.requiresRoll)
    .toBe(true)

  expect(result.dice)
    .toBeDefined()

  expect(result.dice?.expression)
    .toBe("1d20+3")

  expect(result.dice?.modifier)
    .toBe(3)

  expect(result.dice?.total)
    .toBe(21)

  expect(result.dice?.difficulty)
    .toBe(15)

  expect(result.dice?.outcome)
    .toBe("success")
})

it("deve aplicar modificador negativo do atributo na rolagem", () => {

  vi.spyOn(Math, "random")
    .mockReturnValue(0.85)

  const actor = {
    id: 1,
    name: "Aragorn",

    sheet_values: [
      {
        field: {
          id: 1,
          name: "Destreza",
          field_type: "number",
        },
        value: "6",
      },
    ],
  } as Character

  const request: ActionRequest = {
    type: "skill",
    actor,
    attribute: "Destreza",
  }

  const result = ActionEngine.execute(
    createContext(),
    request,
  )

  expect(result.requiresRoll)
    .toBe(true)

  expect(result.dice)
    .toBeDefined()

  expect(result.dice?.expression)
    .toBe("1d20-2")

  expect(result.dice?.modifier)
    .toBe(-2)

  expect(result.dice?.total)
    .toBe(16)

  expect(result.dice?.difficulty)
    .toBe(15)

  expect(result.dice?.outcome)
    .toBe("success")
})

// ========================================================
// CONSEQUÊNCIAS
// ========================================================

it(
  "deve produzir sucesso crítico em um 20 natural",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.999,
      )

    const actor =
      createCharacterWithAttribute(
        "Inteligência",
        "10",
      )

    const result =
      ActionEngine.execute(
        createContext(),
        {
          type: "investigate",
          actor,
        },
      )

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice?.total,
    ).toBe(20)

    expect(
      result.dice?.outcome,
    ).toBe("critical_success")

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.consequence,
    ).toBeDefined()

    vi.restoreAllMocks()

  },
)


it(
  "deve produzir falha crítica em um 1 natural",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0,
      )

    const actor =
      createCharacterWithAttribute(
        "Inteligência",
        "10",
      )

    const result =
      ActionEngine.execute(
        createContext(),
        {
          type: "investigate",
          actor,
        },
      )

    expect(
      result.requiresRoll,
    ).toBe(true)

    expect(
      result.dice?.total,
    ).toBe(1)

    expect(
      result.dice?.outcome,
    ).toBe("critical_failure")

    expect(
      result.success,
    ).toBe(false)

    expect(
      result.consequence,
    ).toBeDefined()

    vi.restoreAllMocks()

  },
)


it(
  "deve produzir falha quando o resultado fica abaixo da dificuldade",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.20,
      )

    const actor =
      createCharacterWithAttribute(
        "Inteligência",
        "10",
      )

    const result =
      ActionEngine.execute(
        createContext(),
        {
          type: "investigate",
          actor,
          difficulty: 15,
        },
      )

    expect(
      result.dice?.total,
    ).toBe(5)

    expect(
      result.dice?.difficulty,
    ).toBe(15)

    expect(
      result.dice?.outcome,
    ).toBe("failure")

    expect(
      result.success,
    ).toBe(false)

    expect(
      result.consequence,
    ).toBeDefined()

    vi.restoreAllMocks()

  },
)


it(
  "deve produzir sucesso quando o resultado supera a dificuldade",
  () => {

    vi
      .spyOn(
        Math,
        "random",
      )
      .mockReturnValue(
        0.85,
      )

    const actor =
      createCharacterWithAttribute(
        "Inteligência",
        "10",
      )

    const result =
      ActionEngine.execute(
        createContext(),
        {
          type: "investigate",
          actor,
          difficulty: 15,
        },
      )

    expect(
      result.dice?.total,
    ).toBe(18)

    expect(
      result.dice?.outcome,
    ).toBe("success")

    expect(
      result.success,
    ).toBe(true)

    expect(
      result.consequence,
    ).toBeDefined()

    vi.restoreAllMocks()

  },
)
  },
)