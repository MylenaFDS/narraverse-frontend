import type { BrainProfile } from "./BrainProfile"

import type { Decision } from "./types/Decision"

export class TraitEvolutionEngine {

  static apply(

    profile: BrainProfile,

    decision: Decision,

  ) {

    switch (decision.action) {

      case "attack":

        profile.personality.courage = Math.min(
          100,
          profile.personality.courage + 0.2,
        )

        profile.personality.cruelty = Math.min(
          100,
          profile.personality.cruelty + 0.1,
        )

        break

      case "talk":

        profile.personality.empathy = Math.min(
          100,
          profile.personality.empathy + 0.15,
        )

        profile.personality.patience = Math.min(
          100,
          profile.personality.patience + 0.1,
        )

        break

      case "escape":

        profile.personality.patience = Math.min(
          100,
          profile.personality.patience + 0.2,
        )

        profile.personality.courage = Math.max(
          0,
          profile.personality.courage - 0.05,
        )

        break

      case "explore":

        profile.personality.curiosity = Math.min(
          100,
          profile.personality.curiosity + 0.25,
        )

        break

    }

  }

}