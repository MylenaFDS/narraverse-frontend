import type {
  SummaryEvent,
} from "./SummaryEvent"



export interface SummaryData {

  // ======================================
  // Identidade da cena
  // ======================================

  location: string | null

  atmosphere: string | null


  // ======================================
  // Estado narrativo
  // ======================================

  situation: string

  tension: number

  dominantEmotion?: string


  // ======================================
  // Estrutura dramática
  // ======================================

  storyPhase?:
    | "opening"
    | "development"
    | "climax"
    | "ending"

  narrativeFocus?:
    | "character"
    | "conflict"
    | "mystery"
    | "exploration"
    | "relationship"


  // ======================================
  // Eventos relevantes
  // ======================================

  majorEvents: SummaryEvent[]


  // ======================================
  // Desenvolvimento narrativo
  // ======================================

  relationships: string[]

  revelations: string[]

  conflicts: string[]

  objectives: string[]

  quests: string[]


  // ======================================
  // Personagens
  // ======================================

  characters: string[]

  focusedCharacter?: string


  // ======================================
  // Continuidade
  // ======================================

  unresolvedThreads: string[]

  unansweredQuestions: string[]


  // ======================================
  // Consequências
  // ======================================

  consequences: string[]


  // ======================================
  // Elementos de escrita
  // ======================================

  themes: string[]

  narrativeHooks: string[]

}
