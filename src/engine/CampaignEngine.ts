import type { WorldContext } from "./context/ContextEngine"

import { MemoryEngine } from "./MemoryEngine"
import { EventEngine } from "./EventEngine"
import { WorldStateEngine } from "./assistant/state/world/WorldStateEngine"

export interface CampaignSnapshot {

  world: WorldContext

  memories: ReturnType<
    typeof MemoryEngine.getAll
  >

  events: ReturnType<
    typeof EventEngine.getAll
  >

  worldState: ReturnType<
    typeof WorldStateEngine.all
  >
}

export class CampaignEngine {

  static snapshot(
    context: WorldContext,
  ): CampaignSnapshot {

    return {

      world: context,

      memories:
        MemoryEngine.getAll(),

      events:
        EventEngine.getAll(),

      worldState:
        WorldStateEngine.all(),
    }
  }

}