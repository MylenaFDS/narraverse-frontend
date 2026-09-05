import { describe, expect, it, vi } from "vitest"

import {
  CombatEngine,
  type CombatAction,
} from "../combat/CombatEngine"

import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"


// ============================================================
// MOCK DE PERSONAGEM
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

    sheet_values:
      Object.entries(values).map(
        ([fieldName, value], index) => ({

          id: index + 1,

          value,

          field: {

            id: index + 1,

            name: fieldName,

            field_type: "number",

          },

        }),
      ),

  }

}


// ============================================================
// CONTEXTO MÍNIMO
// ============================================================

function createContext(
  attacker: Character,
  defender: Character,
): WorldContext {

  return {

    characters: [
      attacker,
      defender,
    ],

    npcs: [
      defender,
    ],

    lore: [],

    factions: [],

    profile: {} as WorldContext["profile"],

    inventory: [],

    recentTurns: [],

    timeline: [],

  }

}


// ============================================================
// TESTES
// ============================================================

describe(
  "CombatEngine - resultado de combate",
  () => {


    // ========================================================
    // ESTRUTURA
    // ========================================================

    it(
      "deve retornar a estrutura completa do resultado",
      () => {

        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "16",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "10",
              HP: "30",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }

        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.attackerId,
        ).toBe(1)


        expect(
          result.defenderId,
        ).toBe(2)


        expect(
          result.action,
        ).toBe("attack")


        expect(
          typeof result.success,
        ).toBe("boolean")


        expect([
          "critical_failure",
          "failure",
          "partial_success",
          "success",
          "critical_success",
        ]).toContain(
          result.outcome,
        )

      },
    )


    // ========================================================
    // ROLAGEM
    // ========================================================

    it(
      "deve retornar os dados da rolagem de ataque",
      () => {

        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "16",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "10",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }

        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.attackRoll.expression,
        ).toMatch(
          /^1d20[+-]\d+$/i,
        )


        expect(
          result.attackRoll.rolls,
        ).toHaveLength(1)


        expect(
          result.attackRoll.rolls[0],
        ).toBeGreaterThanOrEqual(1)


        expect(
          result.attackRoll.rolls[0],
        ).toBeLessThanOrEqual(20)


        expect(
          typeof result.attackRoll.total,
        ).toBe("number")


        expect(
          typeof result.attackRoll.difficulty,
        ).toBe("number")


        expect(
          typeof result.attackRoll.margin,
        ).toBe("number")

      },
    )


    // ========================================================
    // DANO — ATAQUE FALHOU
    // ========================================================

    it(
      "deve retornar dano igual a zero quando o ataque falhar",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.20,
          )


        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "1",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "100",
              HP: "30",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }


        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.success,
        ).toBe(false)


        expect(
          result.damage,
        ).toBe(0)


        expect(
          result.outcome,
        ).toBe("failure")


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // DANO POSITIVO
    // ========================================================

    it(
      "deve causar dano quando o ataque for bem-sucedido",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.50,
          )


        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "20",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "1",
              HP: "100",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }


        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.success,
        ).toBe(true)


        expect(
          result.damage,
        ).toBeGreaterThan(0)


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // CRÍTICO
    // ========================================================

    it(
      "deve aplicar dano crítico quando sair 20 natural",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.999999,
          )


        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "16",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "10",
              HP: "100",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }


        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.attackRoll.rolls[0],
        ).toBe(20)


        expect(
          result.outcome,
        ).toBe("critical_success")


        expect(
          result.damage,
        ).toBe(
          result.attackRoll.modifier >= 0
            ? Math.round(
                Math.max(
                  1,
                  result.attackRoll.modifier,
                ) / 2,
              ) * 2
            : result.damage,
        )


        randomSpy.mockRestore()

      },
    )


    // ========================================================
    // CONSEQUÊNCIAS
    // ========================================================

    it(
      "deve registrar consequência de sucesso crítico",
      () => {

        const randomSpy =
          vi.spyOn(
            Math,
            "random",
          ).mockReturnValue(
            0.999999,
          )


        const attacker =
          createCharacter(
            1,
            "Guerreiro",
            {
              Força: "16",
            },
          )

        const defender =
          createCharacter(
            2,
            "Orc",
            {
              Defesa: "10",
            },
          )

        const context =
          createContext(
            attacker,
            defender,
          )

        const action: CombatAction = {

          attacker: {
            character: attacker,
          },

          defender: {
            character: defender,
          },

          action: "attack",

        }


        const result =
          CombatEngine.resolve(
            context,
            action,
          )


        expect(
          result.consequences,
        ).toContain(
          "O ataque foi um sucesso crítico.",
        )


        randomSpy.mockRestore()

      },
    )


  },
)