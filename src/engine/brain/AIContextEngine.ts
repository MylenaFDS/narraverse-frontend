import type { Character } from "../../types/character"

import type { InventoryItem } from "../inventory/InventoryTypes"

import type { WorldContext } from "../ContextEngine"

import type { BrainProfile } from "./BrainProfile"

import type { AIContext } from "./AIContext"

export class AIContextEngine {

  static create(

    context: WorldContext,

    profile: BrainProfile,

    inventory: InventoryItem[] = [],

  ): AIContext {

    const self = profile.character

    const nearbyCharacters =
      (context.characters as Character[])
        .filter(
          character =>
            character.id !== self.id,
        )

    const nearbyNPCs =
      (context.npcs as Character[])
        .filter(
          npc =>
            npc.id !== self.id,
        )

    return {

      world: context,

      profile,

      self,

      nearbyCharacters,

      nearbyNPCs,

      nearbyFactions: [],

      nearbyLore: [],

      currentScene:
        context.currentScene,

      currentTurn:
        context.currentTurn,

      currentWeather: undefined,

      currentTerrain: undefined,

      inventory,

    }

  }

}