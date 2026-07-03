import type { BrainProfile } from "./BrainProfile"

import type { Motivation } from "./MotivationTypes"

import { GoalEngine } from "./GoalEngine"
import { DesireEngine } from "./DesireEngine"
import { FearEngine } from "./FearEngine"

export class MotivationEngine {

  static build(
    profile: BrainProfile,
  ): Motivation[] {

    const motivations: Motivation[] = []

    const goal =
      GoalEngine.current(
        profile.goals,
      )

    if (goal) {

      motivations.push({

        action: goal.title,

        weight: goal.priority,

        reason: "Objetivo principal",

      })

    }

    const desire =
      DesireEngine.strongest(
        profile.desires,
      )

    if (desire) {

      motivations.push({

        action: desire.title,

        weight: desire.intensity,

        reason: "Desejo dominante",

      })

    }

    const fear =
      FearEngine.strongest(
        profile.fears,
      )

    if (fear) {

      motivations.push({

        action: `Evitar ${fear.subject}`,

        weight: fear.intensity,

        reason: "Medo",

      })

    }

    return motivations.sort(

      (a, b) =>

        b.weight - a.weight,

    )

  }

}