import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  CombatActionEngine,
} from "../combat/CombatActionEngine"

import {
  CombatTurnEngine,
} from "../combat/CombatTurnEngine"

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

    user_id:
      id,

    rpg_id:
      1,

    is_npc:
      id !== 1,

    sheet_values:
      Object.entries(values).map(
        ([fieldName, value], index) => ({

          id:
            id * 100 + index + 1,

          value,

          field: {

            id:
              id * 100 + index + 1,

            name:
              fieldName,

            field_type:
              "number",

          },

        }),
      ),

    inventory:
      [],

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
  } as WorldContext

}


// ============================================================
// ESTADO DE COMBATE
// ============================================================

function createCombatState(
  characters: Character[],
  hp = 20,
): CombatState {

  const participants =
    characters.map(
      character =>
        CombatStateEngine.createParticipant(
          character,
          hp,
        ),
    )

  return CombatStateEngine.create(
    participants,
  )

}


// ============================================================
// CONFIGURAR TURNO
// ============================================================

function activateCharacter(
  state: CombatState,
  characterId: number,
): CombatState {

  return {

    ...state,

    initiativeOrder:
      state.initiativeOrder.length > 0
        ? state.initiativeOrder
        : state.participants.map(
            participant =>
              participant.character.id,
          ),

    activeParticipantId:
      characterId,

    finished:
      false,

  }

}


// ============================================================
// TESTES
// ============================================================

describe(
  "CombatTurnActionIntegration",
  () => {


    // ========================================================
    // 1. INICIAR COMBATE
    // ========================================================

    it(
      "deve iniciar o combate e definir corretamente o primeiro turno",
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
              Força: "10",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const state =
          createCombatState([
            hero,
            enemy,
          ])

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
        )

        const started =
          CombatTurnEngine.start(
            state,
          )

        expect(
          started.finished,
        ).toBe(false)

        expect(
          started.round,
        ).toBe(1)

        expect(
          started.activeParticipantId,
        ).not.toBeNull()

        expect(
          started.initiativeOrder,
        ).toHaveLength(2)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 2. APENAS ATIVO PODE AGIR
    // ========================================================

    it(
      "deve permitir ação somente ao personagem ativo",
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
              Força: "10",
              Destreza: "10",
              Defesa: "10",
            },
          )

        const state =
          activateCharacter(
            createCombatState([
              hero,
              enemy,
            ]),
            hero.id,
          )

        expect(
          CombatTurnEngine.canAct(
            state,
            hero.id,
          ),
        ).toBe(true)

        expect(
          CombatTurnEngine.canAct(
            state,
            enemy.id,
          ),
        ).toBe(false)

      },
    )


    // ========================================================
    // 3. EXECUTAR ATAQUE
    // ========================================================

    it(
      "deve executar ataque durante o turno do personagem ativo",
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
          activateCharacter(
            createCombatState([
              hero,
              enemy,
            ]),
            hero.id,
          )

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
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

        expect(
          result.combat.success,
        ).toBe(true)

        expect(
          result.combat.damage,
        ).toBeGreaterThan(0)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 4. PASSAR TURNO
    // ========================================================

    it(
      "deve passar o turno para o próximo personagem após a ação",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "16",
              Destreza: "20",
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
          createCombatState([
            hero,
            enemy,
          ])

        state =
          activateCharacter(
            state,
            hero.id,
          )

        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

        }

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
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

        expect(
          result.state.finished,
        ).toBe(false)

        expect(
          result.state.activeParticipantId,
        ).toBe(enemy.id)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 5. NOVA RODADA
    // ========================================================

    it(
      "deve iniciar uma nova rodada após todos os personagens vivos agirem",
      () => {

        const hero =
          createCharacter(
            1,
            "Herói",
            {
              Força: "16",
              Destreza: "20",
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

          round:
            1,

          finished:
            false,

        }

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.5,
        )

        const first =
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

        expect(
          first.state.activeParticipantId,
        ).toBe(enemy.id)

        const second =
          CombatActionEngine.execute(
            context,
            first.state,
            {
              attacker:
                enemy,

              defender:
                hero,

              action:
                "attack",
            },
          )

        expect(
          second.state.finished,
        ).toBe(false)

        expect(
          second.state.activeParticipantId,
        ).toBe(hero.id)

        expect(
          second.state.round,
        ).toBe(2)

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 6. DERROTA ENCERRA COMBATE
    // ========================================================

    it(
      "deve encerrar o combate quando o ataque derrotar o defensor",
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
            [
              hero,
              enemy,
            ],
            1,
          )

        state =
          activateCharacter(
            state,
            hero.id,
          )

        state = {
          ...state,

          initiativeOrder: [
            hero.id,
            enemy.id,
          ],

        }

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
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

        const defender =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              enemy.id,
          )

        expect(
          result.combat.success,
        ).toBe(true)

        expect(
          result.combat.damage,
        ).toBeGreaterThan(0)

        expect(
          defender?.currentHP,
        ).toBe(0)

        expect(
          defender?.defeated,
        ).toBe(true)

        expect(
          result.state.finished,
        ).toBe(true)

        expect(
          result.state.activeParticipantId,
        ).toBeNull()

        vi.restoreAllMocks()

      },
    )


    // ========================================================
    // 7. BLOQUEAR AÇÕES APÓS O FIM
    // ========================================================

    it(
      "não deve permitir novas ações depois do fim do combate",
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
            [
              hero,
              enemy,
            ],
            1,
          )

        state =
          activateCharacter(
            state,
            hero.id,
          )

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.999999,
        )

        const firstAttack =
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

        expect(
          firstAttack.state.finished,
        ).toBe(true)

        expect(() =>
          CombatActionEngine.execute(
            context,
            firstAttack.state,
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

        expect(
          CombatTurnEngine.canAct(
            firstAttack.state,
            hero.id,
          ),
        ).toBe(false)

        expect(
          CombatTurnEngine.canAct(
            firstAttack.state,
            enemy.id,
          ),
        ).toBe(false)

        vi.restoreAllMocks()

      },
    )

  },
)