export interface PerceptionResult {

  // ==========================
  // Personagens
  // ==========================

  visibleCharacters: number[]

  visibleNPCs: number[]

  audibleCharacters: number[]

  // ==========================
  // Mundo
  // ==========================

  visibleLore: number[]

  visibleFactions: number[]

  nearbyObjects: string[]

  // ==========================
  // Ambiente
  // ==========================

  weather?: string

  light?: string

  terrain?: string

  time?: string

}