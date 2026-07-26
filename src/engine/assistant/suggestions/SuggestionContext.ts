import type { StoryAnalysis } from "../analysis/StoryAnalysis"
import type { NarrativeState } from "../state/NarrativeState"

export interface SuggestionContext {

  // ==================================
  // Contexto completo
  // ==================================

  analysis: StoryAnalysis

  state: NarrativeState

  // ==================================
  // Dados resumidos
  // ==================================

  focus:
    | "combat"
    | "dialogue"
    | "exploration"
    | "investigation"
    | "emotion"

  protagonist?: string

  antagonist?: string

  objective?: string

  location?: string

  tension: number

  canInteract: boolean

  canExplore: boolean

  hasDialogue: boolean

  hasDeath: boolean

  hasOpenThreads: boolean

}