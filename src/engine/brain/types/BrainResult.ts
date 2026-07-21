import type { Character } from "../../../types/character"

import type { Personality } from "./Personality"
import type { EmotionState } from "./Emotion"
import type { Goal } from "./Goal"
import type { Strategy } from "./Strategy"
import type { TacticalDecision } from "./TacticalDecision"
import type { Decision } from "./Decision"
import type { Plan } from "./Planning"
import type { NarrativePrompt } from "./NarrativePrompt"

import type { CharacterState } from "./CharacterState"
import type { WorldKnowledge } from "./WorldKnowledge"
import type { InventoryKnowledge } from "./InventoryKnowledge"

import type { CharacterBehavior } from "./Behavior"
import type { ActionSequence } from "./ActionSequence"
import type { Consequence } from "./Consequence"
import type { Reflection } from "./Reflection"
import type { Prediction } from "./Prediction"
import type { Intent } from "./Intent"
import type { RiskAssessment } from "./RiskAssessment"
import type { MemoryReasoningResult } from "./MemoryReasoning"
import type { ReasoningResult } from "./Reasoning"
import type {
  WorldContext,
} from "../../context/ContextEngine"

export interface BrainResult {

  // ======================================
  // Contexto
  // ======================================

  context: WorldContext

  character: Character

  // ======================================
  // Progressão
  // ======================================

  level: number

  experience: number

  skillPoints: number

  // ======================================
  // Estado interno
  // ======================================

  personality: Personality

  emotion: EmotionState

  dominantEmotion: keyof EmotionState

  state: CharacterState

  // ======================================
  // Conhecimento
  // ======================================

  world: WorldKnowledge

  inventory: InventoryKnowledge

  memory: MemoryReasoningResult

  // ======================================
  // Objetivos
  // ======================================

  immediateGoal: string | null

  goal: Goal | null

  strategy: Strategy | null

  plan: Plan | null

  // ======================================
  // Decisão
  // ======================================

  tactical: TacticalDecision

  decision: Decision

  intent: Intent

  behavior: CharacterBehavior

  actionSequence: ActionSequence

  risk: RiskAssessment

  // ======================================
  // Futuro
  // ======================================

  prediction: Prediction

  consequence: Consequence

  reflection: Reflection

  // ======================================
  // Escrita
  // ======================================

  reasoning: ReasoningResult

  narrativeContext: NarrativePrompt

}