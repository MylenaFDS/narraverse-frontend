import type { Character } from "../../types/character"
import type { Lore } from "../../types/lore"
import type { Faction } from "../../types/faction"

import type { WorldContext } from "./ContextEngine"
import type { BrainProfile } from "../brain/BrainProfile"
import type { CurrentTurn } from "../brain/types/CurrentTurn"

export class WorldContextBuilder {

  static build(params: {
    profile: BrainProfile

    characters: Character[]

    npcs: Character[]

    lore: Lore[]

    factions: Faction[]

    recentTurns: CurrentTurn[]
  }): WorldContext {

    return {

      // ======================================
      // Perfil
      // ======================================

      profile: params.profile,

      inventory: params.profile.inventory,

      // ======================================
      // Mundo
      // ======================================

      characters: params.characters,

      npcs: params.npcs,

      lore: params.lore,

      factions: params.factions,

      // ======================================
      // Estado atual
      // ======================================

      currentScene: undefined,

      currentTurn:
        params.recentTurns.length > 0
          ? params.recentTurns[
              params.recentTurns.length - 1
            ]
          : null,

      // ======================================
      // Histórico
      // ======================================

      recentTurns: params.recentTurns,

      timeline: [],

    }

  }

}