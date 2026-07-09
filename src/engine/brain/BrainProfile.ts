import type { Character } from "../../types/character"

import type { Personality } from "./types/Personality"
import type { EmotionState } from "./types/Emotion"
import type { Goal } from "./types/Goal"
import type { Relationship } from "./types/Relationship"
import type { Knowledge } from "./types/Knowledge"
import type { Belief } from "./types/Belief"
import type { Desire } from "./types/Desire"
import type { Fear } from "./types/Fear"
import type { Trust } from "./types/Trust"
import type { Reputation } from "./types/Reputation"
import type { InventoryItem } from "./types/Inventory"
import type { Habit } from "./types/Habit"

export interface BrainProfile {

  character: Character

  // ==========================
  // Progressão
  // ==========================

  level: number

  experience: number

  skillPoints: number

  evolutionStage: number

  // ==========================
  // Identidade
  // ==========================

  personality: Personality

  emotions: EmotionState

  reputation: Reputation

  // ==========================
  // Motivação
  // ==========================

  goals: Goal[]

  desires: Desire[]

  fears: Fear[]

  beliefs: Belief[]

  // ==========================
  // Relações
  // ==========================

  relationships: Relationship[]

  trust: Trust[]

  // ==========================
  // Conhecimento
  // ==========================

  knowledge: Knowledge[]

  memories: string[]

  inventory: InventoryItem[]

  habits: Habit[]

  // ==========================
  // Estado atual
  // ==========================

  currentGoal?: Goal | null

  currentEmotion?: EmotionState | null

}