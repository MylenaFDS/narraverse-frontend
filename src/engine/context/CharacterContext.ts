import type { Character } from "../../types/character"

export interface CharacterContext {

  self: Character

  nearbyCharacters: Character[]

  nearbyNPCs: Character[]

}