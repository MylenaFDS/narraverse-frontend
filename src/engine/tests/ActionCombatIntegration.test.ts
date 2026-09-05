import {
  describe,
  expect,
  it,
  afterEach,
  vi,
} from "vitest"

import {
  ActionEngine,
  type ActionRequest,
} from "../ActionEngine"

import type {
  Character,
} from "../../types/character"

import type {
  WorldContext,
} from "../context/ContextEngine"

import {
  CombatEngine,
} from "../combat/CombatEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"


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
  defenderHP = 20,
): CombatState {

  const attackerState =
    CombatStateEngine.createParticipant(
      attacker,
      20,
    )

  const defenderState =
    CombatStateEngine.createParticipant(
      defender,
      defenderHP,
    )

  return CombatStateEngine.create([
    attackerState,
    defenderState,
  ])

}


// ============================================================
// REQUEST DE ATAQUE
// ============================================================

function createAttackRequest(
  attacker: Character,
  defender: Character,
  state: CombatState,
): ActionRequest {

  return {

    type: "attack",

    actor: attacker,

    target: defender,

    combatState: state,

  }

}


// ============================================================
// RESULTADO DE COMBATE MOCKADO
// ============================================================

function createCombatResult(
  overrides: Partial<ReturnType<typeof CombatEngine.resolve>> = {},
) {

  return {

    attackerId: 1,

    defenderId: 2,

    action: "attack" as const,

    probability: 75,

    damage: 6,

    criticalChance: 5,

    modifiers: [],

    consequences: [],

    success: true,

    outcome: "success" as const,

    attackRoll: {

      expression: "1d20+3",

      rolls: [15],

      modifier: 3,

      total: 18,

      difficulty: 15,

      margin: 3,

    },

    ...overrides,

  }

}


// ============================================================
// LIMPEZA DOS MOCKS
// ============================================================

afterEach(() => {

  vi.restoreAllMocks()

})


// ============================================================
// TESTES
// ============================================================

describe(
  "ActionEngine → CombatActionEngine",
  () => {


    // ========================================================
    // ATAQUE COM SUCESSO
    // ========================================================

    it(
      "deve executar um ataque através do ActionEngine e aplicar dano no estado",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue(
            createCombatResult({
              damage: 6,
              success: true,
              outcome: "success",
            }),
          )


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
          ActionEngine.execute(
            createContext(),
            createAttackRequest(
              attacker,
              defender,
              state,
            ),
          )


        // ----------------------------------------------------
        // RESULTADO DA AÇÃO
        // ----------------------------------------------------

        expect(
          result.action,
        ).toBe("attack")

        expect(
          result.success,
        ).toBe(true)

        expect(
          result.requiresRoll,
        ).toBe(true)


        // ----------------------------------------------------
        // RESULTADO DE COMBATE
        // ----------------------------------------------------

        expect(
          result.combatResult,
        ).toBeDefined()

        expect(
          result.combatResult?.combat.damage,
        ).toBe(6)


        // ----------------------------------------------------
        // ESTADO ATUALIZADO
        // ----------------------------------------------------

        expect(
          result.combatState,
        ).toBeDefined()


        const defenderState =
          result.combatState?.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          defenderState?.currentHP,
        ).toBe(14)


        expect(
          defenderState?.defeated,
        ).toBe(false)

      },
    )


    // ========================================================
    // ATAQUE FALHO
    // ========================================================

    it(
      "não deve causar dano quando o ataque falha através do ActionEngine",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue(
            createCombatResult({

              damage: 0,

              success: false,

              outcome: "failure",

            }),
          )


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
          ActionEngine.execute(
            createContext(),
            createAttackRequest(
              attacker,
              defender,
              state,
            ),
          )


        expect(
          result.action,
        ).toBe("attack")


        expect(
          result.success,
        ).toBe(false)


        expect(
          result.combatResult,
        ).toBeDefined()


        expect(
          result.combatResult?.combat.damage,
        ).toBe(0)


        const defenderState =
          result.combatState?.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          defenderState?.currentHP,
        ).toBe(20)


        expect(
          defenderState?.defeated,
        ).toBe(false)

      },
    )


    // ========================================================
    // SUCESSO CRÍTICO
    // ========================================================

    it(
      "deve propagar um sucesso crítico e aplicar o dano crítico no estado",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue(
            createCombatResult({

              damage: 12,

              success: true,

              outcome: "critical_success",

            }),
          )


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
          ActionEngine.execute(
            createContext(),
            createAttackRequest(
              attacker,
              defender,
              state,
            ),
          )


        // ----------------------------------------------------
        // CRÍTICO
        // ----------------------------------------------------

        expect(
          result.success,
        ).toBe(true)


        expect(
          result.combatResult?.combat.outcome,
        ).toBe("critical_success")


        expect(
          result.combatResult?.combat.damage,
        ).toBe(12)


        // ----------------------------------------------------
        // ESTADO
        // ----------------------------------------------------

        const defenderState =
          result.combatState?.participants.find(
            participant =>
              participant.character.id ===
              defender.id,
          )


        expect(
          defenderState?.currentHP,
        ).toBe(8)


        expect(
          defenderState?.defeated,
        ).toBe(false)

      },
    )


    // ========================================================
    // DERROTA DO DEFENSOR
    // ========================================================

    it(
      "deve marcar o defensor como derrotado e encerrar o combate",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue(
            createCombatResult({

              damage: 20,

              success: true,

              outcome: "critical_success",

            }),
          )


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
            20,
          )


        const result =
          ActionEngine.execute(
            createContext(),
            createAttackRequest(
              attacker,
              defender,
              state,
            ),
          )


        // ----------------------------------------------------
        // ATAQUE
        // ----------------------------------------------------

        expect(
          result.success,
        ).toBe(true)


        expect(
          result.combatResult?.combat.damage,
        ).toBe(20)


        // ----------------------------------------------------
        // DEFENSOR
        // ----------------------------------------------------

        const defenderState =
          result.combatState?.participants.find(
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


        // ----------------------------------------------------
        // COMBATE
        // ----------------------------------------------------

        expect(
          result.combatState?.finished,
        ).toBe(true)

      },
    )


    // ========================================================
    // RESULTADO COMPLETO
    // ========================================================

    it(
      "deve preservar o resultado de combate e o estado no ActionResult",
      () => {

        vi
          .spyOn(
            CombatEngine,
            "resolve",
          )
          .mockReturnValue(
            createCombatResult({

              damage: 6,

              success: true,

              outcome: "success",

            }),
          )


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
          ActionEngine.execute(
            createContext(),
            createAttackRequest(
              attacker,
              defender,
              state,
            ),
          )


        expect(
          result.combatResult,
        ).toBeDefined()


        expect(
          result.combatState,
        ).toBeDefined()


        expect(
          result.combatResult?.combat.attackerId,
        ).toBe(attacker.id)


        expect(
          result.combatResult?.combat.defenderId,
        ).toBe(defender.id)


        expect(
          result.combatResult?.combat.action,
        ).toBe("attack")


        expect(
          result.combatState?.participants,
        ).toHaveLength(2)

      },
    )


  },
)