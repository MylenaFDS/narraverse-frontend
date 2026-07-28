import type {
  AssistantSuggestion,
} from "./types/AssistantSuggestion"

export interface AssistantResult {

  // ======================================
  // Resumo
  // ======================================

  summary: string

  // ======================================
  // Situação atual
  // ======================================

  currentSituation: string

  sceneMood: string

  currentLocation?: string

  // ======================================
  // Sugestões
  // ======================================

  suggestions: AssistantSuggestion[]

  possibleEvents: AssistantSuggestion[]

  // ======================================
  // Personagens
  // ======================================

  aliveCharacters: string[]

  deadCharacters: string[]

  focusedCharacter?: string

  // ======================================
  // Conflitos
  // ======================================

  activeConflicts: string[]

  // ======================================
  // Objetivos
  // ======================================

  activeObjectives: string[]

  activeQuests: string[]

  // ======================================
  // Continuidade narrativa
  // ======================================

  unresolvedThreads: string[]

  unansweredQuestions: string[]

  // ======================================
  // Cenário
  // ======================================

  discoveredLocations: string[]

  topics: string[]

  // ======================================
  // Histórico recente
  // ======================================

  recentEvents: string[]

  recentDialogue: string[]

  recentFacts: string[]

}