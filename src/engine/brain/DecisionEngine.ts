import type { BrainProfile } from "./BrainProfile"
import type { Decision } from "./DecisionTypes"

export class DecisionEngine {

  static decide(
    profile: BrainProfile,
  ): Decision {

    const goal = profile.goals
      .filter(g => !g.completed)
      .sort(
        (a, b) =>
          b.priority - a.priority,
      )[0]

    if (!goal) {

      return {

        action: "idle",

        probability: 100,

        reason:
          "Nenhum objetivo ativo.",

      }

    }

    if (
      profile.emotions.fear > 80
    ) {

      return {

        action: "flee",

        probability: 95,

        reason:
          "Medo extremamente elevado.",

      }

    }

    if (
      profile.emotions.anger > 80
    ) {

      return {

        action: "attack",

        probability: 90,

        reason:
          "Raiva muito elevada.",

      }

    }

    return {

      action: "advance_goal",

      probability: 85,

      reason:
        goal.title,

    }

  }

}