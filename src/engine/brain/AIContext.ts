import type { Character } from "../../types/character"

import type { WorldContext } from "../ContextEngine"

import type { BrainProfile } from "./BrainProfile"

import type { InventoryItem } from "../inventory/InventoryTypes"

export interface AIContext {

  world: WorldContext

  profile: BrainProfile

  self: Character

  nearbyCharacters: Character[]

  nearbyNPCs: Character[]

  nearbyFactions: unknown[]

  nearbyLore: unknown[]

  currentScene?: unknown

  currentTurn?: unknown

  currentWeather?: unknown

  currentTerrain?: unknown

  inventory: InventoryItem[]

}