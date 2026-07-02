import type { Character } from "../../types/character"
import type { WorldContext } from "../ContextEngine"

import { PersonalityEngine } from "./PersonalityEngine"
import { EmotionEngine } from "./EmotionEngine"
import { GoalEngine } from "./GoalEngine"
import { DecisionEngine } from "./DecisionEngine"
import { PlanningEngine } from "./PlanningEngine"
import { PredictionEngine } from "./PredictionEngine"

import type { BrainProfile } from "./BrainProfile"

export class BrainEngine {

  static think(

    context: WorldContext,

    character: Character,

    profile: BrainProfile,

  ) {

    // ==========================
    // Personalidade
    // ==========================

    const personality =
      PersonalityEngine.build(
        profile,
      )

    // ==========================
    // Emoção atual
    // ==========================

    const emotion =
      EmotionEngine.current(
        profile,
      )

    // ==========================
    // Objetivo principal
    // ==========================

    const goal =
      GoalEngine.current(
        profile.goals,
      )

    // ==========================
    // Planejamento
    // ==========================

    const plan =
      goal
        ? PlanningEngine.create(
            goal,
          )
        : null

    // ==========================
    // Decisão
    // ==========================

    const decision =
      DecisionEngine.decide(

        profile,

        goal?.title ?? null,

        emotion,

      )

    // ==========================
    // Previsão
    // ==========================

    const prediction =
      PredictionEngine.predict(
        decision,
      )

    return {

      context,

      character,

      personality,

      emotion,

      goal,

      plan,

      decision,

      prediction,

    }

  }

}