import { describe, expect, it } from "vitest"

import {
  CombatStateEngine,
} from "../combat/CombatState"

import type { Character } from "../../types/character"


function createCharacter(
  id: number,
): Character {

  return {

    id,

    name: `Personagem ${id}`,

    user_id: 1,

    rpg_id: 1,

    is_npc: false,

    sheet_values: [],

    inventory: [],

  }

}


describe(
  "CombatStateEngine",
  () => {


    it(
      "deve criar um participante com HP",
      () => {

        const character =
          createCharacter(1)

        const participant =
          CombatStateEngine.createParticipant(
            character,
            20,
          )

        expect(
          participant.currentHP,
        ).toBe(20)

        expect(
          participant.maxHP,
        ).toBe(20)

        expect(
          participant.defeated,
        ).toBe(false)

      },
    )


    it(
      "deve aplicar dano corretamente",
      () => {

        const character =
          createCharacter(1)

        const participant =
          CombatStateEngine.createParticipant(
            character,
            20,
          )

        const result =
          CombatStateEngine.applyDamage(
            participant,
            7,
          )

        expect(
          result.currentHP,
        ).toBe(13)

        expect(
          result.defeated,
        ).toBe(false)

      },
    )


    it(
      "não deve permitir HP negativo",
      () => {

        const character =
          createCharacter(1)

        const participant =
          CombatStateEngine.createParticipant(
            character,
            20,
          )

        const result =
          CombatStateEngine.applyDamage(
            participant,
            50,
          )

        expect(
          result.currentHP,
        ).toBe(0)

        expect(
          result.defeated,
        ).toBe(true)

      },
    )


    it(
      "deve identificar o fim do combate",
      () => {

        const character1 =
          createCharacter(1)

        const character2 =
          createCharacter(2)

        const participant1 =
          CombatStateEngine.createParticipant(
            character1,
            20,
          )

        const participant2 =
          CombatStateEngine.createParticipant(
            character2,
            20,
          )

        const damaged =
          CombatStateEngine.applyDamage(
            participant2,
            20,
          )

        const state =
          CombatStateEngine.create([
            participant1,
            damaged,
          ])

        expect(
          CombatStateEngine.isFinished(
            state,
          ),
        ).toBe(true)

      },
    )


  },
)