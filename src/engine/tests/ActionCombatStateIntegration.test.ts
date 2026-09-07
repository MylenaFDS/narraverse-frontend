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

import {
  CombatActionEngine,
} from "../combat/CombatActionEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"

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
  id: number,
  name: string,
  values: Record<string, string>,
): Character {

  return {

    id,

    name,

    user_id: 1,

    rpg_id: 1,

    is_npc: id !== 1,

    sheet_values:
      Object.entries(values).map(
        ([field, value], index) => ({

          id:
            id * 100 +
            index +
            1,

          value,

          field: {

            id:
              id * 100 +
              index +
              1,

            name: field,

            field_type: "number",

          },

        }),
      ),

    inventory: [],

  }

}


function createContext(
  characters: Character[],
): WorldContext {

  return {

    characters,

  } as WorldContext

}


function createCombatState(
  attacker: Character,
  defender: Character,
): CombatState {

  const attackerState =
    CombatStateEngine.createParticipant(
      attacker,
      20,
    )

  const defenderState =
    CombatStateEngine.createParticipant(
      defender,
      20,
    )

  return CombatStateEngine.create([
    attackerState,
    defenderState,
  ])

}


// ============================================================
// TESTES
// ============================================================

describe(
  "ActionEngine + CombatActionEngine",
  () => {


    // ========================================================
    // AÇÃO → COMBATE
    // ========================================================

    it(
      "deve transformar uma ação de ataque em ação de combate",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "30",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "10",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])

        const action: ActionRequest = {

          type: "attack",

          actor: hero,

          target: enemy,

        }

        const actionResult =
          ActionEngine.execute(
            context,
            action,
          )


        expect(
          actionResult.action,
        ).toBe("attack")


        expect(
          actionResult.requiresRoll,
        ).toBe(true)


        expect(
          actionResult.combat,
        ).toBeDefined()

      },
    )


    // ========================================================
    // COMBATE → ESTADO
    // ========================================================

    it(
      "deve resolver o ataque através do CombatActionEngine",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "30",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "10",
              Destreza: "10",
              Defesa: "1",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])


        let state =
          createCombatState(
            hero,
            enemy,
          )


        // ----------------------------------------------------
        // Deixa o inimigo com apenas 1 HP
        // ----------------------------------------------------

        state = {

          ...state,

          participants:
            state.participants.map(
              participant => {

                if (
                  participant.character.id !==
                  enemy.id
                ) {

                  return participant

                }

                return {

                  ...participant,

                  currentHP:
                    1,

                  maxHP:
                    1,

                }

              },
            ),

        }


        // ----------------------------------------------------
        // Define o herói como personagem ativo
        // ----------------------------------------------------

        state = {

          ...state,

          initiativeOrder: [

            hero.id,

            enemy.id,

          ],

          activeParticipantId:
            hero.id,

          finished:
            false,

        }


        // ----------------------------------------------------
        // Força 20 natural
        // ----------------------------------------------------

        vi
          .spyOn(
            Math,
            "random",
          )
          .mockReturnValue(
            0.999999,
          )


        const result =
          CombatActionEngine.execute(
            context,
            state,
            {

              attacker:
                hero,

              defender:
                enemy,

              action:
                "attack",

            },
          )


        // ----------------------------------------------------
        // Resultado do ataque
        // ----------------------------------------------------

        expect(
          result.combat.success,
        ).toBe(true)


        expect(
          result.combat.damage,
        ).toBeGreaterThan(0)


        // ----------------------------------------------------
        // Estado do defensor
        // ----------------------------------------------------

        const defender =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              enemy.id,
          )


        expect(
          defender?.currentHP,
        ).toBe(0)


        expect(
          defender?.defeated,
        ).toBe(true)


        // ----------------------------------------------------
        // Combate encerrado
        // ----------------------------------------------------

        expect(
          result.state.finished,
        ).toBe(true)


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // COMBATE ENCERRADO
    // ========================================================

    it(
      "deve impedir uma ação de combate quando o combate já terminou",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "30",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "10",
              Destreza: "10",
              Defesa: "1",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])


        const state =
          createCombatState(
            hero,
            enemy,
          )


        const finishedState: CombatState = {

          ...state,

          finished:
            true,

        }


        expect(
          () =>
            CombatActionEngine.execute(
              context,
              finishedState,
              {

                attacker:
                  hero,

                defender:
                  enemy,

                action:
                  "attack",

              },
            ),
        ).toThrow(
          "O combate já foi encerrado.",
        )

      },
    )


  },
)