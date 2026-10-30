import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import type {
  Character,
} from "../../types/character"

import type {
  WorldContext,
} from "../context/ContextEngine"

import {
  ActionExecutionEngine,
} from "../action/ActionExecutionEngine"


// ============================================================
// PERSONAGEM
// ============================================================

function createCharacter(): Character {

  return {

    id: 1,

    name: "Aragorn",

    user_id: 1,

    rpg_id: 1,

    is_npc: false,

    sheet_values: [

      {
        id: 1,

        value: "20",

        field: {

          id: 1,

          name: "HP",

          field_type: "number",

        },

      },

      {
        id: 2,

        value: "16",

        field: {

          id: 2,

          name: "Força",

          field_type: "number",

        },

      },

    ],

    inventory: [],

  }

}


// ============================================================
// CONTEXTO
// ============================================================

function createContext(): WorldContext {

  return {

    characters: [],

    npcs: [],

    lore: [],

    factions: [],

    profile:
      {} as WorldContext["profile"],

    inventory: [],

    recentTurns: [],

    timeline: [],

  }

}


// ============================================================
// LIMPEZA
// ============================================================

afterEach(
  () => {

    vi.restoreAllMocks()

  },
)


// ============================================================
// TESTES
// ============================================================

describe(
  "ActionExecutionEngine",
  () => {


    // ========================================================
    // 1. PARSER
    // ========================================================

    it(
      "deve transformar texto em ActionRequest",
      () => {

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn avança.",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.request.type,
        ).toBe(
          "move",
        )

        expect(
          result.request.actor,
        ).toBe(
          actor,
        )

      },
    )


    // ========================================================
    // 2. EXECUÇÃO SIMPLES
    // ========================================================

    it(
      "deve executar a ação interpretada",
      () => {

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn espera.",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.result.action,
        ).toBe(
          "wait",
        )

        expect(
          result.result.success,
        ).toBe(
          true,
        )

        expect(
          result.result.requiresRoll,
        ).toBe(
          false,
        )

      },
    )


    // ========================================================
    // 3. EXPRESSÃO DE DADOS
    // ========================================================

    it(
      "deve preservar a expressão de dados",
      () => {

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn investiga. [[1d20]]",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.request.type,
        ).toBe(
          "investigate",
        )

        expect(
          result.request.expression,
        ).toBe(
          "1d20",
        )

      },
    )


    // ========================================================
    // 4. APLICAR MODIFICADOR DO ATRIBUTO
    // ========================================================

    it(
      "deve aplicar o modificador do atributo na rolagem",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.5,
          )

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn investiga usando Força. [[1d20]]",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.request.attribute,
        ).toBe(
          "Força",
        )

        expect(
          result.result.dice,
        ).toBeDefined()

        expect(
          result.result.dice?.expression,
        ).toBe(
          "1d20+3",
        )

        expect(
          result.result.dice?.modifier,
        ).toBe(
          3,
        )

        expect(
          result.result.dice?.rolls[0],
        ).toBe(
          11,
        )

        expect(
          result.result.dice?.total,
        ).toBe(
          14,
        )

        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // 5. APLICAR DIFICULDADE
    // ========================================================

    it(
      "deve usar a dificuldade informada pelo jogador",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.5,
          )

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn investiga usando Força. [[1d20]] DC 12",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.request.difficulty,
        ).toBe(
          12,
        )

        expect(
          result.result.dice?.difficulty,
        ).toBe(
          12,
        )

        expect(
          result.result.dice?.expression,
        ).toBe(
          "1d20+3",
        )

        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // 6. FLUXO COMPLETO COM SUCESSO
    // ========================================================

    it(
      "deve executar rolagem e gerar consequência de sucesso",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.5,
          )

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn investiga usando Força. [[1d20]] DC 12",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.request.type,
        ).toBe(
          "investigate",
        )

        expect(
          result.result.requiresRoll,
        ).toBe(
          true,
        )

        expect(
          result.result.success,
        ).toBe(
          true,
        )

        expect(
          result.result.dice,
        ).toBeDefined()

        expect(
          result.result.dice?.total,
        ).toBe(
          14,
        )

        expect(
          result.result.consequence,
        ).toBeDefined()

        expect(
          result.result.description,
        ).toContain(
          "investigação",
        )

        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // 7. FLUXO COMPLETO COM FALHA
    // ========================================================

    it(
      "deve executar rolagem e gerar consequência de falha",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0,
          )

        const actor =
          createCharacter()

        const result =
          ActionExecutionEngine.execute(
            "Aragorn investiga usando Força. [[1d20]] DC 15",
            actor,
            {
              context:
                createContext(),
            },
          )

        expect(
          result.result.requiresRoll,
        ).toBe(
          true,
        )

        expect(
          result.result.success,
        ).toBe(
          false,
        )

        expect(
          result.result.dice,
        ).toBeDefined()

        expect(
          result.result.dice?.rolls[0],
        ).toBe(
          1,
        )

        expect(
          result.result.dice?.total,
        ).toBe(
          4,
        )

        expect(
          result.result.dice?.difficulty,
        ).toBe(
          15,
        )

        expect(
          result.result.consequence,
        ).toBeDefined()

        expect([
          "failure",
          "critical_failure",
        ]).toContain(
          result.result.dice?.outcome,
        )

        randomSpy.mockRestore()

      },
    )


  },
)