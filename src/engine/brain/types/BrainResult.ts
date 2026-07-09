import type { Character } from "../../../types/character"

import type { Personality } from "./Personality"
import type { EmotionState } from "./Emotion"

import type { Goal } from "./Goal"
import type { Strategy } from "./Strategy"
import type { TacticalDecision } from "./TacticalDecision"
import type { Decision } from "./Decision"
import type { Plan } from "./Planning"

import type { NarrativePrompt } from "./NarrativePrompt"

export interface BrainResult {

  context: unknown

  character: Character

  level: number

  experience: number

  skillPoints: number

  personality: Personality

  emotion: EmotionState

  dominantEmotion: EmotionState

  memory: unknown

  inventory: unknown

  world: unknown

  state: unknown

  risk: unknown

  reasoning: unknown

  immediateGoal: string | null

  goal: Goal | null

  strategy: Strategy | null

  plan: Plan | null

  tactical: TacticalDecision

  decision: Decision

  intent: unknown

  behavior: unknown

  actionSequence: unknown

  prediction: unknown

  consequence: unknown

  reflection: unknown

  narrativeContext: NarrativePrompt

}