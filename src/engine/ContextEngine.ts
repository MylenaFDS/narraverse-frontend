// src/engine/ContextEngine.ts

export interface WorldContext {
  rpgId: number

  world: unknown[]
  factions: unknown[]
  lore: unknown[]
  timeline: unknown[]

  characters: unknown[]
  npcs: unknown[]

  currentScene?: unknown
  currentTurn?: unknown
}

export class ContextEngine {
  static build(context: WorldContext) {
    return {
      world: context.world,
      factions: context.factions,
      lore: context.lore,
      timeline: context.timeline,

      characters: context.characters,
      npcs: context.npcs,

      scene: context.currentScene,
      turn: context.currentTurn,
    }
  }
}