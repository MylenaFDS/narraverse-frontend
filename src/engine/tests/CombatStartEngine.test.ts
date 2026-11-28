
import {
  describe,
  expect,
  it,
  vi,
  afterEach,
} from "vitest"

import type { Character } from "../../types/character"

import {
  CombatStateEngine,
  type CombatParticipantState,
} from "../combat/CombatState"

import {
  CombatStartEngine,
} from "../combat/CombatStartEngine"

// ============================================================
// HELPERS
// ============================================================

function createCharacter(
  id: number,
  name: string,
): Character {
  return {
    id,
    name,
    is_npc: id !== 1,
  } as unknown as Character
}

function createState() {
  const participants: CombatParticipantState[] = [
    CombatStateEngine.createParticipant(
      createCharacter(1, "Aragorn"),
      30,
    ),
    CombatStateEngine.createParticipant(
      createCharacter(2, "Orc"),
      20,
    ),
    CombatStateEngine.createParticipant(
      createCharacter(3, "Goblin"),
      15,
    ),
  ]

  return CombatStateEngine.create(participants)
}

afterEach(() => {
  vi.restoreAllMocks()
})

// ============================================================
// TESTES
// ============================================================

describe("CombatStartEngine", () => {

  it("deve iniciar combate sem surpresa", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    const state = createState()

    const result =
      CombatStartEngine.start(state)

    expect(result.phase).toBe("initiative")
    expect(result.finished).toBe(false)
    expect(result.activeParticipantId).not.toBeNull()
    expect(result.openingOrder).toEqual([])
  })

  it("deve conceder abertura a um único participante", () => {
    const state = createState()

    const result =
      CombatStartEngine.start(state, {
        participantIds: [1],
      })

    expect(result.phase).toBe("opening")
    expect(result.activeParticipantId).toBe(1)
    expect(result.openingOrder).toEqual([1])
    expect(result.openingIndex).toBe(0)
  })

  it("deve conceder abertura a vários participantes", () => {
    const state = createState()

    const result =
      CombatStartEngine.start(state, {
        participantIds: [1, 2],
      })

    expect(result.phase).toBe("opening")
    expect(result.activeParticipantId).toBe(1)
    expect(result.openingOrder).toEqual([1, 2])
  })

  it("não deve conceder abertura a participantes derrotados", () => {
    const state = createState()

    state.participants[1].defeated = true

    const result =
      CombatStartEngine.start(state, {
        participantIds: [1, 2, 3],
      })

    expect(result.phase).toBe("opening")
    expect(result.openingOrder).toEqual([1, 3])
    expect(result.activeParticipantId).toBe(1)
  })

  it("deve avançar para o próximo participante da abertura", () => {
    const state = createState()

    const opening =
      CombatStartEngine.start(state, {
        participantIds: [1, 2],
      })

    const result =
      CombatStartEngine.advanceOpening(opening)

    expect(result.phase).toBe("opening")
    expect(result.activeParticipantId).toBe(2)
    expect(result.openingIndex).toBe(1)
  })

  it("deve iniciar iniciativa normal após a abertura", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    const state = createState()

    const opening =
      CombatStartEngine.start(state, {
        participantIds: [1, 2],
      })

    const secondAction =
      CombatStartEngine.advanceOpening(opening)

    const result =
      CombatStartEngine.advanceOpening(secondAction)

    expect(result.phase).toBe("initiative")
    expect(result.openingOrder).toEqual([])
    expect(result.openingIndex).toBe(0)
    expect(result.initiativeOrder).toHaveLength(3)
    expect(result.activeParticipantId).not.toBeNull()
  })

  it("não deve iniciar combate se já estiver encerrado", () => {
    const state = createState()

    state.participants[1].defeated = true
    state.participants[2].defeated = true

    const result =
      CombatStartEngine.start(state, {
        participantIds: [1, 2, 3],
      })

    expect(result.finished).toBe(true)
    expect(result.phase).toBe("finished")
    expect(result.activeParticipantId).toBeNull()
  })

  it("não deve avançar abertura se o combate não estiver nessa fase", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)

    const state = createState()

    const initiative =
      CombatStartEngine.start(state)

    const result =
      CombatStartEngine.advanceOpening(initiative)

    expect(result).toBe(initiative)
  })

})
