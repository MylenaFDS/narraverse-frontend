import type { Personality } from "../brain/types/Personality"
import type { EmotionState } from "../brain/types/Emotion"
import type { Decision } from "../brain/types/Decision"
import type { Plan } from "../brain/types/Planning"

export interface WriterPrompt {

  // ======================================
  // Personagem
  // ======================================

  characterName: string

  // ======================================
  // Estado mental
  // ======================================

  personality: Personality

  emotion: EmotionState

  // ======================================
  // Objetivo
  // ======================================

  goal: string | null

  // ======================================
  // Decisão
  // ======================================

  decision: Decision

  // ======================================
  // Plano
  // ======================================

  plan: Plan | null

}