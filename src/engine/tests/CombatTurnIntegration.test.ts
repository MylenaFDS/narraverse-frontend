import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import type { Character } from "../../types/character"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"

import {
  CombatTurnEngine,
} from "../combat/CombatTurnEngine"


// ============================================================
// PERSONAGEM DE TESTE
// ============================================================

function createCharacter(
  id: number,
  name: string,
  dexterity = 10,
): Character {

  return {

    id,

    name,

    description: "",

    history: null,

    world_lore_id: null,

    faction_id: null,

    faction: null,

    image_url: null,

    inventory: [],

    user_id: id,

    rpg_id: 1,

    is_npc: id !== 1,

    sheet_values: [

      {

        id: id * 10 + 1,

        value: String(dexterity),

        field: {

          id: id * 10 + 1,

          name: "Destreza",

          field_type: "number",

        },

      },

    ],

  }

}


// ============================================================
// ESTADO DE COMBATE
// ============================================================

function createCombatState(
  characters: Character[],
): CombatState {

  const participants =
    characters.map(
      character =>
        CombatStateEngine.createParticipant(
          character,
          20,
        ),
    )

  return CombatStateEngine.create(
    participants,
  )

}


// ============================================================
// TESTES
// ============================================================

describe(
  "CombatTurnEngine - integração",
  () => {


    // ========================================================
    // INICIATIVA
    // ========================================================

    it(
      "deve calcular iniciativa usando Destreza",
      () => {

        const fast =
          createCharacter(
            1,
            "Rápido",
            18,
          )

        const slow =
          createCharacter(
            2,
            "Lento",
            10,
          )


        /*
         * Math.random() = 0
         *
         * Resultado do d20:
         *
         * 1
         *
         * Rápido:
         *
         * Destreza 18
         * modificador +4
         * iniciativa = 5
         *
         * Lento:
         *
         * Destreza 10
         * modificador +0
         * iniciativa = 1
         */

        const randomSpy =
          vi
            .spyOn(
              Math,
              "random",
            )
            .mockReturnValue(
              0,
            )


        const state =
          createCombatState(
            [
              fast,
              slow,
            ],
          )


        const initiatives =
          CombatTurnEngine.rollInitiative(
            state,
          )


        expect(
          initiatives,
        ).toEqual(
          [
            {
              characterId: 1,
              roll: 5,
            },
            {
              characterId: 2,
              roll: 1,
            },
          ],
        )


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // IGNORAR DERROTADOS
    // ========================================================

    it(
      "não deve rolar iniciativa para personagens derrotados",
      () => {

        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            14,
          )

        const defeated =
          createCharacter(
            2,
            "Derrotado",
            20,
          )


        const state =
          createCombatState(
            [
              attacker,
              defeated,
            ],
          )


        const defeatedParticipant =
          CombatStateEngine.applyDamage(
            state.participants[1],
            100,
          )


        const defeatedState: CombatState = {

          ...state,

          participants: [

            state.participants[0],

            defeatedParticipant,

          ],

        }


        const randomSpy =
          vi
            .spyOn(
              Math,
              "random",
            )
            .mockReturnValue(
              0,
            )


        const initiatives =
          CombatTurnEngine.rollInitiative(
            defeatedState,
          )


        expect(
          initiatives,
        ).toHaveLength(1)


        expect(
          initiatives[0].characterId,
        ).toBe(1)


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // INICIAR COMBATE
    // ========================================================

    it(
      "deve iniciar o combate e definir o primeiro participante",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
            18,
          )

        const second =
          createCharacter(
            2,
            "Segundo",
            10,
          )


        /*
         * Ambos tiram 1 no d20.
         *
         * Primeiro:
         * 1 + 4 = 5
         *
         * Segundo:
         * 1 + 0 = 1
         */

        const randomSpy =
          vi
            .spyOn(
              Math,
              "random",
            )
            .mockReturnValue(
              0,
            )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const started =
          CombatTurnEngine.start(
            state,
          )


        expect(
          started.initiativeOrder,
        ).toEqual(
          [
            1,
            2,
          ],
        )


        expect(
          started.activeParticipantId,
        ).toBe(1)


        expect(
          started.round,
        ).toBe(1)


        expect(
          started.finished,
        ).toBe(false)


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // PRÓXIMO TURNO
    // ========================================================

    it(
      "deve passar para o próximo participante",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
            18,
          )

        const second =
          createCharacter(
            2,
            "Segundo",
            10,
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const started: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            1,

          round: 1,

          finished: false,

        }


        const next =
          CombatTurnEngine.nextTurn(
            started,
          )


        expect(
          next.activeParticipantId,
        ).toBe(2)


        expect(
          next.round,
        ).toBe(1)


        expect(
          next.finished,
        ).toBe(false)

      },
    )


    // ========================================================
    // NOVA RODADA
    // ========================================================

    it(
      "deve iniciar uma nova rodada ao voltar para o primeiro participante",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
            18,
          )

        const second =
          createCharacter(
            2,
            "Segundo",
            10,
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const current: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            2,

          round: 1,

          finished: false,

        }


        const next =
          CombatTurnEngine.nextTurn(
            current,
          )


        expect(
          next.activeParticipantId,
        ).toBe(1)


        expect(
          next.round,
        ).toBe(2)


        expect(
          next.finished,
        ).toBe(false)

      },
    )


    // ========================================================
    // PARTICIPANTE DERROTADO
    // ========================================================

    it(
      "deve ignorar participante derrotado ao avançar o turno",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
            18,
          )

        const defeated =
          createCharacter(
            2,
            "Derrotado",
            14,
          )

        const third =
          createCharacter(
            3,
            "Terceiro",
            10,
          )


        const state =
          createCombatState(
            [
              first,
              defeated,
              third,
            ],
          )


        const defeatedParticipant =
          CombatStateEngine.applyDamage(
            state.participants[1],
            100,
          )


        const current: CombatState = {

          ...state,

          participants: [

            state.participants[0],

            defeatedParticipant,

            state.participants[2],

          ],

          initiativeOrder: [
            1,
            2,
            3,
          ],

          activeParticipantId:
            1,

          round: 1,

          finished: false,

        }


        const next =
          CombatTurnEngine.nextTurn(
            current,
          )


        expect(
          next.initiativeOrder,
        ).toEqual(
          [
            1,
            3,
          ],
        )


        expect(
          next.activeParticipantId,
        ).toBe(3)


        expect(
          next.finished,
        ).toBe(false)

      },
    )


    // ========================================================
    // CAN ACT
    // ========================================================

    it(
      "deve permitir ação somente ao participante ativo",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const activeState: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            1,

          round: 1,

          finished: false,

        }


        expect(
          CombatTurnEngine.canAct(
            activeState,
            1,
          ),
        ).toBe(true)


        expect(
          CombatTurnEngine.canAct(
            activeState,
            2,
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // DERROTADO NÃO PODE AGIR
    // ========================================================

    it(
      "não deve permitir que um participante derrotado aja",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const defeatedParticipant =
          CombatStateEngine.applyDamage(
            state.participants[0],
            100,
          )


        const defeatedState: CombatState = {

          ...state,

          participants: [

            defeatedParticipant,

            state.participants[1],

          ],

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            1,

          round: 1,

          finished: false,

        }


        expect(
          CombatTurnEngine.canAct(
            defeatedState,
            1,
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // COMBATE ENCERRADO
    // ========================================================

    it(
      "não deve permitir ação quando o combate terminou",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const finishedState: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            1,

          round: 1,

          finished: true,

        }


        expect(
          CombatTurnEngine.canAct(
            finishedState,
            1,
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // PARTICIPANTE ATIVO
    // ========================================================

    it(
      "deve retornar o participante ativo",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const activeState: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            2,

          round: 1,

          finished: false,

        }


        const active =
          CombatTurnEngine.getActiveParticipant(
            activeState,
          )


        expect(
          active,
        ).not.toBeNull()


        expect(
          active?.character.id,
        ).toBe(2)


        expect(
          active?.character.name,
        ).toBe("Segundo")

      },
    )


    // ========================================================
    // SEM PARTICIPANTE ATIVO
    // ========================================================

    it(
      "deve retornar null quando não existe participante ativo",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const inactiveState: CombatState = {

          ...state,

          activeParticipantId:
            null,

        }


        expect(
          CombatTurnEngine.getActiveParticipant(
            inactiveState,
          ),
        ).toBeNull()

      },
    )


    // ========================================================
    // ORDEM DE INICIATIVA
    // ========================================================

    it(
      "deve retornar os participantes na ordem da iniciativa",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )

        const third =
          createCharacter(
            3,
            "Terceiro",
          )


        const state =
          createCombatState(
            [
              first,
              second,
              third,
            ],
          )


        const orderedState: CombatState = {

          ...state,

          initiativeOrder: [
            3,
            1,
            2,
          ],

        }


        const order =
          CombatTurnEngine.getInitiativeOrder(
            orderedState,
          )


        expect(
          order.map(
            participant =>
              participant.character.id,
          ),
        ).toEqual(
          [
            3,
            1,
            2,
          ],
        )

      },
    )


    // ========================================================
    // ORDEM IGNORA DERROTADOS
    // ========================================================

    it(
      "não deve retornar participantes derrotados na ordem da iniciativa",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const defeated =
          createCharacter(
            2,
            "Derrotado",
          )

        const third =
          createCharacter(
            3,
            "Terceiro",
          )


        const state =
          createCombatState(
            [
              first,
              defeated,
              third,
            ],
          )


        const defeatedParticipant =
          CombatStateEngine.applyDamage(
            state.participants[1],
            100,
          )


        const filteredState: CombatState = {

          ...state,

          participants: [

            state.participants[0],

            defeatedParticipant,

            state.participants[2],

          ],

          initiativeOrder: [
            1,
            2,
            3,
          ],

        }


        const order =
          CombatTurnEngine.getInitiativeOrder(
            filteredState,
          )


        expect(
          order.map(
            participant =>
              participant.character.id,
          ),
        ).toEqual(
          [
            1,
            3,
          ],
        )

      },
    )


    // ========================================================
    // ÚNICO SOBREVIVENTE
    // ========================================================

    it(
      "deve encerrar o combate quando existe apenas um sobrevivente",
      () => {

        const survivor =
          createCharacter(
            1,
            "Sobrevivente",
          )

        const defeated =
          createCharacter(
            2,
            "Derrotado",
          )


        const state =
          createCombatState(
            [
              survivor,
              defeated,
            ],
          )


        const defeatedParticipant =
          CombatStateEngine.applyDamage(
            state.participants[1],
            100,
          )


        const stateWithDefeat: CombatState = {

          ...state,

          participants: [

            state.participants[0],

            defeatedParticipant,

          ],

        }


        const started =
          CombatTurnEngine.start(
            stateWithDefeat,
          )


        expect(
          started.initiativeOrder,
        ).toEqual(
          [
            1,
          ],
        )


        expect(
          started.activeParticipantId,
        ).toBe(1)


        expect(
          started.finished,
        ).toBe(true)

      },
    )


    // ========================================================
    // NINGUÉM SOBREVIVEU
    // ========================================================

    it(
      "deve encerrar o combate quando não existem sobreviventes",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const defeatedFirst =
          CombatStateEngine.applyDamage(
            state.participants[0],
            100,
          )

        const defeatedSecond =
          CombatStateEngine.applyDamage(
            state.participants[1],
            100,
          )


        const deadState: CombatState = {

          ...state,

          participants: [

            defeatedFirst,

            defeatedSecond,

          ],

        }


        const started =
          CombatTurnEngine.start(
            deadState,
          )


        expect(
          started.initiativeOrder,
        ).toEqual(
          [],
        )


        expect(
          started.activeParticipantId,
        ).toBeNull()


        expect(
          started.finished,
        ).toBe(true)

      },
    )


    // ========================================================
    // NEXT TURN COM COMBATE FINALIZADO
    // ========================================================

    it(
      "deve manter o combate encerrado ao tentar avançar o turno",
      () => {

        const first =
          createCharacter(
            1,
            "Primeiro",
          )

        const second =
          createCharacter(
            2,
            "Segundo",
          )


        const state =
          createCombatState(
            [
              first,
              second,
            ],
          )


        const finishedState: CombatState = {

          ...state,

          initiativeOrder: [
            1,
            2,
          ],

          activeParticipantId:
            1,

          round: 3,

          finished: true,

        }


        const next =
          CombatTurnEngine.nextTurn(
            finishedState,
          )


        expect(
          next.activeParticipantId,
        ).toBeNull()


        expect(
          next.finished,
        ).toBe(true)


        expect(
          next.round,
        ).toBe(3)

      },
    )


  },
)