export interface AssistantResult {

  summary: string

  suggestions: string[]

  possibleEvents: string[]

  aliveCharacters: string[]

  deadCharacters: string[]

  activeConflicts: string[]

}