import type { Character } from "../../types/character"

import type { NarrativePrompt } from "../brain/types/NarrativePrompt"

import type { Personality } from "../brain/types/Personality"
import type { EmotionState } from "../brain/types/Emotion"
import type { Goal } from "../brain/types/Goal"
import type { Strategy } from "../brain/types/Strategy"
import type { Plan } from "../brain/types/Planning"
import type { Decision } from "../brain/types/Decision"
import type { CharacterBehavior } from "../brain/types/Behavior"

export interface WriterContext {

  // ======================================
  // Prompt base
  // ======================================

  prompt: NarrativePrompt

  // ======================================
  // Personagem
  // ======================================

  character: Character

  // ======================================
  // Estado mental
  // ======================================

  personality: Personality

  emotion: EmotionState

  goal: Goal | null

  strategy: Strategy | null

  plan: Plan | null

  decision: Decision

  behavior: CharacterBehavior

  // ======================================
  // Configuração da escrita
  // ======================================

  maxWords: number

  firstPerson: boolean

  allowDialogue: boolean

}