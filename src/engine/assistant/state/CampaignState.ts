import type { StoryEvent } from "./events/StoryEvent"

export interface CampaignState {

  // ======================================
  // Controle da campanha
  // ======================================

  turn: number

  // ======================================
  // Histórico completo
  // ======================================

  history: StoryEvent[]

  // ======================================
  // Eventos ativos
  // ======================================

  activeEvents: string[]

  // ======================================
  // Personagens
  // ======================================

  aliveCharacters: string[]

  deadCharacters: string[]

  knownCharacters: string[]

  // ======================================
  // Mundo
  // ======================================

  discoveredLocations: string[]

  knownLocations: string[]

  // ======================================
  // Missões
  // ======================================

  activeQuests: string[]

  completedQuests: string[]

  activeObjectives: string[]

  // ======================================
  // Contexto narrativo
  // ======================================

  recentDialogues: string[]

  recentActions: string[]

  recentFacts: string[]

  unresolvedThreads: string[]

}