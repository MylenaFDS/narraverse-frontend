export interface NarrativeState {

  // ======================================
  // Tipo da cena
  // ======================================

  situation:
    | "combat"
    | "dialogue"
    | "exploration"
    | "investigation"
    | "calm"
    | "unknown"

  // ======================================
  // Intensidade narrativa
  // ======================================

  tension: number

  // ======================================
  // Eventos importantes
  // ======================================

  importantEvents: string[]

  recentCharacters: string[]

  hasConflict: boolean

  hasDeath: boolean

  hasDialogue: boolean

  hasProphecy: boolean

  hasRelationship: boolean

  hasOpenThreads: boolean

  // ======================================
  // Risco
  // ======================================

  isDangerous: boolean

  // ======================================
  // Possibilidades
  // ======================================

  canExplore: boolean

  canInteract: boolean

  canCreateEvent: boolean

  // ======================================
  // Personagens
  // ======================================

  characterCount: number

  // ======================================
  // Direção narrativa
  // ======================================

  narrativeFocus:
    | "action"
    | "emotion"
    | "dialogue"
    | "discovery"
    | "progress"

}