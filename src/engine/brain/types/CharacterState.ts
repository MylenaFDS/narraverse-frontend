export interface CharacterState {

  // ==========================
  // Estado universal
  // ==========================

  health: number

  mana: number

  stamina: number

  alive: boolean

  unconscious: boolean

  exhausted: boolean

  // ==========================
  // Compatibilidade
  // ==========================

  conscious: boolean

  canSpeak: boolean

  canMove: boolean

  canFight: boolean

  canCastMagic: boolean

  wounded: boolean

}