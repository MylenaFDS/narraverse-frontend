// WorldState.ts

// ======================================
// Tipos de regiões
// ======================================

export type WorldStateType =
  | "kingdom"
  | "city"
  | "region"
  | "location"
  | "faction"
  | "road"
  | "building"
  | "forest"
  | "dungeon"

// ======================================
// Estado completo do mundo
// ======================================

export interface WorldState {
  // ======================================
  // Identificação
  // ======================================

  id: number

  type: WorldStateType

  name: string

  // ======================================
  // Mundo atual
  // ======================================

  currentRegion: string

  currentLocation: string

  currentKingdom?: string

  currentCity?: string

  currentBiome?: string

  currentDungeon?: string

  // ======================================
  // Tempo
  // ======================================

  weather: string

  season: string

  timeOfDay: string

  day: number

  month: number

  year: number

  elapsedTurns: number

  // ======================================
  // Estado geral
  // ======================================

  dangerLevel: number

  tensionLevel: number

  corruptionLevel: number

  prosperityLevel: number

  stabilityLevel: number

  magicLevel: number

  technologyLevel: number

  populationLevel: number

  // ======================================
  // Compatibilidade com WorldStateEngine
  // ======================================

  ownerId?: number | null

  destroyed: boolean

  occupied: boolean

  underAttack: boolean

  locked: boolean

  discovered: boolean

  stability: number

  prosperity: number

  economy: number

  morale: number

  danger: number

  security: number

  population: number

  climate: string

  // ======================================
  // Guerra
  // ======================================

  warActive: boolean

  siegeActive: boolean

  invasionActive: boolean

  rebellionActive: boolean

  // ======================================
  // Política
  // ======================================

  rulingFaction?: string

  dominantReligion?: string

  government?: string

  // ======================================
  // Eventos
  // ======================================

  activeEvents: string[]

  completedEvents: string[]

  worldFlags: string[]

  // ======================================
  // Locais
  // ======================================

  discoveredLocations: string[]

  destroyedLocations: string[]

  lockedLocations: string[]

  occupiedLocations: string[]

  // ======================================
  // Facções
  // ======================================

  knownFactions: string[]

  alliedFactions: string[]

  hostileFactions: string[]

  neutralFactions: string[]

  // ======================================
  // Tags
  // ======================================

  tags: string[]

  // ======================================
  // Recursos
  // ======================================

  resources: Record<string, number>

  values: Record<string, number>

  flags: Record<string, boolean>

  // ======================================
  // Histórico
  // ======================================

  recentEvents: string[]

  history: string[]

  // ======================================
  // Atualização
  // ======================================

  lastUpdated: number
}