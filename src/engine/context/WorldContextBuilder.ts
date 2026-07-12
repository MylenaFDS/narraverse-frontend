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

      profile: params.profile,

      inventory: params.profile.inventory,

      characters: params.characters,

      npcs: params.npcs,

      lore: params.lore,

      factions: params.factions,

      currentScene: undefined,

      currentTurn:
        params.recentTurns.at(-1) ?? null,

      recentTurns: params.recentTurns,

      timeline: [],

    }

  }

}