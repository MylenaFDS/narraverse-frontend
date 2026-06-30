export interface MemoryEvent {
  id: string
  type: string

  title: string
  description?: string

  characterId?: number
  loreId?: number
  factionId?: number
  sceneId?: number

  timestamp: number

  importance: number // 1-10
}

export class MemoryEngine {
  private static memories: MemoryEvent[] = []

  static add(memory: MemoryEvent) {
    this.memories.push(memory)
  }

  static getAll() {
    return [...this.memories]
  }

  static getRecent(limit = 20) {
    return [...this.memories]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  static getByCharacter(characterId: number) {
    return this.memories.filter(
      m => m.characterId === characterId
    )
  }

  static getByLore(loreId: number) {
    return this.memories.filter(
      m => m.loreId === loreId
    )
  }

  static getByFaction(factionId: number) {
    return this.memories.filter(
      m => m.factionId === factionId
    )
  }

  static getByScene(sceneId: number) {
    return this.memories.filter(
      m => m.sceneId === sceneId
    )
  }

  static clear() {
    this.memories = []
  }
}