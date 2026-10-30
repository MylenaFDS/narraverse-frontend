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

import {
  TurnActionIntegrationEngine,
} from "../action/TurnActionIntegrationEngine"


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


afterEach(() => {
  vi.restoreAllMocks()
})


describe(
  "TurnActionIntegrationEngine",
  () => {

    it(
      "deve ignorar texto puramente narrativo",
      () => {
        const actor =
          createCharacter()

        const result =
          TurnActionIntegrationEngine.process({
            text:
              "Aragorn contempla o horizonte em silêncio.",

            actor,

            characters: [actor],

            lore: [],
          })

        expect(result).toBeNull()
      },
    )


    it(
      "deve reconhecer e executar uma ação explícita",
      () => {
        const actor =
          createCharacter()

        const result =
          TurnActionIntegrationEngine.process({
            text:
              "Aragorn espera.",

            actor,

            characters: [actor],

            lore: [],
          })

        expect(
          result?.request.type,
        ).toBe("wait")

        expect(
          result?.result.action,
        ).toBe("wait")

        expect(
          result?.result.success,
        ).toBe(true)

        expect(
          result?.result.requiresRoll,
        ).toBe(false)
      },
    )


    it(
      "deve construir o contexto e resolver uma rolagem",
      () => {
        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(0.5)

        const actor =
          createCharacter()

        const result =
          TurnActionIntegrationEngine.process({
            text:
              "Aragorn investiga usando Força. [[1d20]] DC 12",

            actor,

            characters: [actor],

            lore: [],
          })

        expect(
          result?.request.type,
        ).toBe("investigate")

        expect(
          result?.result.dice?.expression,
        ).toBe("1d20+3")

        expect(
          result?.result.dice?.total,
        ).toBe(14)

        expect(
          result?.result.dice?.difficulty,
        ).toBe(12)

        expect(
          result?.result.success,
        ).toBe(true)
      },
    )

    it(
  "inicia e resolve um ataque sem estado de combate prévio",
  () => {
    const actor = createCharacter()

    const target = {
      ...createCharacter(),
      id: 2,
      name: "Orc",
      is_npc: true,
    }

    const result =
      TurnActionIntegrationEngine.process({
        text: "Aragorn ataca Orc.",
        actor,
        characters: [actor, target],
        lore: [],
      })

    expect(result).not.toBeNull()

    expect(
      result?.request.combatState?.participants,
    ).toHaveLength(2)

    expect(
      result?.result.combatResult,
    ).toBeDefined()

    expect(
      result?.result.combatState,
    ).toBeDefined()
  },
)

  },
)