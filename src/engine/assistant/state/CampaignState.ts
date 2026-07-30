import type {
  StoryEvent,
} from "./events/StoryEvent"

export interface CharacterRelationship {

  from: string

  to: string

  type:
    | "personal"
    | "alliance"
    | "friendship"
    | "enemy"
    | "family"

  turn: number

}

export interface CampaignState {

  // ======================================
  // Controle
  // ======================================

  turn: number

  // ======================================
  // Histórico
  // ======================================

  history: StoryEvent[]

  // ======================================
  // Eventos
  // ======================================

  activeEvents: string[]

  // ======================================
  // Personagens
  // ======================================

  aliveCharacters: string[]

  deadCharacters: string[]

  knownCharacters: string[]

  // ======================================
  // Relacionamentos
  // ======================================

  relationships: CharacterRelationship[]

  // ======================================
  // Reputação
  // ======================================

  reputation: Record<string, number>

  // ======================================
  // Mundo
  // ======================================

  discoveredLocations: string[]

  knownLocations: string[]

  discoveredItems: string[]

  discoveredFactions: string[]

  // ======================================
  // Missões
  // ======================================

  activeQuests: string[]

  completedQuests: string[]

  failedQuests: string[]

  activeObjectives: string[]

  completedObjectives: string[]

  // ======================================
  // Memória narrativa
  // ======================================

  recentDialogues: string[]

  recentActions: string[]

  recentFacts: string[]

  unresolvedThreads: string[]

  unansweredQuestions: string[]

  importantMoments: string[]

  // ======================================
  // Estado do mundo
  // ======================================

  worldFlags: Record<string, boolean>

  variables: Record<string, string | number | boolean>

}