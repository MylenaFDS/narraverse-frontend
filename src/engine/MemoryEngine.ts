export interface MemoryEvent {

  id: string

  type: string

  title: string

  description?: string

  characterId?: number

  loreId?: number

  factionId?: number

  sceneId?: number

  // =============================
  // NOVO
  // =============================

  emotion?: string

  people?: number[]

  places?: number[]

  tags?: string[]

  confidence?: number

  recalled?: number

  timestamp: number

  importance: number // 1-10

}

export class MemoryEngine {

  private static memories: MemoryEvent[] = []

  static add(
    memory: MemoryEvent,
  ) {

    this.memories.push({

      recalled: 0,

      confidence: 100,

      people: [],

      places: [],

      tags: [],

      ...memory,

    })

  }

  static getAll() {

    return [...this.memories]

  }

  static getRecent(
    limit = 20,
  ) {

    return [...this.memories]

      .sort(
        (a, b) =>
          b.timestamp - a.timestamp,
      )

      .slice(0, limit)

  }

  static getImportant(
    limit = 10,
  ) {

    return [...this.memories]

      .sort((a, b) => {

        const scoreA =
          a.importance +
          (a.recalled ?? 0)

        const scoreB =
          b.importance +
          (b.recalled ?? 0)

        return scoreB - scoreA

      })

      .slice(0, limit)

  }

  static recall(
    id: string,
  ) {

    const memory =
      this.memories.find(
        m => m.id === id,
      )

    if (!memory) return null

    memory.recalled =
      (memory.recalled ?? 0) + 1

    return memory

  }

  static search(
    text: string,
  ) {

    const query =
      text.toLowerCase()

    return this.memories.filter(
      memory =>

        memory.title
          .toLowerCase()
          .includes(query) ||

        memory.description
          ?.toLowerCase()
          .includes(query) ||

        memory.tags?.some(
          tag =>
            tag
              .toLowerCase()
              .includes(query),
        ),
    )

  }

  static getByCharacter(
    characterId: number,
  ) {

    return this.memories.filter(
      memory =>
        memory.characterId ===
        characterId,
    )

  }

  static getByLore(
    loreId: number,
  ) {

    return this.memories.filter(
      memory =>
        memory.loreId === loreId,
    )

  }

  static getByFaction(
    factionId: number,
  ) {

    return this.memories.filter(
      memory =>
        memory.factionId === factionId,
    )

  }

  static getByScene(
    sceneId: number,
  ) {

    return this.memories.filter(
      memory =>
        memory.sceneId === sceneId,
    )

  }

  static forgetLowImportance() {

    this.memories =
      this.memories.filter(
        memory =>
          memory.importance >= 3,
      )

  }

  static clear() {

    this.memories = []

  }

}