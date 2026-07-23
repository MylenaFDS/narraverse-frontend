export interface StoryAnalysis {

  // ======================================
  // Estado atual da narrativa
  // ======================================

  activeConflicts: string[]

  currentSituation: string

  sceneMood: string

  // ======================================
  // Personagens
  // ======================================

  activeCharacters: string[]

  deadCharacters: string[]

  focusedCharacter?: string

  // ======================================
  // Histórico recente
  // ======================================

  recentEvents: string[]

  recentDialogue: string[]

  recentFacts: string[]

  // ======================================
  // Continuidade da história
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

}