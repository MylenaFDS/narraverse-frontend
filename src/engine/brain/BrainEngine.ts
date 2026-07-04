import type { Character } from "../../types/character"
import type { WorldContext } from "../ContextEngine"

import { PersonalityEngine } from "./PersonalityEngine"
import { EmotionEngine } from "./EmotionEngine"
import { GoalEngine } from "./GoalEngine"
import { StrategyEngine } from "./StrategyEngine"
import { DecisionEngine } from "./DecisionEngine"
import { PlanningEngine } from "./PlanningEngine"
import { PredictionEngine } from "./PredictionEngine"
import { MemoryReasoningEngine } from "./MemoryReasoningEngine"
import { TacticalEngine } from "./TacticalEngine"
import { ActionGeneratorEngine } from "./ActionGeneratorEngine"
import { NarrativeContextEngine } from "./NarrativeContextEngine"

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
    // Memórias relevantes
    // ==========================

    const memory =
      MemoryReasoningEngine.analyze(
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
    // Estratégia
    // ==========================

    const strategy =
      StrategyEngine.create(
        profile,
      )

    // ==========================
    // Planejamento
    // ==========================

    const plan =
      goal
        ? PlanningEngine.create(
            goal,
            strategy,
          )
        : null

    // ==========================
    // Situação tática
    // ==========================

    const tactical =
      TacticalEngine.decide({

        health: 100,

        alliesNearby: 1,

        enemiesNearby: 1,

        hasCover: false,

        distanceToTarget: 5,

        isCornered: false,

      })

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
    // Sequência de ações
    // ==========================

    const actionSequence =
      ActionGeneratorEngine.generate(
        decision,
      )

    // ==========================
    // Previsão
    // ==========================

    const prediction =
      PredictionEngine.predict(
        decision,
      )

    // ==========================
    // Contexto narrativo
    // ==========================

    const narrativeContext =
      NarrativeContextEngine.create(

        profile,

        {

          goal,

          strategy,

          tactical,

          decision,

          plan,

        },

      )

    return {

      context,

      character,

      personality,

      emotion,

      memory,

      goal,

      strategy,

      plan,

      tactical,

      decision,

      actionSequence,

      prediction,

      narrativeContext,

    }

  }

}