import type { Character } from "../../types/character"

import type { Lore } from "../../types/lore"

import type { Faction } from "../../types/faction"

import type { InventoryItem } from "../inventory/InventoryTypes"

import type { BrainProfile } from "../brain/BrainProfile"

import type { CurrentTurn } from "../brain/types/CurrentTurn"


// ============================================================
// CENA DO MUNDO
// ============================================================

export interface WorldScene {

  objects?: {

    id: number

    name: string

  }[]

  weather?: string

  light?: string

  terrain?: string

  time?: string

}


// ============================================================
// CONTEXTO DO MUNDO
// ============================================================

export interface WorldContext {

  characters: Character[]

  npcs: Character[]

  lore: Lore[]

  factions: Faction[]

  profile: BrainProfile

  scene?: WorldScene

  inventory: InventoryItem[]

  currentScene?: WorldScene

  currentTurn?: CurrentTurn | null

  currentTerrain?: string

  currentWeather?: string

  recentTurns: CurrentTurn[]

  timeline: unknown[]

  timeOfDay?: string

  season?: string

  temperature?: number

  dangerLevel?: number

}