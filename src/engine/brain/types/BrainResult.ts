import type { Character } from "../../../types/character"

import type {
  Personality,
  EmotionState,
  Goal,
  Strategy,
  TacticalDecision,
  Decision,
  Plan,
  Intent,
  CharacterBehavior,
  Prediction,
  Consequence,
  Reflection,
  ReasoningResult,
} from "."

export interface BrainResult {

  // Personagem
  character: Character

  // Estado mental
  personality: Personality
  emotion: EmotionState
  dominantEmotion: EmotionState

  // Objetivos
  goal: Goal | null
  immediateGoal: string | null

  // Planejamento
  strategy: Strategy | null
  plan: Plan | null
  tactical: TacticalDecision

  // Decisão
  decision: Decision
  intent: Intent
  behavior: CharacterBehavior

  // Raciocínio
  reasoning: ReasoningResult
  prediction: Prediction
  consequence: Consequence
  reflection: Reflection

  // Progressão
  level: number
  experience: number
  skillPoints: number

}