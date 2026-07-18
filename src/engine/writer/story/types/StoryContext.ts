export interface StoryContext {

  recentTurns: string[]

  lastActions: string[]

  lastDialogues: string[]

  activeEvents: string[]

  unresolvedThreads: string[]

  currentSituation: string


  // ======================================
  // Novo contexto narrativo
  // ======================================

  recentFacts: string[]

  mentionedCharacters: string[]

  topics: string[]

  sceneMood: string

  unansweredQuestions: string[]

  lastDialogue?: string

}