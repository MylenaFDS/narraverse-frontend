import { describe, expect, it, vi } from "vitest"

import type { Character } from "../../types/character"

import type { WorldContext } from "../context/ContextEngine"

import {
  CombatStateEngine,
  type CombatState,
} from "../combat/CombatState"

import { CombatTurnEngine } from "../combat/CombatTurnEngine"

import { CombatActionEngine } from "../combat/CombatActionEngine"


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

    sheet_values: Object.entries(values).map(
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
// CONTEXTO
// ============================================================

function createContext(
  characters: Character[],
): WorldContext {

  return {
    characters,
    npcs: characters.filter(character => character.is_npc),
    lore: [],
    factions: [],
    profile: {} as WorldContext["profile"],
    inventory: [],
    recentTurns: [],
    timeline: [],
  }
}


// ============================================================
// ESTADO INICIAL
// ============================================================

function createCombatState(
  characters: Character[],
): CombatState {

  const participants = characters.map(character =>
    CombatStateEngine.createParticipant(
      character,
      20,
    ),
  )

  return CombatStateEngine.create(participants)
}


// ============================================================
// TESTES
// ============================================================

describe("FullCombatIntegration", () => {

  // ==========================================================
  // INICIAR COMBATE
  // ==========================================================

  it("deve iniciar o combate e definir o primeiro personagem ativo", () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "16",
        Destreza: "14",
        Defesa: "12",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "12",
        Destreza: "10",
        Defesa: "10",
      },
    )

    const state = createCombatState([
      hero,
      enemy,
    ])

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)

    const started = CombatTurnEngine.start(state)

    expect(started.finished).toBe(false)

    expect(started.initiativeOrder)
      .toHaveLength(2)

    expect(started.activeParticipantId)
      .toBe(hero.id)

    vi.restoreAllMocks()
  })


  // ==========================================================
  // PERSONAGEM ATIVO PODE AGIR
  // ==========================================================

  it("deve permitir que apenas o personagem ativo execute uma ação", () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "16",
        Destreza: "14",
        Defesa: "12",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "12",
        Destreza: "10",
        Defesa: "10",
      },
    )

    const state = createCombatState([
      hero,
      enemy,
    ])

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)

    const started = CombatTurnEngine.start(state)

    expect(
      CombatTurnEngine.canAct(
        started,
        hero.id,
      ),
    ).toBe(true)

    expect(
      CombatTurnEngine.canAct(
        started,
        enemy.id,
      ),
    ).toBe(false)

    vi.restoreAllMocks()
  })


  // ==========================================================
  // ATAQUE
  // ==========================================================

  it("deve executar um ataque e aplicar dano ao defensor", () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "20",
        Destreza: "14",
        Defesa: "10",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "10",
        Destreza: "10",
        Defesa: "10",
      },
    )

    const context = createContext([
      hero,
      enemy,
    ])

    const state = createCombatState([
      hero,
      enemy,
    ])

    vi.spyOn(Math, "random")
      .mockReturnValue(0.8)

    const started = CombatTurnEngine.start(state)

    const result = CombatActionEngine.execute(
      context,
      started,
      {
        attacker: hero,
        defender: enemy,
        action: "attack",
      },
    )

    expect(result.combat)
      .toBeDefined()

    expect(result.combat.attackerId)
      .toBe(hero.id)

    expect(result.combat.defenderId)
      .toBe(enemy.id)

    expect(result.combat.damage)
      .toBeGreaterThan(0)

    const defender = result.state.participants
      .find(participant =>
        participant.character.id === enemy.id,
      )

    expect(defender)
      .toBeDefined()

    expect(defender!.currentHP)
      .toBeLessThan(20)

    vi.restoreAllMocks()
  })


  // ==========================================================
  // FIM DO TURNO
  // ==========================================================

  it("deve passar o turno para o próximo personagem depois da ação", () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "16",
        Destreza: "14",
        Defesa: "10",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "12",
        Destreza: "10",
        Defesa: "10",
      },
    )

    const context = createContext([
      hero,
      enemy,
    ])

    const state = createCombatState([
      hero,
      enemy,
    ])

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.5)

    const started = CombatTurnEngine.start(state)

    expect(started.activeParticipantId)
      .toBe(hero.id)

    const result = CombatActionEngine.execute(
      context,
      started,
      {
        attacker: hero,
        defender: enemy,
        action: "attack",
      },
    )

    const nextTurn = CombatTurnEngine.nextTurn(
      result.state,
    )

    expect(nextTurn.activeParticipantId)
      .toBe(enemy.id)

    expect(nextTurn.finished)
      .toBe(false)

    vi.restoreAllMocks()
  })


  // ==========================================================
  // NOVA RODADA
  // ==========================================================

  it("deve iniciar uma nova rodada quando todos os participantes vivos tiverem agido", () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "16",
        Destreza: "14",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "12",
        Destreza: "10",
      },
    )

    const context = createContext([
      hero,
      enemy,
    ])

    const state = createCombatState([
      hero,
      enemy,
    ])

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.5)

    const started = CombatTurnEngine.start(state)

    const firstAction = CombatActionEngine.execute(
      context,
      started,
      {
        attacker: hero,
        defender: enemy,
        action: "attack",
      },
    )

    const secondTurn = CombatTurnEngine.nextTurn(
      firstAction.state,
    )

    expect(secondTurn.activeParticipantId)
      .toBe(enemy.id)

    const nextRound = CombatTurnEngine.nextTurn(
      secondTurn,
    )

    expect(nextRound.round)
      .toBe(2)

    expect(nextRound.activeParticipantId)
      .toBe(hero.id)

    expect(nextRound.finished)
      .toBe(false)

    vi.restoreAllMocks()
  })


  // ==========================================================
  // DERROTA
  // ==========================================================

  it(
  "deve encerrar o combate quando um personagem for derrotado",
  () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "30",
        Destreza: "14",
        Defesa: "10",
      },
    )


    const enemy = createCharacter(
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


    // ========================================================
    // GARANTIR QUE O ATAQUE POSSA DERROTAR O INIMIGO
    // ========================================================

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

              currentHP: 1,

              maxHP: 1,

              defeated: false,

            }

          },
        ),

    }


    // ========================================================
    // FORÇAR 20 NATURAL
    // ========================================================

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(
      0.999999,
    )


    // ========================================================
    // INICIAR COMBATE
    // ========================================================

    state =
      CombatTurnEngine.start(
        state,
      )


    // ========================================================
    // EXECUTAR ATAQUE
    // ========================================================

    const result =
      CombatActionEngine.execute(
        context,
        state,
        {
          attacker: hero,
          defender: enemy,
          action: "attack",
        },
      )


    // ========================================================
    // VERIFICAR ATAQUE
    // ========================================================

    expect(
      result.combat.success,
    ).toBe(true)


    expect(
      result.combat.outcome,
    ).toBe(
      "critical_success",
    )


    // ========================================================
    // VERIFICAR DANO
    // ========================================================

    expect(
      result.combat.damage,
    ).toBeGreaterThan(0)


    // ========================================================
    // VERIFICAR FIM DO COMBATE
    // ========================================================

    expect(
      result.state.finished,
    ).toBe(true)


    // ========================================================
    // VERIFICAR DERROTA
    // ========================================================

    const defender =
      result.state.participants
        .find(
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


    // ========================================================
    // NÃO DEVE EXISTIR PRÓXIMO TURNO
    // ========================================================

    const next =
      CombatTurnEngine.nextTurn(
        result.state,
      )


    expect(
      next.activeParticipantId,
    ).toBeNull()


    expect(
      next.finished,
    ).toBe(true)


    vi.restoreAllMocks()

  },
)


  // ==========================================================
  // COMBATE ENCERRADO
  // ==========================================================

  it(
  "não deve permitir novas ações depois do fim do combate",
  () => {

    const hero = createCharacter(
      1,
      "Herói",
      {
        Força: "30",
        Destreza: "14",
        Defesa: "10",
      },
    )

    const enemy = createCharacter(
      2,
      "Goblin",
      {
        Força: "10",
        Destreza: "10",
        Defesa: "1",
      },
    )

    const context = createContext([
      hero,
      enemy,
    ])

    let state = createCombatState([
      hero,
      enemy,
    ])

    /*
     * Garante que o primeiro ataque seja decisivo.
     *
     * O HP do defensor é reduzido para 1,
     * enquanto a rolagem máxima garante sucesso.
     */
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

              currentHP: 1,

              maxHP: 1,

              defeated: false,
            }

          },
        ),
    }

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(
      0.999999,
    )

    // --------------------------------------------------------
    // INICIAR COMBATE
    // --------------------------------------------------------

    state =
      CombatTurnEngine.start(
        state,
      )

    /*
     * Como estamos forçando a iniciativa,
     * garantimos que o herói seja o personagem ativo.
     *
     * Se a iniciativa do inimigo vier maior,
     * ajustamos explicitamente o estado para o cenário
     * que o teste quer verificar.
     */
    state = {
      ...state,

      initiativeOrder: [
        hero.id,
        enemy.id,
      ],

      activeParticipantId:
        hero.id,

      finished: false,
    }

    // --------------------------------------------------------
    // PRIMEIRO ATAQUE
    // --------------------------------------------------------

    const firstAttack =
      CombatActionEngine.execute(
        context,
        state,
        {
          attacker: hero,
          defender: enemy,
          action: "attack",
        },
      )

    expect(
      firstAttack.combat.success,
    ).toBe(true)

    expect(
      firstAttack.state.finished,
    ).toBe(true)

    const defender =
      firstAttack.state.participants.find(
        participant =>
          participant.character.id ===
          enemy.id,
      )

    expect(
      defender,
    ).toBeDefined()

    expect(
      defender!.defeated,
    ).toBe(true)

    expect(
      defender!.currentHP,
    ).toBe(0)

    // --------------------------------------------------------
    // NÃO DEVE SER POSSÍVEL AVANÇAR O TURNO
    // --------------------------------------------------------

    const next =
      CombatTurnEngine.nextTurn(
        firstAttack.state,
      )

    expect(
      next.finished,
    ).toBe(true)

    expect(
      next.activeParticipantId,
    ).toBeNull()

    // --------------------------------------------------------
    // NÃO DEVE SER POSSÍVEL EXECUTAR NOVA AÇÃO
    // --------------------------------------------------------

    expect(() =>
      CombatActionEngine.execute(
        context,
        firstAttack.state,
        {
          attacker: hero,
          defender: enemy,
          action: "attack",
        },
      ),
    ).toThrow(
      "O combate já foi encerrado.",
    )

    vi.restoreAllMocks()
  },
)

})