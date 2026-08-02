export interface StoryContext {

  // ======================================
  // Histórico recente
  // ======================================

  recentTurns: string[]

  recentFacts: string[]

  lastActions: string[]

  lastDialogues: string[]

  // ======================================
  // Continuidade narrativa
  // ======================================

  previousSummary?: string

  previousScene?: string

  previousLocation?: string

  previousMood?: string

  // ======================================
  // Estado atual
  // ======================================

  currentSituation: string

  currentLocation?: string

  sceneMood: string

  activeEvents: string[]

  // ======================================
  // Estrutura narrativa
  // ======================================

  storyArc?: string

  chapter?: number

  sceneNumber?: number

  storyPhase?:
    | "opening"
    | "development"
    | "climax"
    | "ending"

  storyTempo?:
    | "slow"
    | "normal"
    | "fast"

  // ======================================
  // Dramaturgia
  // ======================================

  narrativeTension: number

  dominantEmotion?: string

  dramaticQuestion?: string

  expectedClimax?: string

  lastMajorEvent?: string

  lastTurningPoint?: string

  currentConflict?: string

  currentGoal?: string

  currentMystery?: string

  recentConsequences: string[]

  // ======================================
  // Continuidade
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
  // Mundo
  // ======================================

  discoveredLocations: string[]

  discoveredFactions: string[]

  discoveredItems: string[]

  // ======================================
  // Objetivos
  // ======================================

  activeObjectives: string[]

  activeQuests: string[]

  completedObjectives: string[]

  completedQuests: string[]

  // ======================================
  // Resumo dinâmico
  // ======================================

  keywords: string[]

  themes: string[]

  narrativeHooks: string[]

}