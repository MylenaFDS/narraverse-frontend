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
// PERSONAGEM
// ============================================================

function createCharacter(
  id: number,
  name: string,
  dexterity = 10,
): Character {

  return {

    id,

    name,

    user_id: id,

    rpg_id: 1,

    is_npc: id !== 1,

    sheet_values: [

      {

        id: id * 10,

        value: String(dexterity),

        field: {

          id: id * 10,

          name: "Destreza",

          field_type: "number",

        },

      },

    ],

    inventory: [],

  }

}


// ============================================================
// ESTADO
// ============================================================

function createState(): CombatState {

  const a =
    CombatStateEngine.createParticipant(
      createCharacter(
        1,
        "Guerreiro",
        14,
      ),
      20,
    )

  const b =
    CombatStateEngine.createParticipant(
      createCharacter(
        2,
        "Orc",
        10,
      ),
      20,
    )

  const c =
    CombatStateEngine.createParticipant(
      createCharacter(
        3,
        "Mago",
        18,
      ),
      20,
    )

  return CombatStateEngine.create([
    a,
    b,
    c,
  ])

}


// ============================================================
// TESTES
// ============================================================

describe(
  "CombatTurnEngine",
  () => {


    // ========================================================
    // INICIATIVA
    // ========================================================

    it(
      "deve calcular a iniciativa dos participantes",
      () => {

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.5,
          )

        const state =
          createState()

        const initiatives =
          CombatTurnEngine.rollInitiative(
            state,
          )

        expect(
          initiatives,
        ).toHaveLength(3)

        expect(
          initiatives[0].roll,
        ).toBeGreaterThan(
          initiatives[1].roll,
        )

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // INICIAR COMBATE
    // ========================================================

    it(
      "deve definir um participante ativo",
      () => {

        const state =
          createState()

        const started =
          CombatTurnEngine.start(
            state,
          )

        expect(
          started.activeParticipantId,
        ).not.toBeNull()

        expect(
          started.finished,
        ).toBe(false)

      },
    )


    // ========================================================
    // PARTICIPANTE ATIVO
    // ========================================================

    it(
      "deve retornar o participante ativo",
      () => {

        const state =
          createState()

        const started =
          CombatTurnEngine.start(
            state,
          )

        const active =
          CombatTurnEngine.getActiveParticipant(
            started,
          )

        expect(
          active,
        ).not.toBeNull()

        expect(
          active?.character.id,
        ).toBe(
          started.activeParticipantId,
        )

      },
    )


    // ========================================================
    // PODE AGIR
    // ========================================================

    it(
      "deve permitir ação apenas ao participante ativo",
      () => {

        const state =
          createState()

        const started =
          CombatTurnEngine.start(
            state,
          )

        const activeId =
          started.activeParticipantId!

        expect(
          CombatTurnEngine.canAct(
            started,
            activeId,
          ),
        ).toBe(true)

        const other =
          started.participants.find(
            participant =>
              participant.character.id !==
              activeId,
          )

        expect(
          CombatTurnEngine.canAct(
            started,
            other!.character.id,
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // PRÓXIMO TURNO
    // ========================================================

    it(
      "deve avançar para o próximo participante",
      () => {

        const state =
          createState()

        const started =
          CombatTurnEngine.start(
            state,
          )

        const first =
          started.activeParticipantId

        const next =
          CombatTurnEngine.nextTurn(
            started,
          )

        expect(
          next.activeParticipantId,
        ).not.toBe(
          first,
        )

      },
    )


    // ========================================================
    // DERROTADO
    // ========================================================

    it(
      "não deve permitir turno para participante derrotado",
      () => {

        const state =
          createState()

        const defeated =
          CombatStateEngine.applyDamage(
            state.participants[1],
            999,
          )

        const nextState: CombatState = {

          ...state,

          participants: [

            state.participants[0],

            defeated,

            state.participants[2],

          ],

          activeParticipantId:
            defeated.character.id,

        }

        expect(
          CombatTurnEngine.canAct(
            nextState,
            defeated.character.id,
          ),
        ).toBe(false)

      },
    )


  },
)