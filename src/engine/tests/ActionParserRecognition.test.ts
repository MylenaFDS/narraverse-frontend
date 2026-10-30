import {
  describe,
  expect,
  it,
} from "vitest"

import type {
  Character,
} from "../../types/character"

import {
  ActionParser,
} from "../action/ActionParser"


function createCharacter(): Character {
  return {
    id: 1,
    name: "Aragorn",
    user_id: 1,
    rpg_id: 1,
    is_npc: false,
    sheet_values: [],
    inventory: [],
  }
}


describe(
  "ActionParser - reconhecimento",
  () => {

    it(
      "deve reconhecer uma ação explícita",
      () => {
        const result =
          ActionParser.parseIfRecognized(
            "Aragorn investiga a sala.",
            createCharacter(),
          )

        expect(
          result?.type,
        ).toBe("investigate")
      },
    )


    it(
      "deve ignorar um texto puramente narrativo",
      () => {
        const result =
          ActionParser.parseIfRecognized(
            "Aragorn contempla o horizonte em silêncio.",
            createCharacter(),
          )

        expect(
          result,
        ).toBeNull()
      },
    )


    it(
      "deve reconhecer uma espera explícita",
      () => {
        const result =
          ActionParser.parseIfRecognized(
            "Aragorn espera antes de continuar.",
            createCharacter(),
          )

        expect(
          result?.type,
        ).toBe("wait")
      },
    )
    it(
  "reconhece uma tentativa de acertar o inimigo como ataque",
  () => {
    const actor = createCharacter()

    const orc: Character = {
      ...createCharacter(),
      id: 2,
      name: "Orc",
      is_npc: true,
    }

    const result = ActionParser.parseIfRecognized(
      "Aragorn desembainha a espada e avança contra o Orc, tentando acertá-lo no torso com um golpe forte. [[1d20+5]]",
      actor,
      { characters: [actor, orc] },
    )

    expect(result?.type).toBe("attack")
    expect(result?.target?.name).toBe("Orc")
    expect(result?.expression).toBe("1d20+5")
  },
)
  },
)