import type { Character } from "../../types/character"

import type { CharacterContext } from "./CharacterContext"
import type { SceneContext } from "./SceneContext"
import type { TimelineContext } from "./TimelineContext"
import type { WorldContext } from "./WorldContext"
import type { FactionContext } from "./FactionContext"

export interface AIContext {

  world: WorldContext

  scene?: SceneContext

  timeline?: TimelineContext

  faction: FactionContext

  character: CharacterContext

}

export class ContextBuilder {

  static build(

    self: Character,

    context: {

      rpgId: number

      world: unknown[]

      lore: unknown[]

      factions: unknown[]

      characters: Character[]

      npcs: Character[]

      currentScene?: SceneContext

      currentTurn?: TimelineContext

    },

  ): AIContext {

    return {

      world: {

        rpgId: context.rpgId,

        world: context.world,

        lore: context.lore,

      },

      scene:

        context.currentScene,

      timeline:

        context.currentTurn,

      faction: {

        factions:

          context.factions,

      },

      character: {

        self,

        nearbyCharacters:

          context.characters,

        nearbyNPCs:

          context.npcs,

      },

    }

  }

}