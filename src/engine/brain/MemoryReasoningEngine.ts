import { MemoryEngine } from "../MemoryEngine"

import type { MemoryReasoningResult } from "./MemoryReasoningTypes"

export class MemoryReasoningEngine {

  static analyze(

    characterId: number,

  ): MemoryReasoningResult {

    const memories =

      MemoryEngine

        .getRecent(20)

        .filter(

          memory =>

            memory.characterId ===

            characterId,

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