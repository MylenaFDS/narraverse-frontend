import {
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  CombatEngine,
  type CombatAction,
} from "../combat/CombatEngine"

import {
  DiceResolver,
} from "../dice/DiceResolver"

import type {
  Character,
} from "../../types/character"

import type {
  WorldContext,
} from "../context/ContextEngine"


// ============================================================
// PERSONAGENS DE TESTE
// ============================================================

function createCharacter(
  id: number,
  name: string,
  strength: number,
  defense: number,
): Character {

  return {
    id,
    name,
    user_id: id,
    rpg_id: 1,

    is_npc: false,

    sheet_values: [
      {
        id: id * 10 + 1,
        value: String(strength),
        field: {
          id: id * 10 + 1,
          name: "Força",
          field_type: "number",
        },
      },
      {
        id: id * 10 + 2,
        value: String(defense),
        field: {
          id: id * 10 + 2,
          name: "Defesa",
          field_type: "number",
        },
      },
      {
        id: id * 10 + 3,
        value: "100",
        field: {
          id: id * 10 + 3,
          name: "HP",
          field_type: "number",
        },
      },
    ],

    inventory: [],
  }

}


// ============================================================
// CONTEXTO
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

    npcs: [],

    lore: [],

    factions: [],

    profile: {} as WorldContext["profile"],

    inventory: [],

    currentScene: undefined,

    currentTurn: null,

    recentTurns: [],

    timeline: [],

  }

}


// ============================================================
// COMBATE
// ============================================================

function createCombat(
  attacker: Character,
  defender: Character,
): CombatAction {

  return {

    attacker: {
      character: attacker,
    },

    defender: {
      character: defender,
    },

    action: "attack",

  }

}


// ============================================================
// TESTES
// ============================================================

describe("CombatEngine", () => {


  // ==========================================================
  // ATAQUE BÁSICO
  // ==========================================================

  it("deve calcular corretamente o modificador de ataque", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        12,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )

    const result =
      CombatEngine.analyze(
        context,
        combat,
      )

    // Força 16 → modificador +3
    expect(
      result.probability,
    ).toBeGreaterThan(0)

  })


  // ==========================================================
  // ATAQUE BEM-SUCEDIDO
  // ==========================================================

  it("deve causar dano quando o ataque for bem-sucedido", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [15],
      modifier: 3,
      total: 18,
      difficulty: 10,
      success: true,
      outcome: "success",
      margin: 8,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.success,
    ).toBe(true)

    expect(
      result.outcome,
    ).toBe("success")

    expect(
      result.damage,
    ).toBeGreaterThan(0)

    expect(
      result.attackRoll.total,
    ).toBe(18)


    vi.restoreAllMocks()

  })


  // ==========================================================
  // FALHA
  // ==========================================================

  it("deve causar zero dano quando o ataque falhar", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        20,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [5],
      modifier: 3,
      total: 8,
      difficulty: 20,
      success: false,
      outcome: "failure",
      margin: -12,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.success,
    ).toBe(false)

    expect(
      result.outcome,
    ).toBe("failure")

    expect(
      result.damage,
    ).toBe(0)


    vi.restoreAllMocks()

  })


  // ==========================================================
  // CRÍTICO
  // ==========================================================

  it("deve dobrar o dano em um sucesso crítico", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [20],
      modifier: 3,
      total: 23,
      difficulty: 10,
      success: true,
      outcome: "critical_success",
      margin: 13,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.success,
    ).toBe(true)

    expect(
      result.outcome,
    ).toBe("critical_success")

    expect(
      result.damage,
    ).toBeGreaterThan(0)

    expect(
      result.damage,
    ).toBe(4)

    expect(
      result.consequences,
    ).toContain(
      "O ataque foi um sucesso crítico.",
    )


    vi.restoreAllMocks()

  })


  // ==========================================================
  // ROLAGEM
  // ==========================================================

  it("deve usar o modificador de Força na rolagem", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    const spy =
      vi.spyOn(
        DiceResolver,
        "resolve",
      ).mockReturnValue({
        expression: "1d20+3",
        rolls: [12],
        modifier: 3,
        total: 15,
        difficulty: 10,
        success: true,
        outcome: "success",
        margin: 5,
      })


    CombatEngine.resolve(
      context,
      combat,
    )


    expect(
      spy,
    ).toHaveBeenCalledWith(
      "1d20+3",
      10,
    )


    vi.restoreAllMocks()

  })


  // ==========================================================
  // EXPRESSÃO NEGATIVA
  // ==========================================================

  it("deve construir corretamente uma expressão com modificador negativo", () => {

    const attacker =
      createCharacter(
        1,
        "Fraco",
        1,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    const spy =
      vi.spyOn(
        DiceResolver,
        "resolve",
      ).mockReturnValue({
        expression: "1d20-5",
        rolls: [10],
        modifier: -5,
        total: 5,
        difficulty: 10,
        success: false,
        outcome: "failure",
        margin: -5,
      })


    CombatEngine.resolve(
      context,
      combat,
    )


    expect(
      spy,
    ).toHaveBeenCalledWith(
      "1d20-5",
      10,
    )


    vi.restoreAllMocks()

  })


  // ==========================================================
  // HP INSUFICIENTE
  // ==========================================================

  it("deve identificar quando o dano pode derrotar o alvo", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )


    // --------------------------------------------------------
    // Remove o HP padrão de 100
    // --------------------------------------------------------

    defender.sheet_values =
      defender.sheet_values.filter(
        (item) =>
          item.field.name !== "HP",
      )


    // --------------------------------------------------------
    // Adiciona HP = 2
    // --------------------------------------------------------

    defender.sheet_values.push({
      id: 24,
      value: "2",
      field: {
        id: 24,
        name: "HP",
        field_type: "number",
      },
    })


    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [15],
      modifier: 3,
      total: 18,
      difficulty: 10,
      success: true,
      outcome: "success",
      margin: 8,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.success,
    ).toBe(true)

    expect(
      result.damage,
    ).toBeGreaterThanOrEqual(2)

    expect(
      result.consequences,
    ).toContain(
      "O alvo poderá ser derrotado.",
    )

    expect(
      result.consequences,
    ).toContain(
      "O dano pode deixar o alvo derrotado.",
    )


    vi.restoreAllMocks()

  })


  // ==========================================================
  // FALHA CRÍTICA
  // ==========================================================

  it("deve registrar uma falha crítica no resultado do combate", () => {

    const attacker =
      createCharacter(
        1,
        "Guerreiro",
        16,
        10,
      )

    const defender =
      createCharacter(
        2,
        "Goblin",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [1],
      modifier: 3,
      total: 4,
      difficulty: 10,
      success: false,
      outcome: "critical_failure",
      margin: -6,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.success,
    ).toBe(false)

    expect(
      result.outcome,
    ).toBe("critical_failure")

    expect(
      result.damage,
    ).toBe(0)

    expect(
      result.consequences,
    ).toContain(
      "O ataque sofreu uma falha crítica.",
    )


    vi.restoreAllMocks()

  })


  // ==========================================================
  // IDENTIDADE DO COMBATE
  // ==========================================================

  it("deve preservar os IDs dos participantes e o tipo da ação", () => {

    const attacker =
      createCharacter(
        10,
        "Aragorn",
        16,
        10,
      )

    const defender =
      createCharacter(
        20,
        "Orc",
        10,
        10,
      )

    const context =
      createContext(
        attacker,
        defender,
      )

    const combat =
      createCombat(
        attacker,
        defender,
      )


    vi.spyOn(
      DiceResolver,
      "resolve",
    ).mockReturnValue({
      expression: "1d20+3",
      rolls: [15],
      modifier: 3,
      total: 18,
      difficulty: 10,
      success: true,
      outcome: "success",
      margin: 8,
    })


    const result =
      CombatEngine.resolve(
        context,
        combat,
      )


    expect(
      result.attackerId,
    ).toBe(10)

    expect(
      result.defenderId,
    ).toBe(20)

    expect(
      result.action,
    ).toBe("attack")

    expect(
      result.attackRoll.expression,
    ).toBe("1d20+3")


    vi.restoreAllMocks()

  })

})