import { MemoryEngine } from "../MemoryEngine"

import type { BrainProfile } from "./BrainProfile"

import type { MemoryReasoningResult } from "./MemoryReasoningTypes"

export class MemoryReasoningEngine {

  static analyze(

    profile: BrainProfile,

  ): MemoryReasoningResult {

    const memories =

      MemoryEngine

        .getRecent(20)

        .filter(

          memory =>

            memory.characterId ===

            profile.character.id,

        )

        .sort(

          (a, b) =>

            b.importance -

            a.importance,

        )

    return {

      importantMemories:

        memories,

      summary:

        memories

          .slice(0, 5)

          .map(

            memory =>

              memory.title,

          )

          .join(", "),

      emotionalWeight:

        memories.reduce(

          (sum, memory) =>

            sum +

            memory.importance,

          0,

        ),

    }

  }

}