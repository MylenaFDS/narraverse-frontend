


import type {
  AIContext,
} from "./AIContext"
import { PersonalityEngine } from "./PersonalityEngine"
import { EmotionEngine } from "./EmotionEngine"
import { GoalEngine } from "./GoalEngine"
import { StrategyEngine } from "./StrategyEngine"
import { DecisionEngine } from "./DecisionEngine"
import { PlanningEngine } from "./PlanningEngine"
import { PredictionEngine } from "./PredictionEngine"
import { MemoryReasoningEngine } from "./MemoryReasoningEngine"
import { InventoryReasoningEngine } from "./InventoryReasoningEngine"
import { WorldReasoningEngine } from "./WorldReasoningEngine"
import { CharacterStateEngine } from "./CharacterStateEngine"
import { RiskAssessmentEngine } from "./RiskAssessmentEngine"
import { TacticalEngine } from "./TacticalEngine"
import { ActionGeneratorEngine } from "./ActionGeneratorEngine"
import { NarrativeContextEngine } from "./NarrativeContextEngine"
import { CharacterSheetAdapter } from "./CharacterSheetAdapter"
import { ReasoningEngine } from "./ReasoningEngine"
import { IntentEngine } from "./IntentEngine"
import { CharacterBehaviorEngine } from "./CharacterBehaviorEngine"
import { ConsequenceEngine } from "./ConsequenceEngine"
import { ReflectionEngine } from "./ReflectionEngine"
import { ExperienceEngine } from "./ExperienceEngine"
import { TraitEvolutionEngine } from "./TraitEvolutionEngine"
import { HabitEngine } from "./HabitEngine"

import type { BrainProfile } from "./BrainProfile"
import type { BrainResult } from "./types/BrainResult"

export class BrainEngine {

  static think(

  context: AIContext,

  profile: BrainProfile,

): BrainResult {
  const worldContext =
  context.world

    // ==========================
    // Personagem
    // ==========================

    const character =
      profile.character

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
    profile.currentEmotion,
  ) 

    const dominantEmotion =
  Object.entries(emotion)
    .sort(
      (a, b) => b[1] - a[1],
    )[0][0] as keyof typeof emotion

    // ==========================
    // Memórias
    // ==========================

    const memory =
      MemoryReasoningEngine.analyze(
        character.id,
      )

    // ==========================
    // Inventário
    // ==========================

    const inventory =
      InventoryReasoningEngine.analyze(
        profile.inventory,
      )

    // ==========================
    // Mundo
    // ==========================

    const world =
  WorldReasoningEngine.analyze(
    worldContext,
  )

    // ==========================
    // Estado
    // ==========================

    const state =
      CharacterStateEngine.build(
        CharacterSheetAdapter.toEngine(
          character,
        ),
      )

    // ==========================
    // Risco
    // ==========================

    const risk =
      RiskAssessmentEngine.analyze(
        state,
        world,
        inventory,
      )

    // ==========================
    // Objetivo
    // ==========================

    const goal =
      GoalEngine.current(
        profile.goals,
      )

    const immediateGoal =
      goal?.title ?? null

    // ==========================
    // Estratégia
    // ==========================

    const strategy =
      StrategyEngine.create(
        personality,
        goal,
        world,
        inventory,
      )

    // ==========================
    // Raciocínio
    // ==========================

    const reasoning =
      ReasoningEngine.think(
        goal,
        strategy,
        state,
        world,
        inventory,
        risk,
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
    // Tática
    // ==========================

    const tactical =
      TacticalEngine.decide({

        health:
          state.wounded
            ? 20
            : 100,

        alliesNearby:
          world.hasAlliesNearby
            ? 1
            : 0,

        enemiesNearby:
          world.hasEnemiesNearby
            ? 1
            : 0,

        hasCover:
          world.isIndoor,

        distanceToTarget: 5,

        isCornered:
          risk.level === "critical",

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
    // Hábitos
    // ==========================

    HabitEngine.update(
      profile.habits,
      decision,
    )

    // ==========================
    // Evolução dos traços
    // ==========================

    TraitEvolutionEngine.apply(
      profile,
      decision,
    )

    // ==========================
    // Intenção
    // ==========================

    const intent =
      IntentEngine.create(
        decision,
      )

    // ==========================
    // Comportamento
    // ==========================

    const behavior =
      CharacterBehaviorEngine.build(
        personality,
        emotion,
        intent,
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
    // Consequências
    // ==========================

    const consequence =
      ConsequenceEngine.predict(
        decision,
      )

    // ==========================
    // Reflexão
    // ==========================

    const reflection =
      ReflectionEngine.analyze(
        decision,
        actionSequence,
        prediction,
        consequence,
      )

    // ==========================
    // Contexto narrativo
    // ==========================

    const narrativeContext =
      NarrativeContextEngine.create({

  profile,

  goal,

  strategy,

  tactical,

  decision,

  plan,

})

    // ==========================
    // Experiência
    // ==========================

    ExperienceEngine.apply(
      profile,
      consequence.success,
    )

    return {

  context: worldContext,

  character,

  level: profile.level,

  experience: profile.experience,

  skillPoints: profile.skillPoints,

  personality,

  emotion,

  dominantEmotion,

  memory,

  inventory,

  world,

  state,

  risk,

  reasoning,

  immediateGoal,

  goal,

  strategy,

  plan,

  tactical,

  decision,

  intent,

  behavior,

  actionSequence,

  prediction,

  consequence,

  reflection,

  narrativeContext,

}

  }

}