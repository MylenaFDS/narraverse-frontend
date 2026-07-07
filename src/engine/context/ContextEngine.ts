// src/engine/ContextEngine.ts

import type { Character } from "../../types/character"

export interface WorldScene {

  id: number

  title: string

  description?: string

  terrain?: string

  weather?: string

  light?: string

  time?: string

}

export interface WorldTurn {

  id: number

  title?: string

  content?: string

}

export interface WorldContext {

  rpgId: number

  world: unknown[]

  factions: unknown[]

  lore: unknown[]

  timeline: unknown[]

  characters: Character[]

  npcs: Character[]

  currentScene?: WorldScene

  currentTurn?: WorldTurn

}

export class ContextEngine {

  static build(
    context: WorldContext,
  ) {

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