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

    sheet_values: Object.entries(values).map(
      ([fieldName, value], index) => ({
        id: id * 100 + index + 1,
        value,
        field: {
          id: id * 100 + index + 1,
          name: fieldName,
          field_type: "number",
        },
      }),
    ),
  }
}


// ============================================================
// CONTEXTO
// ============================================================

function createContext(
  characters: Character[],
): WorldContext {

  return {
    characters,
    npcs: characters.filter(
      character => character.is_npc,
    ),
    lore: [],
    factions: [],
    profile: {} as WorldContext["profile"],
    inventory: [],
    recentTurns: [],
    timeline: [],
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
  "ActionEngine → CombatTurn Integration",
  () => {


    // ========================================================
    // AÇÃO DE ATAQUE
    // ========================================================

    it(
      "deve executar um ataque através do ActionEngine",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "20",
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

        let state =
          createCombatState([
            hero,
            enemy,
          ])


        // ------------------------------------------------------
        // GARANTIR QUE O HERÓI COMECE
        // ------------------------------------------------------

        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

          activeParticipantId:
            hero.id,

          round: 1,

          finished: false,
        }


        // ------------------------------------------------------
        // ROLAGEM MÁXIMA
        // ------------------------------------------------------

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.999999,
        )


        // ------------------------------------------------------
        // PEDIDO DE AÇÃO
        // ------------------------------------------------------

        const request: ActionRequest = {

          type:
            "attack",

          actor:
            hero,

          target:
            enemy,

          combatState:
            state,

        }


        // ------------------------------------------------------
        // EXECUTAR
        // ------------------------------------------------------

        const result =
          ActionEngine.execute(
            context,
            request,
          )


        // ------------------------------------------------------
        // VERIFICAR RESULTADO
        // ------------------------------------------------------

        expect(
          result.action,
        ).toBe(
          "attack",
        )

        expect(
          result.requiresRoll,
        ).toBe(true)

        expect(
          result.success,
        ).toBe(true)


        // ------------------------------------------------------
        // RESULTADO DE COMBATE
        // ------------------------------------------------------

        expect(
          result.combatResult,
        ).toBeDefined()

        expect(
          result.combatResult?.combat.attackerId,
        ).toBe(
          hero.id,
        )

        expect(
          result.combatResult?.combat.defenderId,
        ).toBe(
          enemy.id,
        )


        // ------------------------------------------------------
        // ESTADO DE COMBATE
        // ------------------------------------------------------

        expect(
          result.combatState,
        ).toBeDefined()

        expect(
          result.combatState?.finished,
        ).toBe(false)


        // ------------------------------------------------------
        // DANO
        // ------------------------------------------------------

        const defender =
          result.combatState?.participants.find(
            participant =>
              participant.character.id ===
              enemy.id,
          )

        expect(
          defender,
        ).toBeDefined()

        expect(
          defender!.currentHP,
        ).toBeLessThan(
          defender!.maxHP,
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // AVANÇO DO TURNO
    // ========================================================

    it(
      "deve passar o turno para o próximo personagem",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "16",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "12",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])

        let state =
          createCombatState([
            hero,
            enemy,
          ])


        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

          activeParticipantId:
            hero.id,

          round: 1,

          finished: false,
        }


        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
        )


        const result =
          ActionEngine.execute(
            context,
            {
              type:
                "attack",

              actor:
                hero,

              target:
                enemy,

              combatState:
                state,
            },
          )


        // ------------------------------------------------------
        // O ActionEngine já deve devolver o próximo turno
        // ------------------------------------------------------

        expect(
          result.combatState?.activeParticipantId,
        ).toBe(
          enemy.id,
        )


        expect(
          result.combatState?.round,
        ).toBe(
          1,
        )


        expect(
          result.combatState?.finished,
        ).toBe(false)


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // NOVA RODADA
    // ========================================================

    it(
      "deve iniciar uma nova rodada através de duas ações",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "16",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "12",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])

        let state =
          createCombatState([
            hero,
            enemy,
          ])


        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

          activeParticipantId:
            hero.id,

          round: 1,

          finished: false,
        }


        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
        )


        // ------------------------------------------------------
        // HERÓI AGE
        // ------------------------------------------------------

        const firstAction =
          ActionEngine.execute(
            context,
            {
              type:
                "attack",

              actor:
                hero,

              target:
                enemy,

              combatState:
                state,
            },
          )


        expect(
          firstAction.combatState?.activeParticipantId,
        ).toBe(
          enemy.id,
        )


        expect(
          firstAction.combatState?.round,
        ).toBe(
          1,
        )


        // ------------------------------------------------------
        // GOBLIN AGE
        // ------------------------------------------------------

        const secondAction =
          ActionEngine.execute(
            context,
            {
              type:
                "attack",

              actor:
                enemy,

              target:
                hero,

              combatState:
                firstAction.combatState!,
            },
          )


        // ------------------------------------------------------
        // NOVA RODADA
        // ------------------------------------------------------

        expect(
          secondAction.combatState?.round,
        ).toBe(
          2,
        )


        expect(
          secondAction.combatState?.activeParticipantId,
        ).toBe(
          hero.id,
        )


        expect(
          secondAction.combatState?.finished,
        ).toBe(false)


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // PERSONAGEM FORA DO TURNO
    // ========================================================

    it(
      "não deve permitir que um personagem fora do turno ataque",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "16",
              Destreza: "14",
              Defesa: "10",
            },
          )

        const enemy =
          createCharacter(
            2,
            "Goblin",
            {
              Força: "12",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const context =
          createContext([
            hero,
            enemy,
          ])

        let state =
          createCombatState([
            hero,
            enemy,
          ])


        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

          activeParticipantId:
            hero.id,

          round: 1,

          finished: false,
        }


        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
        )


        expect(() =>
          ActionEngine.execute(
            context,
            {
              type:
                "attack",

              actor:
                enemy,

              target:
                hero,

              combatState:
                state,
            },
          ),
        ).toThrow(
          "Não é o turno do atacante.",
        )


        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // DERROTA
    // ========================================================

    it(
      "deve encerrar o combate quando o ActionEngine derrotar o defensor",
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

        let state =
          createCombatState([
            hero,
            enemy,
          ])


        // ------------------------------------------------------
        // REDUZIR HP DO INIMIGO
        // ------------------------------------------------------

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

                  defeated:
                    false,

                }

              },
            ),

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

          activeParticipantId:
            hero.id,

          round:
            1,

          finished:
            false,

        }


        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.999999,
        )


        // ------------------------------------------------------
        // EXECUTAR ATAQUE
        // ------------------------------------------------------

        const result =
          ActionEngine.execute(
            context,
            {
              type:
                "attack",

              actor:
                hero,

              target:
                enemy,

              combatState:
                state,
            },
          )


        // ------------------------------------------------------
        // COMBATE ENCERRADO
        // ------------------------------------------------------

        expect(
          result.success,
        ).toBe(true)


        expect(
          result.combatState?.finished,
        ).toBe(true)


        expect(
          result.combatState?.activeParticipantId,
        ).toBeNull()


        // ------------------------------------------------------
        // DEFENSOR DERROTADO
        // ------------------------------------------------------

        const defender =
          result.combatState?.participants.find(
            participant =>
              participant.character.id ===
              enemy.id,
          )


        expect(
          defender,
        ).toBeDefined()

        expect(
          defender!.currentHP,
        ).toBe(0)

        expect(
          defender!.defeated,
        ).toBe(true)


        vi.restoreAllMocks()

      },
    )

  },
)