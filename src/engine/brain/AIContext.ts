import type { Character } from "../../types/character"
import type { WorldContext } from "../context/ContextEngine"

import type { BrainProfile } from "./BrainProfile"

import type { InventoryItem } from "../inventory/InventoryTypes"

import type { CurrentTurn } from "./types/CurrentTurn"
import type { Lore } from "../../types/lore"
import type { Faction } from "../../types/faction"

export interface AIContext {

  // ==========================
  // Mundo
  // ==========================

  world: WorldContext

  currentScene?: unknown

  currentWeather?: unknown

  currentTerrain?: unknown

  currentTurn?: CurrentTurn | null

  // usado pelos Engines de percepção
  scene?: {
    objects?: {
      id: number
      name: string
    }[]

    weather?: string

    light?: string

    terrain?: string

    time?: string
  }

  // ==========================
  // Personagem
  // ==========================

  self: Character

  profile: BrainProfile

  inventory: InventoryItem[]

  // ==========================
  // Pessoas próximas
  // ==========================

  nearbyCharacters: Character[]

  nearbyNPCs: Character[]

  // ==========================
  // Conhecimento
  // ==========================

  nearbyLore: Lore[]

  nearbyFactions: Faction[]

  // aliases usados pelo PerceptionEngine
  visibleLore?: Lore[]

  visibleFactions?: Faction[]

  // ==========================
  // Histórico imediato
  // ==========================

  recentTurns: CurrentTurn[]

  // ==========================
  // Linha do tempo
  // ==========================

  timelineEvents: unknown[]

  // ==========================
  // Estado do RPG
  // ==========================

  timeOfDay?: string

  season?: string

  temperature?: number

  dangerLevel?: number
}