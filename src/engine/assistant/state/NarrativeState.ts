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

  tension:
    number



  // ======================================
  // Eventos importantes
  // ======================================

  hasDeath:
    boolean


  hasDialogue:
    boolean


  hasOpenThreads:
    boolean


  hasConflict:
    boolean



  // ======================================
  // Risco
  // ======================================

  isDangerous:
    boolean



  // ======================================
  // Possibilidades
  // ======================================

  canExplore:
    boolean


  canInteract:
    boolean


  canCreateEvent:
    boolean



  // ======================================
  // Personagens
  // ======================================

  characterCount:
    number



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