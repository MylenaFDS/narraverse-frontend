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

export interface BrainProfile {

  character: Character

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
  // ==========================
  // Estado atual
  // ==========================

  currentGoal?: Goal | null

  currentEmotion?: string

}