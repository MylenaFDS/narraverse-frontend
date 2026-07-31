export interface StoryContext {

  // Histórico recente
  recentTurns: string[]
  recentFacts: string[]
  lastActions: string[]
  lastDialogues: string[]

  // Continuidade
  previousSummary?: string
  previousScene?: string
  previousLocation?: string
  previousMood?: string

  // Estado atual
  currentSituation: string
  currentLocation?: string
  sceneMood: string
  activeEvents: string[]

  // Narrativa
  storyArc?: string
  chapter?: number
  sceneNumber?: number

  unresolvedThreads: string[]
  unansweredQuestions: string[]
  topics: string[]

  // Personagens
  mentionedCharacters: string[]
  focusedCharacter?: string
  lastDialogue?: string

  // Futuro
  activeObjectives: string[]
  discoveredLocations: string[]
  activeQuests: string[]

  // Dramaturgia
  dramaticQuestion?: string
  expectedClimax?: string
  recentConsequences: string[]
}