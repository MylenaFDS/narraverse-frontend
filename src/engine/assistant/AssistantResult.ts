import type { AssistantSuggestion } from "./types/AssistantSuggestion"


export interface AssistantResult {


  summary: string


  suggestions:
    AssistantSuggestion[]


  possibleEvents:
    AssistantSuggestion[]


  aliveCharacters:
    string[]


  deadCharacters:
    string[]


  activeConflicts:
    string[]


}