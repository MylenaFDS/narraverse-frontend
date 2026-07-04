import type { BrainProfile } from "./BrainProfile"

import type {

  NarrativePrompt,

} from "./NarrativePrompt"
import type { BrainResult } from "./BrainResult"
import type { PlanStep } from "./PlanningTypes"


export class NarrativeContextEngine {

  static create(

    profile: BrainProfile,

    brain: BrainResult,

  ): NarrativePrompt {

    return {

      characterName:

        profile.character.name,

      personality:

        JSON.stringify(

          profile.personality,

        ),

      emotion:

        JSON.stringify(

          profile.emotions,

        ),

      objective:

        brain.goal?.title ??

        "Nenhum",

      strategy:

        brain.strategy?.title ??

        "Livre",

      tacticalDecision:

        brain.tactical.action,

      decision:

        brain.decision.action,

      plan:

        brain.plan?.steps.map(

          (step: PlanStep) =>

            step.description,

        ) ?? [],

      recentMemories:

        profile.memories,

      visibleCharacters: [],

      visibleNPCs: [],

      visibleLore: [],

      visibleFactions: [],

    }

  }

}