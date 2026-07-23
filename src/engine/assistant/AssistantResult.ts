import type { AssistantSuggestion } from "./types/AssistantSuggestion"

export interface AssistantResult {

  // ==========================
  // Resumo da campanha
  // ==========================

  summary: string

  // ==========================
  // Sugestões para o jogador
  // ==========================

  suggestions: AssistantSuggestion[]

  // ==========================
  // Eventos que podem acontecer
  // ==========================

  possibleEvents: AssistantSuggestion[]

  // ==========================
  // Situação da campanha
  // ==========================

  activeConflicts: string[]

  unresolvedThreads: string[]

  // ==========================
  // Personagens
  // ==========================

  aliveCharacters: string[]

  deadCharacters: string[]

  // ==========================
  // Estado da narrativa
  // ==========================

  currentSituation: string

  sceneMood: string

}