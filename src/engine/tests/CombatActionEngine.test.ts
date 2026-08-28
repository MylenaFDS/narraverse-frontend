import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import type { Character } from "../../types/character"

import {
  CombatActionEngine,
} from "../combat/CombatActionEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"

import {
  CombatEngine,
} from "../combat/CombatEngine"

import type {
  WorldContext,
} from "../context/ContextEngine"


// ============================================================
// PERSONAGEM DE TESTE
// ============================================================

function createCharacter(
  id: number,
  name: string,
  hp = 20,
): Character {

  return {

    id,

    name,

    user_id: 1,

    rpg_id: 1,

    is_npc: false,

    sheet_values: [

      {
        id: id * 10 + 1,

        value: String(hp),

        field: {
          id: id * 10 + 1,
          name: "HP",
          field_type: "number",
        },

      },

      {
        id: id * 10 + 2,

        value: "16",

        field: {
          id: id * 10 + 2,
          name: "Força",
          field_type: "number",
        },

      },

    ],

    inventory: [],

  }

}


// ============================================================
// CONTEXTO DE TESTE
// ============================================================

function createContext(): WorldContext {

  return {

    characters: [],

    npcs: [],

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
  "CombatActionEngine",
  () => {


    // ========================================================
    // ATAQUE COM SUCESSO
    // ========================================================

    it(
      "deve executar um ataque com sucesso",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue({
            attackerId: 1,

defenderId: 2,

action: "attack",

            probability: 75,

            damage: 6,

            criticalChance: 5,

            modifiers: [],

            consequences: [],

            success: true,

            outcome:
              "success",

            attackRoll: {

              expression:
                "1d20+3",

              rolls: [15],

              modifier: 3,

              total: 18,

              difficulty: 15,

              margin: 3,

            },

          })


        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const result =
          CombatActionEngine.execute(
            createContext(),
            state,
            {
              attacker,
              defender,
              action: "attack",
            },
          )


        expect(
          result.combat.success,
        ).toBe(true)


        expect(
          result.combat.damage,
        ).toBe(6)


        const defenderState =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          defenderState?.currentHP,
        ).toBe(14)

      },
    )


    // ========================================================
    // ATAQUE FALHO
    // ========================================================

    it(
      "não deve causar dano quando o ataque falha",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue({
            attackerId: 1,

defenderId: 2,

action: "attack",

            probability: 20,

            damage: 0,

            criticalChance: 5,

            modifiers: [],

            consequences: [],

            success: false,

            outcome:
              "failure",

            attackRoll: {

              expression:
                "1d20+3",

              rolls: [5],

              modifier: 3,

              total: 8,

              difficulty: 15,

              margin: -7,

            },

          })


        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const result =
          CombatActionEngine.execute(
            createContext(),
            state,
            {
              attacker,
              defender,
              action: "attack",
            },
          )


        const defenderState =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          result.combat.success,
        ).toBe(false)


        expect(
          result.combat.damage,
        ).toBe(0)


        expect(
          defenderState?.currentHP,
        ).toBe(20)

      },
    )


    // ========================================================
    // DANO CRÍTICO
    // ========================================================

    it(
      "deve aplicar dano crítico corretamente",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue({
            attackerId: 1,

defenderId: 2,

action: "attack",

            probability: 100,

            damage: 12,

            criticalChance: 5,

            modifiers: [],

            consequences: [
              "O ataque foi um sucesso crítico.",
            ],

            success: true,

            outcome:
              "critical_success",

            attackRoll: {

              expression:
                "1d20+3",

              rolls: [20],

              modifier: 3,

              total: 23,

              difficulty: 15,

              margin: 8,

            },

          })


        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const result =
          CombatActionEngine.execute(
            createContext(),
            state,
            {
              attacker,
              defender,
              action: "attack",
            },
          )


        const defenderState =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          result.combat.outcome,
        ).toBe(
          "critical_success",
        )


        expect(
          defenderState?.currentHP,
        ).toBe(8)

      },
    )


    // ========================================================
    // DERROTA
    // ========================================================

    it(
      "deve marcar o defensor como derrotado",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue({
            attackerId: 1,

defenderId: 2,

action: "attack",

            probability: 100,

            damage: 20,

            criticalChance: 5,

            modifiers: [],

            consequences: [],

            success: true,

            outcome:
              "success",

            attackRoll: {

              expression:
                "1d20+3",

              rolls: [15],

              modifier: 3,

              total: 18,

              difficulty: 15,

              margin: 3,

            },

          })


        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const result =
          CombatActionEngine.execute(
            createContext(),
            state,
            {
              attacker,
              defender,
              action: "attack",
            },
          )


        const defenderState =
          result.state.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          defenderState?.currentHP,
        ).toBe(0)


        expect(
          defenderState?.defeated,
        ).toBe(true)


        expect(
          result.state.finished,
        ).toBe(true)

      },
    )


    // ========================================================
    // ATACANTE DERROTADO
    // ========================================================

    it(
      "não deve permitir que um personagem derrotado ataque",
      () => {

        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const defeatedAttacker =
          CombatStateEngine.applyDamage(
            state.participants[0],
            100,
          )


        const defeatedState: CombatState = {

          ...state,

          participants: [

            defeatedAttacker,

            state.participants[1],

          ],

        }


        expect(() =>
          CombatActionEngine.execute(
            createContext(),
            defeatedState,
            {
              attacker,
              defender,
              action: "attack",
            },
          ),
        ).toThrow(
          "O atacante está derrotado.",
        )

      },
    )


    // ========================================================
    // COMBATE ENCERRADO
    // ========================================================

    it(
      "não deve permitir ações após o fim do combate",
      () => {

        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        const finishedState: CombatState = {

          ...state,

          finished: true,

        }


        expect(() =>
          CombatActionEngine.execute(
            createContext(),
            finishedState,
            {
              attacker,
              defender,
              action: "attack",
            },
          ),
        ).toThrow(
          "O combate já foi encerrado.",
        )

      },
    )


    // ========================================================
    // DEFENSOR NÃO PARTICIPANTE
    // ========================================================

    it(
      "deve rejeitar um defensor que não participa do combate",
      () => {

        const attacker =
          createCharacter(
            1,
            "Atacante",
          )

        const defender =
          createCharacter(
            2,
            "Defensor",
          )

        const outsider =
          createCharacter(
            3,
            "Intruso",
          )


        const state =
          createCombatState(
            attacker,
            defender,
          )


        expect(() =>
          CombatActionEngine.execute(
            createContext(),
            state,
            {
              attacker,
              defender: outsider,
              action: "attack",
            },
          ),
        ).toThrow(
          "Defensor não participa deste combate.",
        )

      },
    )


  },
)