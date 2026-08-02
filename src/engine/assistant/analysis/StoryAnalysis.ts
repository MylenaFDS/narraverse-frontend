import type {
  StoryEvent,
} from "../state/events/StoryEvent"

export interface StoryAnalysis {

  // ======================================
  // Estado atual
  // ======================================

  activeConflicts: string[]

  currentSituation: string

  sceneMood: string

  narrativeTension?: number

  // ======================================
  // Personagens
  // ======================================

  activeCharacters: string[]

  deadCharacters: string[]

  focusedCharacter?: string

  // ======================================
  // Histórico
  // ======================================

  recentEvents: string[]

  recentDialogue: string[]

  recentFacts: string[]

  // ======================================
  // Continuidade
  // ======================================

  unresolvedThreads: string[]

  unansweredQuestions: string[]

  // ======================================
  // Cenário
  // ======================================

  currentLocation?: string

  discoveredLocations: string[]

  topics: string[]

  // ======================================
  // Objetivos
  // ======================================

  activeObjectives: string[]

  activeQuests: string[]

  // ======================================
  // Eventos estruturados
  // ======================================

  events: StoryEvent[]

  // ======================================
  // Estatísticas narrativas
  // ======================================

  eventCount: number

  importantEventCount: number

  hasDeaths: boolean

  hasDialogue: boolean

  hasCombat: boolean

  hasRelationships: boolean

  hasRevelations: boolean

}