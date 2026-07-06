import type { AIContext } from "../context/ContextBuilder"

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

import type { BrainProfile } from "./BrainProfile"

export class BrainEngine {

  static think(

    context: AIContext,

    profile: BrainProfile,

  ) {

    // ==========================
    // Personagem
    // ==========================

    const character =
      context.character.self

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
        context,
      )

    // ==========================
    // Estado do personagem
    // ==========================

    const state =
  CharacterStateEngine.build(
    CharacterSheetAdapter.toEngine(
      character,
    ),
  )

    // ==========================
    // Avaliação de risco
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
    // Situação tática
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
// Emoção dominante
// ==========================

const dominantEmotion =
  emotion

// ==========================
// Prioridade imediata
// ==========================

const immediateGoal =
  goal?.title ?? null

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

  narrativeContext,

}

  }}