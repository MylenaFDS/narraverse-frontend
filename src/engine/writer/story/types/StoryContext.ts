export interface StoryContext {

  // ======================================
  // Histórico recente
  // ======================================

  recentTurns: string[]

  recentFacts: string[]

  lastActions: string[]

  lastDialogues: string[]

  // ======================================
  // Estado atual
  // ======================================

  currentSituation: string

  currentLocation?: string

  sceneMood: string

  activeEvents: string[]

  // ======================================
  // Narrativa
  // ======================================

  unresolvedThreads: string[]

  unansweredQuestions: string[]

  topics: string[]

  // ======================================
  // Personagens
  // ======================================

  mentionedCharacters: string[]

  focusedCharacter?: string

  lastDialogue?: string

  // ======================================
  // Futuro
  // ======================================

  activeObjectives: string[]

  discoveredLocations: string[]

  activeQuests: string[]

}